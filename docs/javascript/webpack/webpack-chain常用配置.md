[webpack-chain](https://github.com/neutrinojs/webpack-chain)是什么？`通过链式的方式修改webpack的配置`。

一些列出本人常用的使用webpack-chain的方式修改webpack配置.
整个文件为：

```js
//vue.config.js
module.exports={
  chainWebpack:(webpackConfig)=>{

  }
}
```

## 1、修改entry和output

```js
chainWebpack: config => {
  config.entryPoints.clear() // 会把默认的入口清空
  config.entry('main').add('./src/main.js')//新增入口
  config.entry('routes').add('./src/app-routes.js')//新增入口


   config.output
        .path("dist")
        .filename("[name].[chunkhash].js")
        .chunkFilename("chunks/[name].[chunkhash].js")
        .libraryTarget("umd")
        .library();
}

// 其余的output配置
config.output
  .auxiliaryComment(auxiliaryComment)
  .chunkFilename(chunkFilename)
  .chunkLoadTimeout(chunkLoadTimeout)
  .crossOriginLoading(crossOriginLoading)
  .devtoolFallbackModuleFilenameTemplate(devtoolFallbackModuleFilenameTemplate)
  .devtoolLineToLine(devtoolLineToLine)
  .devtoolModuleFilenameTemplate(devtoolModuleFilenameTemplate)
  .filename(filename)
  .hashFunction(hashFunction)
  .hashDigest(hashDigest)
  .hashDigestLength(hashDigestLength)
  .hashSalt(hashSalt)
  .hotUpdateChunkFilename(hotUpdateChunkFilename)
  .hotUpdateFunction(hotUpdateFunction)
  .hotUpdateMainFilename(hotUpdateMainFilename)
  .jsonpFunction(jsonpFunction)
  .library(library)
  .libraryExport(libraryExport)
  .libraryTarget(libraryTarget)
  .path(path)
  .pathinfo(pathinfo)
  .publicPath(publicPath)
  .sourceMapFilename(sourceMapFilename)
  .sourcePrefix(sourcePrefix)
  .strictModuleExceptionHandling(strictModuleExceptionHandling)
  .umdNamedDefine(umdNamedDefine)

```

## 2、设置别名alias

```js
const path = require('path');
function resolve (dir) {
    return path.join(__dirname, dir)
}
module.exports = {
    lintOnSave: true,
    chainWebpack: (config)=>{
        config.resolve.alias
            .set('@$', resolve('src'))
            .set('assets',resolve('src/assets'))
            .set('components',resolve('src/components'))
            .set('layout',resolve('src/layout'))
            .set('base',resolve('src/base'))
            .set('static',resolve('src/static'))
            .delete('base') // 删掉指定的别名
            // .clear()  会把所有别名都删掉
    }
}

```

## 3、修改代理proxy
devServe的配置，请见[这里](https://www.webpackjs.com/configuration/dev-server/)

```js
  chainWebpack: config => {
    config.devServer.port(8888)
      .open(true)
      .proxy({'/dev': {
                 target: 'http://123.57.153.106:8080/',
                 changeOrigin: true,
                 pathRewrite: {
                   '^/dev': ''
                 }
               }
           })
  }
// chain其他队proxy的配置
config.devServer
  .bonjour(bonjour)
  .clientLogLevel(clientLogLevel)
  .color(color)
  .compress(compress)
  .contentBase(contentBase)
  .disableHostCheck(disableHostCheck)
  .filename(filename)
  .headers(headers)
  .historyApiFallback(historyApiFallback)
  .host(host)
  .hot(hot)
  .hotOnly(hotOnly)
  .https(https)
  .inline(inline)
  .info(info)
  .lazy(lazy)
  .noInfo(noInfo)
  .open(open)
  .openPage(openPage)
  .overlay(overlay)
  .pfx(pfx)
  .pfxPassphrase(pfxPassphrase)
  .port(port)
  .progress(progress)
  .proxy(proxy)
  .public(public)
  .publicPath(publicPath)
  .quiet(quiet)
  .setup(setup)
  .socket(socket)
  .staticOptions(staticOptions)
  .stats(stats)
  .stdin(stdin)
  .useLocalIp(useLocalIp)
  .watchContentBase(watchContentBase)
  .watchOptions(watchOptions)

```

## 4、添加插件及修改插件参数
插件相关配置请见[这里](https://www.webpackjs.com/configuration/plugins/#plugins)

**添加插件**

```js
// 添加API
config
  .plugin(name)
  .use(WebpackPlugin, args)

// 一个例子
const fileManager = require("filemanager-webpack-plugin");
...
//注意：use部分，不能使用new的方式创建插件实例
webpackConfig.plugin("zip").use(fileManager, [
    {
      onEnd: {
        archive: [
          {
            source: "dist",
            destination: zipName
          }
        ]
      }
    }
  ]);

```

**修改插件参数**

```js
// 可以使用tap方式，修改插件参数
config
  .plugin(name)
  .tap(args => newArgs)

// 一个例子
config
  .plugin('env')
  //使用tag修改参数
  .tap(args => [...args, 'SECRET_KEY']);
```


## 5、修改插件初始化及移除插件

**修改插件初始化**

```js
config
  .plugin(name)
  .init((Plugin, args) => new Plugin(...args));
```

**移除插件**

```js
 chainWebpack: config => {
		config.plugins.delete('prefetch')
		// 移除 preload 插件
		config.plugins.delete('preload');
	}
```

## 6、在xx插件前调用/在xx插件之后调用

有时候需要xx插件在aa插件`之前`调用。

```js
config
  .plugin(name)
    .before(otherName)

// 一个例子：ScriptExtWebpackPlugin插件在HtmlWebpackTemplate插件前调用

config
  .plugin('html-template')
    .use(HtmlWebpackTemplate)
    .end()
  .plugin('script-ext')
    .use(ScriptExtWebpackPlugin)
    .before('html-template');

```

有时候需要xx插件在aa插件`之后`调用。

```js
config
  .plugin(name)
    .after(otherName)

// 一个例子html-template在script-ext之后调用

config
  .plugin('html-template')
    .after('script-ext')
    .use(HtmlWebpackTemplate)
    .end()
  .plugin('script-ext')
    .use(ScriptExtWebpackPlugin);

```

## 7、performance 性能

配置请见webpack参数:[performance](https://www.webpackjs.com/configuration/performance/#performance)

```js
config.performance
  .hints(hints)//false | "error" | "warning"。打开/关闭提示
  .maxEntrypointSize(maxEntrypointSize)//入口起点表示针对指定的入口，对于所有资源，要充分利用初始加载时(initial load time)期间。此选项根据入口起点的最大体积，控制 webpack 何时生成性能提示。默认值是：250000
  .maxAssetSize(maxAssetSize)//资源(asset)是从 webpack 生成的任何文件。此选项根据单个资源体积，控制 webpack 何时生成性能提示。默认值是：250000
  .assetFilter(assetFilter)//此属性允许 webpack 控制用于计算性能提示的文件

```

## 8、代码分割及性能优化 optimizations

- [optimizations配置介绍](https://webpack.js.org/configuration/optimization/)
- [代码分割配置](https://webpack.js.org/plugins/split-chunks-plugin/)
- [代码分割splitChunk中文介绍](https://juejin.im/post/5af1677c6fb9a07ab508dabb)

```js
config.optimization
  .concatenateModules(concatenateModules)
  .flagIncludedChunks(flagIncludedChunks)
  .mergeDuplicateChunks(mergeDuplicateChunks)
  .minimize(minimize) //boolean，默认为true,是否开启压缩
  .namedChunks(namedChunks)
  .namedModules(namedModules)
  .nodeEnv(nodeEnv)
  .noEmitOnErrors(noEmitOnErrors)
  .occurrenceOrder(occurrenceOrder)
  .portableRecords(portableRecords)
  .providedExports(providedExports)
  .removeAvailableModules(removeAvailableModules)
  .removeEmptyChunks(removeEmptyChunks)
  .runtimeChunk(runtimeChunk)
  .sideEffects(sideEffects)
  .splitChunks(splitChunks)//object:代码分割。默认情况下，webpack v4 +为动态导入的模块提供了开箱即用的新通用块策略。
  .usedExports(usedExports)

//举个例子

config.optimization.splitChunks({
     chunks: "async", // 必须三选一： "initial" | "all"(推荐) | "async" (默认就是async)
     minSize: 30000, // 最小尺寸，30000
     minChunks: 1, // 最小 chunk ，默认1
     maxAsyncRequests: 5, // 最大异步请求数， 默认5
     maxInitialRequests : 3, // 最大初始化请求书，默认3
     automaticNameDelimiter: '~',// 打包分隔符
     name: function(){}, // 打包后的名称，此选项可接收 function
     cacheGroups:{ // 这里开始设置缓存的 chunks
         priority: 0, // 缓存组优先级
         vendor: { // key 为entry中定义的 入口名称
             chunks: "initial", // 必须三选一： "initial" | "all" | "async"(默认就是async) 
             test: /react|lodash/, // 正则规则验证，如果符合就提取 chunk
             name: "vendor", // 要缓存的 分隔出来的 chunk 名称 
             minSize: 30000,
             minChunks: 1,
             enforce: true,
             maxAsyncRequests: 5, // 最大异步请求数， 默认1
             maxInitialRequests : 3, // 最大初始化请求书，默认1
             reuseExistingChunk: true // 可设置是否重用该chunk
         }
     }
});


```

## 9、自定义代码压缩工具

webpack4.x默认使用的[TerserPlugin](https://webpack.js.org/plugins/terser-webpack-plugin/)做代码压缩。

```js
//使用
config.optimization.minimizer.use(WebpackPlugin,args);
//删除
config.optimization.minimizers.delete(name)



// 一个例子

config.optimization
  .minimizer('css')
  .use(OptimizeCSSAssetsPlugin, [{ cssProcessorOptions: { safe: true } }])

// Minimizer plugins can also be specified by their path, allowing the expensive require()s to be
// skipped in cases where the plugin or webpack configuration won't end up being used.
config.optimization
  .minimizer('css')
  .use(require.resolve('optimize-css-assets-webpack-plugin'), [{ cssProcessorOptions: { safe: true } }])

//是要tap修改插件参数
config.optimization
  .minimizer('css')
  .tap(args => [...args, { cssProcessorOptions: { safe: false } }])
```

## 10、添加一个新的 Loader

首先请先了解一下webpack如何配置loader.
[官网链接](https://www.webpackjs.com/configuration/module/#module-rules)

```js
config.module
  .rule(name)
    .use(name)
      .loader(loader)
      .options(options)

// 一个例子

 config.module
      .rule('graphql')
      .test(/\.graphql$/)
      .use('graphql-tag/loader')
        .loader('graphql-tag/loader')
        .end()
// 如果是非webpack-chain的话
module:{
  rules:[
    {
      test:/\.graphql$/,
      use::[
        {
          loader:"graphql-tag/loader"
        }
      ]
    }
  ]
}
```

## 11、 修改Loader

```js
// vue.config.js
module.exports = {
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
        .loader('vue-loader')
        .tap(options => {
          // 修改它的选项...
          return options
        })
  }
}
```

> **注意** 对于 CSS 相关 loader 来说，我们推荐使用 `css.loaderOptions` 而不是直接链式指定 loader。这是因为每种 CSS 文件类型都有多个规则，而 css.loaderOptions 可以确保你通过一个地方影响所有的规则。

## 12、 替换一个规则里的 Loader

```js
// vue.config.js
module.exports = {
  chainWebpack: config => {
    const svgRule = config.module.rule('svg')

    // 清除已有的所有 loader。
    // 如果你不这样做，接下来的 loader 会附加在该规则现有的 loader 之后。
    svgRule.uses.clear()

    // 添加要替换的 loader
    svgRule
      .use('vue-svg-loader')
        .loader('vue-svg-loader')
  }
}
```

## 13、使用when做条件配置

```js
consif.when(condition,truthyFunc,falsyFunc)

// 一个例子，当构建生产包时添加minify插件，否则设置构建类型为source-map
// devtool请见：https://www.webpackjs.com/configuration/devtool/
config
  .when(process.env.NODE_ENV === 'production',
    config => config.plugin('minify').use(BabiliWebpackPlugin),
    config => config.devtool('source-map')
  );

```

## 14、使用toString()查看chain对应的webpack配置

**注意**
使用`toString()`生成的数据，不能直接在`webpack`上使用。

```js
config
  .module
    .rule('compile')
      .test(/\.js$/)
      .use('babel')
        .loader('babel-loader');

config.toString();

/*
{
  module: {
    rules: [
      /* config.module.rule('compile') */
      {
        test: /\.js$/,
        use: [
          /* config.module.rule('compile').use('babel') */
          {
            loader: 'babel-loader'
          }
        ]
      }
    ]
  }
}
*/
```


## 参考

- [Vue-cli](https://cli.vuejs.org/zh/guide/webpack.html#%E4%BF%AE%E6%94%B9-loader-%E9%80%89%E9%A1%B9)
- [webpack-chain](https://github.com/neutrinojs/webpack-chain/tree/v5)
