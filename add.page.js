const fs = require('fs')
const path = require('path')
const yargs = require('yargs')
const shell = require('shelljs')
const chalk = require('chalk')
const config = require('./config')
const argv = yargs.argv

const pages = argv._
const FORBIDDEN_PATH = config.build.commonSourcePath.substring(1)

const HTML_TEMPLATE = path.join(__dirname, 'temp_html/index.html')

const ENTRY_PATH = page => path.join(__dirname, 'src/pages/' + page)
const STATIC_RESOURCE_PATH = page => path.join(__dirname, config.build.assetsSubDirectory + '/' + page)

const ENTRY = page => path.join(ENTRY_PATH(page) + '/' + page + '_main.js')
const ENTRY_HTML = page => path.join(ENTRY_PATH(page) + '/' + page + '.html')
const ENTRY_README = page => path.join(ENTRY_PATH(page) + '/README.md')

const currentPages = {}

fs.readdirSync(path.join(__dirname, 'src/pages')).forEach(file => {
    currentPages[file] = 1
})

pages.forEach(page => {
    if (page == FORBIDDEN_PATH) {
        console.log(chalk.red(FORBIDDEN_PATH + ' is not allowed to create! \n'));
        return
    }

    if (currentPages[page]) {
        console.log(
            chalk.green(page) + ' has been created before!\n' +
            'Please check: ' + chalk.yellow(ENTRY_PATH(page))
        )
        return
    }

    shell.mkdir('-p', ENTRY_PATH(page))

    // 创建空入口文件和html
    let html = fs.readFileSync(HTML_TEMPLATE)
    fs.writeFileSync(ENTRY(page), '')
    fs.writeFileSync(ENTRY_HTML(page), html)
    fs.writeFileSync(ENTRY_README(page), '# ' + page)
    
    // 静态资源目录
    shell.mkdir('-p', STATIC_RESOURCE_PATH(page))
    console.log(chalk.green(page + ' created successfully!'));
    console.log('begin in: \n' + ENTRY_PATH(page));
    console.log('add resouces in: \n' + STATIC_RESOURCE_PATH(page) + '\n');
})
