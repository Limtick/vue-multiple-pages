const fs = require('fs')
const path = require('path')
const yargs = require('yargs')
const shell = require('shelljs')
const chalk = require('chalk')
const config = require('./config')
const argv = yargs.argv

const pages = argv._
const forbidden = config.build.commonSourcePath.substring(1)

const TEMPLATE_PATH = path.join(__dirname, 'template_page')
const ENTRY_PATH = page => path.join(__dirname, 'src/pages/' + page)
const STATIC_RESOURCE_PATH = page => path.join(__dirname, config.build.assetsSubDirectory + '/' + page)

const HTML_TEMPLATE = path.join(TEMPLATE_PATH, 'index.html')
const ENTRY_TEMPLATE = path.join(TEMPLATE_PATH, 'index.js')
const APP_TEMPLATE = path.join(TEMPLATE_PATH, 'App.vue')

const ENTRY_HTML = page => path.join(ENTRY_PATH(page) + '/' + page + '.html')
const ENTRY_MAIN = page => path.join(ENTRY_PATH(page) + '/' + page + '_main.js')
const ENTRY_APP = page => path.join(ENTRY_PATH(page) + '/App.vue')

const ENTRY_README = page => path.join(ENTRY_PATH(page) + '/README.md')

const currentPages = {}

fs.readdirSync(path.join(__dirname, 'src/pages')).forEach(file => {
    currentPages[file] = 1
})

pages.forEach(page => {
    if (page == forbidden) {
        console.log(chalk.red(forbidden + ' is not allowed to create'));
        return
    }

    if (currentPages[page]) {
        console.log(
            chalk.yellow(page) + chalk.red(' has been created before!\n') +
            'Please check: ' + chalk.yellow(ENTRY_PATH(page))
        )
        return
    }

    shell.mkdir('-p', ENTRY_PATH(page))

    // 创建入口文件 目前默认是新建vue单页项目
    // todo 增加是否新建为vue单页项目配置项
    let html = fs.readFileSync(HTML_TEMPLATE)
    let entry = fs.readFileSync(ENTRY_TEMPLATE)
    let app = fs.readFileSync(APP_TEMPLATE)

    fs.writeFileSync(ENTRY_HTML(page), html)
    fs.writeFileSync(ENTRY_MAIN(page), entry)
    fs.writeFileSync(ENTRY_APP(page), app)

    fs.writeFileSync(ENTRY_README(page), '# ' + page)

    // 静态资源目录
    shell.mkdir('-p', STATIC_RESOURCE_PATH(page))
    fs.writeFileSync(path.join(STATIC_RESOURCE_PATH(page) + '/.gitkeep'), '')
    console.log(chalk.yellow(page) + chalk.green(' successfully created!'));
    console.log('begin in: \n' + chalk.yellow(ENTRY_PATH(page)));
    console.log('add static resouces in: \n' + chalk.yellow(STATIC_RESOURCE_PATH(page)) + '\n');
})
