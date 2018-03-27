'use strict'
require('./check-versions')()

process.env.NODE_ENV = 'production'

const ora = require('ora')
const rm = require('rimraf')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const utils = require('./utils')
const config = require('../config')
const webpackConfig = require('./webpack.prod.conf')

/* 
  PAGES_PATH ---- 多页面 Html模板
  ENTRIES_PATH -- 多页面入口文件
  bundleAnalyzerReport
*/
const { PAGES_PATH, ENTRIES_PATH } = config
const needAnalyzerReport = config.build.bundleAnalyzerReport

const getBuildConfig = () => {
  let configs = []
  Object.keys(sourcesPath).forEach(project => {
    let entry = entries[project]
    let template = sourcesPath[project]
    let analyzerPort = bundleAnalyzerPort++
    configs.push(webpackConfig(entry, project, template, analyzerPort))
  })

  return configs
}

let bundleAnalyzerPort = config.build.bundleAnalyzerPort

let sourcesPath = utils.getPages(PAGES_PATH)
let entries = utils.getEntries(ENTRIES_PATH)

const spinner = ora('building for production...')
spinner.start()

// rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  // if (err) throw err

  // if (needAnalyzerReport) {
    // 使用webpack([配置对象](/config/)) 会导致 npm run build --report 不能成功运行
    // 这里使用循环执行webpack命令
    Object.keys(sourcesPath).forEach(project => {
      let entry = entries[project]
      let template = sourcesPath[project]
      let analyzerPort = bundleAnalyzerPort++

      rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory + `/${project}`), err => {
        if (err) throw err

        /* 
         * 生成不同的打包配置
         * entry ------- 入口文件 -------------------- 'src/pages/{project}/{project}_main.js'
         * project ----- 项目名称 会作为资源路径的一部分 '{project}'
         * template ---- HtmlWebpackPlugin 模板路径 -- 'src/pages/{project}/{project}.html'
         */
        webpack(webpackConfig(entry, project, template, analyzerPort), (err, stats) => {
          spinner.stop()
          if (err) throw err

          logInfo(stats)
        })
      })
    })
    // 在这里处理static一级目录下的文件 所有文件需要放在一个文件夹
    utils.copyCommonSource()
  // } else {
  //   webpack(getBuildConfig(), (err, multiStats) => {
  //     spinner.stop()
  //     if (err) throw err
      
  //     let statsGroup = multiStats.stats
  //     Object.keys(statsGroup).forEach(key => {
  //       let stats = statsGroup[key]
  //       logInfo(stats)
  //     })
  //   })
  // }
// })

const logInfo = stats => {
  process.stdout.write('===============================================\n')
  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
    chunks: false,
    chunkModules: false
  }) + '\n\n')
  if (stats.hasErrors()) {
    console.log(chalk.red('  Build failed with errors.\n'))
    process.exit(1)
  }
  console.log(chalk.cyan('  Build complete.\n'))
  console.log(chalk.yellow(
    '  Tip: built files are meant to be served over an HTTP server.\n' +
    '  Opening index.html over file:// won\'t work.\n'
  ))
}
