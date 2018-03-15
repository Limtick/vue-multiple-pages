const chalk = require('chalk')
const express = require('express')
const compress = require('compression')
const historyApiFallback = require('connect-history-api-fallback')
const httpProxyMiddleware = require('http-proxy-middleware')
const config = require('./config')
const utils = require('./build/utils')

const { PAGES_PATH } = config
let pages = utils.getPages(PAGES_PATH)

const HOST = 'localhost'
const PORT = 3000
const IP = utils.getLocalIP()

const proxyTable = config.dev.proxyTable

let app = express()

app.get('/', (req, res) => {
    res.send('production is run!')
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

app.use('/static', express.static('./dist/static'))

let server = app.listen(PORT, () => {
    Object.keys(pages).forEach(name => {
        let sourcePath = `static/${name}/index.html`
        console.log(chalk.yellow(`check ${name} at`))
        console.log(`http://${HOST}:${PORT}/${sourcePath}`)
        console.log(`http://${IP}:${PORT}/${sourcePath}`)
    })
})