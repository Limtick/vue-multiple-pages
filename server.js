const chalk = require('chalk')
const express = require('express')
const compress = require('compression')
const yargs = require('yargs')
const historyApiFallback = require('connect-history-api-fallback')
const httpProxyMiddleware = require('http-proxy-middleware')
const config = require('./config')
const utils = require('./build/utils')
const pathMap = require('./pathMap')

const { PAGES_PATH, STATIC_PATH, VERSION_PATH } = config
let pages = utils.getPages(PAGES_PATH)

const argv = yargs.argv

const { port, resource } = argv
const PORT = port || 3000
const RESOURCE_PATH = resource || 'dist'

const HOST_NAME = 'localhost'

// production 是 dist 的一份拷贝 防止重新打包清空dist造成短时间不能访问
const staticPath = `${RESOURCE_PATH}/${STATIC_PATH}`
const IP = utils.getLocalIP()

const proxyTable = config.dev.proxyTable

let app = express()

app.get('/', (req, res) => {
    res.send('production is run!')
})

Object.keys(pathMap).forEach(path => {
    app.get(`${VERSION_PATH}${path}`, (req, res) => {
        res.sendfile(staticPath + VERSION_PATH + pathMap[path])
    })
})

app.use(historyApiFallback())
app.use(compress())

Object.keys(proxyTable).forEach(context => {
    let options = proxyTable[context]
    if (typeof options === 'string') {
        options = {
            target: options
        }
    }
    app.use(httpProxyMiddleware(context, options))
})

app.use(`/${STATIC_PATH}`, express.static(staticPath))

let server = app.listen(PORT, () => {
    Object.keys(pages).forEach(name => {
        let sourcePath = `${STATIC_PATH}${VERSION_PATH}/${name}/index.html`
        console.log(chalk.yellow(`check ${name} at`))
        console.log(`http://${HOST_NAME}:${PORT}/${sourcePath}`)
        console.log(`http://${IP}:${PORT}/${sourcePath}`)
    })
})