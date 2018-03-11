'use strict'
const path = require('path')
const glob = require('glob')
const yargs = require('yargs')
const config = require('../config')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const packageConfig = require('../package.json')

const argv = yargs.argv
const limitList = argv._
const needLimit = limitList.length != 0
const limitMap = generateLimitMap(limitList)

function generateLimitMap(list) {
  let obj = {}
  list.forEach(name => {
    obj[name] = true
  })
  return obj
}

function assetsPath(_path) {
  const assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory

  return path.posix.join(assetsSubDirectory, _path)
}

exports.assetsPath = assetsPath

exports.sourcesPath = (sourcePath, _path) => {
  const assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory

  return path.posix.join(assetsSubDirectory, sourcePath, _path)
}

/* 
  {
    {project}: 'src/pages/{project}/{project}_main.js'
  }
*/
exports.getEntries = (globPath, separator = '_') => {
  let entries = {}, basename, pathname

  glob.sync(globPath).forEach(entry => {
    basename = path.basename(entry, path.extname(entry))
    // 入口文件 - 命名格式 默认为 {pathname}_main.js 
    // 此处split()[0]为简单处理 - {pathname}不可包含{separator} 否则会取值错误
    pathname = basename.split(separator)[0]
    
    const splitPath = entry.split('/')
    const _len = splitPath.length
    // 入口文件必须在项目的第一级 以此过滤非入口文件的js文件
    const isEntry = splitPath[_len - 2] == pathname
    if (isEntry) entries[pathname] = entry
  })

  if (needLimit) {
    Object.keys(entries).forEach(entry => {
      if (!limitMap[entry]) delete entries[entry]
    })
  }

  return entries
}

/* 
  {
    {project}: 'src/pages/{project}/{project}.html'
  }
*/
exports.getPages = globPath => {
  let pages = {}, basename

  glob.sync(globPath).forEach(page => {
    basename = path.basename(page, path.extname(page))
    pages[basename] = page
  })

  if (needLimit) {
    Object.keys(pages).forEach(page => {
      if (!limitMap[page]) delete pages[page]
    })
  }

  return pages
}

exports.baseLoaders = project => {
  project = project + '/'
  return [
    {
      test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: assetsPath(project + 'img/[name].[hash:7].[ext]')
      }
    },
    {
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: assetsPath(project + 'media/[name].[hash:7].[ext]')
      }
    },
    {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: assetsPath(project + 'fonts/[name].[hash:7].[ext]')
      }
    }
  ]
}

exports.cssLoaders = function (options) {
  options = options || {}

  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]

    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  const output = []
  const loaders = exports.cssLoaders(options)

  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }

  return output
}

exports.createNotifierCallback = () => {
  const notifier = require('node-notifier')

  return (severity, errors) => {
    if (severity !== 'error') return

    const error = errors[0]
    const filename = error.file && error.file.split('!').pop()

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png')
    })
  }
}
