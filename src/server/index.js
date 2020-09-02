const compression = require('compression') // gzip压缩的中间件，尽可能先加载这个
const express = require('express')
const http = require('http')
const history = require('connect-history-api-fallback') // 当路由模式为history的时候，后端会直接请求地址栏中的文件，这样就会出现找不到的情况，需要这个中间件处理路由
const { createProxyMiddleware } = require('http-proxy-middleware') // 代理本地请求，实现跨域
const path = require('path')

const port = 3009
const app = express()
const httpServer = http.createServer(app)
const proxyTable = {
  // 代理到不同服务器不同端口的请求
  'api-pre': 'https://faw-pre.maihaoche.com/api',
  'api-m': 'https://faw-liberate-m.maihaoche.net/api',
  'api-h': 'https://faw-liberate-h.maihaoche.net/api',
  'api-c': 'https://faw-liberate-c.maihaoche.net/api',
  'api-o': 'https://faw-liberate-o.maihaoche.net/api',
  'api-u': 'https://faw-liberate-u.maihaoche.net/api',
}

const creatServer = () => {
  app.use(compression()) // 服务器端gzip文件压缩

  Object.keys(proxyTable).map(key => {
    const pathRewrite = {}
    pathRewrite[`^/${key}`] = ''
    app.use(
      `/${key}`,
      createProxyMiddleware({
        // proxy反向代理
        target: proxyTable[key],
        changeOrigin: true,
        pathRewrite,
      }),
    )
  })

  app.use(
    history({
      // 处理单页面 history 路由，当请求满足以下条件的时候，该库会把请求地址转到默认（默认情况为index.html）
      index: './index.html',
    }),
  )
  app.use(express.static(path.join(__dirname, '../dist'))) // express.static: 内置中间件函数,指定资产的目录
  httpServer.listen(port, err => {
    if (err) {
      console.log(err)
      return
    }
    console.log(`%c your server is running at http://localhost:${port}\n`, 'color: skyblue')
  })
}

module.exports = { creatServer }
