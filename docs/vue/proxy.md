开发vue项目，大多数我们都是使用的`vue-cli`，众所周知，我们在本地联调服务API时，会存在跨域问题。那么我们如何利用`cli`解决跨域问题呢？
其实`webpack`官网已有介绍[dev-server#proxy](https://webpack.docschina.org/configuration/dev-server/#devserver-proxy)。

如果你的前端应用和后端 API 服务器没有运行在同一个主机上，你需要在开发环境下将 API 请求代理到 API 服务器。
这个问题可以通过 `vue.config.js` 中的`devServer.proxy` 选项来配置。

```js
module.exports={
 devServer: {
    host: "localhost.company.com",
    proxy: {
        target: 'http://www.example.org', // 目标服务器 host
        changeOrigin: true,               // 主要是这里：默认false，是否需要改变原始主机头为目标URL
        ws: true,                         // 是否代理websockets
        pathRewrite: {
            '^/api/old-path' : '/api/new-path',     // 重写请求，比如我们源访问的是api/old-path，那么请求会被解析为/api/new-path
            '^/api/remove/path' : '/path'           // 同上
        },
        router: {
            // 如果请求主机 == 'dev.localhost:3000',
            // 重写目标服务器 'http://www.example.org' 为 'http://localhost:8000'
            'dev.localhost:3000' : 'http://localhost:8000'
        }
    }
  },
}

```
