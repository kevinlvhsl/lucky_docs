大多数情况下，我们并不关心 webpack 是怎么做异步加载的，但是作为优秀的前端开发工程师我们需要对异步加载有一定的了解。

在讲解之前，先让我们搭建一个简单的`webpack`工程。

## 一、工程搭建

```json
// package.json文件
{
  "name": "webpack-study",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "author": "",
  "license": "ISC",
  "scripts": {
    "dev": "cross-env NODE_ENV=development webpack",
    "build": "cross-env NODE_ENV=production webpack"
  },
  "dependencies": {
    "cross-env": "^6.0.3",
    "css-loader": "^3.2.0",
    "rimraf": "^3.0.0",
    "webpack": "^4.41.2"
  },
  "devDependencies": {
    "webpack-chain": "^6.0.0",
    "webpack-cli": "^3.3.10"
  }
}
```

这里我使用了`webpack-chain`的方式配置 webpack。有兴趣的朋友可以去了解一下。
[webpack-chain 常用配置](https://mrgaogang.github.io/javascript/webpack/webpack-chain%E5%B8%B8%E7%94%A8%E9%85%8D%E7%BD%AE.html#_1%E3%80%81%E4%BF%AE%E6%94%B9entry%E5%92%8Coutput)

```js
//webpack.config.js
const path = require("path");
const rimraf = require("rimraf");
const Config = require("webpack-chain");
const config = new Config();
const resolve = src => {
  return path.join(process.cwd(), src);
};

// 删除 dist 目录
rimraf.sync("dist");

config
  // 入口
  .entry("src/index")
  .add(resolve("src/index.js"))
  .end()
  // 模式
  // .mode(process.env.NODE_ENV) 等价下面
  .set("mode", process.env.NODE_ENV)
  // 出口
  .output.path(resolve("dist"))
  .filename("[name].bundle.js");

config.module
  .rule("css")
  .test(/\.css$/)
  .use("css")
  .loader("css-loader");

module.exports = config.toConfig();
```

然后在`src`目录下新增两个文件

```js
// index.js

const css = import("./index.css");
const css2 = import("./index2.css");
```

```css
/* index.css和index2.css一样 */
body {
  width: 100%;
  height: 100%;
  background-color: red;
}
```

## 二、原理解析

在讲解之前让我们允许一下，`yarn dev`，对没错，这时您可以在`dist`目录下查看到生成了 3 个文件。
其中`0.bundle.js`和`1.bundle.js`分别对应`index.css和index2.css`。异步加载的模块会产生一个单独的模块。

```js
dist
 ┣ src
 ┃ ┗ index.bundle.js
 ┣ 0.bundle.js
 ┗ 1.bundle.js
```

查看`index.bundle.js`源码，好像很多代码，其实精简下来就是一个自执行函数.

```js
(function(modules) {
  // 模拟 require 语句
  function __webpack_require__() {}
  // 执行存放所有模块数组中的第0个模块
  __webpack_require__((__webpack_require__.s = 0));
})([
  /*存放所有模块的数组*/
]);
```

### （一） chunk.bundle.js 初识

异步加载的 js，打包时会额外的打包成一个 js 文件，比如`0.bundle.js`

```js
(window["webpackJsonp"] = window["webpackJsonp"] || []).push([
  [0],
  {
    "./node_modules/css-loader/dist/runtime/api.js": function(
      module,
      exports,
      __webpack_require__
    ) {
      "use strict";
      eval("...忽略其中的代码");
    },
    // 执行具体的模块代码
    "./src/index.css": function(module, exports, __webpack_require__) {
      eval("...忽略其中的代码");
    }
  }
]);
```

通过分析`0.bundle.js`我们了解到：

- **异步加载的代码，会保存在一个全局的`webpackJsonp`中**
- `webpackJsonp`push 的的值，两个参数分别为
  - 异步加载的文件中存放的需要安装的模块对应的 Chunk ID
  - 异步加载的文件中存放的需要安装的模块列表
- 在`满足某种情况`下，会执行具体模块中的代码，那么在什么时候执行，请查看下面的分析

### （二）初识 bundle.js

- `bundle` 是一个立即执行函数，是入口文件。
- webpack 将所有模块打包成了 bundle 的依赖，通过一个对象注入

#### jsonpScriptSrc

`jsonpScriptSrc`的主要作用是通过`publicPath`+`chunkId`的方式获取到异步加载模块的`url`地址。

```js
function jsonpScriptSrc(chunkId) {
  return __webpack_require__.p + "" + ({}[chunkId] || chunkId) + ".bundle.js";
}
```

#### __webpack_require__

`__webpack_require__`是`webpack`的核心,`webpack`通过`__webpack_require__`引入模块。
`__webpack_require__`对`require`包裹了一层,主要功能是加载 js 文件。

```js
function __webpack_require__(moduleId) {
  //如果需要加载的模块已经被加载过，就直接从内存缓存中返回
  if (installedModules[moduleId]) {
    return installedModules[moduleId].exports;
  }
  //如果缓存中不存在需要加载的模块，就新建一个模块，并把它存在缓存中
  var module = (installedModules[moduleId] = {
    i: moduleId, // 模块在数组中的 index
    l: false, // 该模块是否已经加载完毕
    exports: {} // 该模块的导出值
  });

  // 从 modules 中获取 index 为 moduleId 的模块对应的函数
  // 再调用这个函数，同时把函数需要的参数传入
  modules[moduleId].call(
    module.exports,
    module,
    module.exports,
    __webpack_require__
  );

  // 把这个模块标记为已加载
  module.l = true;

  // Return the exports of the module
  return module.exports;
}
```

#### __webpack_require__.e 异步加载核心

异步加载的核心其实是使用`类jsonp`的方式，通过动态创建`script`的方式实现异步加载。

```js
__webpack_require__.e = function requireEnsure(chunkId) {
  var promises = [];

  // 判断当前chunk是否已经安装，如果已经使用

  var installedChunkData = installedChunks[chunkId];
  // installedChunkData为0表示已经加载了
  if (installedChunkData !== 0) {
    //installedChunkData 不为空且不为0表示该 Chunk 正在网络加载中
    if (installedChunkData) {
      promises.push(installedChunkData[2]);
    } else {
      //installedChunkData 为空，表示该 Chunk 还没有加载过，去加载该 Chunk 对应的文件
      var promise = new Promise(function(resolve, reject) {
        installedChunkData = installedChunks[chunkId] = [resolve, reject];
      });
      promises.push((installedChunkData[2] = promise));

      // 通过 DOM 操作，往 HTML head 中插入一个 script 标签去异步加载 Chunk 对应的 JavaScript 文件
      var script = document.createElement("script");
      var onScriptComplete;

      script.charset = "utf-8";
      script.timeout = 120;
      if (__webpack_require__.nc) {
        script.setAttribute("nonce", __webpack_require__.nc);
      }
      // 文件的路径为配置的 publicPath、chunkId 拼接而成
      script.src = jsonpScriptSrc(chunkId);

      // create error before stack unwound to get useful stacktrace later
      var error = new Error();
      // 当脚本加载完成，执行对应回调
      onScriptComplete = function(event) {
        // 避免IE的内存泄漏
        script.onerror = script.onload = null;
        clearTimeout(timeout);
        // 去检查 chunkId 对应的 Chunk 是否安装成功，安装成功时才会存在于 installedChunks 中
        var chunk = installedChunks[chunkId];
        if (chunk !== 0) {
          if (chunk) {
            var errorType =
              event && (event.type === "load" ? "missing" : event.type);
            var realSrc = event && event.target && event.target.src;
            error.message =
              "Loading chunk " +
              chunkId +
              " failed.\n(" +
              errorType +
              ": " +
              realSrc +
              ")";
            error.name = "ChunkLoadError";
            error.type = errorType;
            error.request = realSrc;
            chunk[1](error);
          }
          installedChunks[chunkId] = undefined;
        }
      };
      // 设置异步加载的最长超时时间
      var timeout = setTimeout(function() {
        onScriptComplete({ type: "timeout", target: script });
      }, 120000);
      // 在 script 加载和执行完成时回调
      script.onerror = script.onload = onScriptComplete;
      document.head.appendChild(script);
    }
  }
  return Promise.all(promises);
};
```

#### webpackJsonpCallback

`webpackJsonpCallback`的主要作用是**每个异步模块加载并安装**。
webpack 会安装对应的 webpackJsonp 文件。

```js
var jsonpArray = (window["webpackJsonp"] = window["webpackJsonp"] || []);
var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
// 重写数组 push 方法，重写之后，每当webpackJsonp.push的时候，就会执行webpackJsonpCallback代码
jsonpArray.push = webpackJsonpCallback;
jsonpArray = jsonpArray.slice();
for (var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
```

```js
function webpackJsonpCallback(data) {
  //chunkIds 异步加载的文件中存放的需要安装的模块对应的 Chunk ID
  //  moreModules 异步加载的文件中存放的需要安装的模块列表
  var chunkIds = data[0];
  var moreModules = data[1];

  //循环去判断对应的chunk是否已经被安装，如果，没有被安装就吧对应的chunk标记为安装。
  var moduleId,
    chunkId,
    i = 0,
    resolves = [];
  for (; i < chunkIds.length; i++) {
    chunkId = chunkIds[i];
    if (
      Object.prototype.hasOwnProperty.call(installedChunks, chunkId) &&
      installedChunks[chunkId]
    ) {
      // 此处的resolves push的是在__webpack_require__.e 异步加载中的 installedChunks[chunkId] = [resolve, reject];的resolve
      resolves.push(installedChunks[chunkId][0]);
    }
    installedChunks[chunkId] = 0;
  }
  for (moduleId in moreModules) {
    if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
      modules[moduleId] = moreModules[moduleId];
    }
  }
  if (parentJsonpFunction) parentJsonpFunction(data);

  while (resolves.length) {
    // 执行异步加载的所有 promise 的 resolve 函数
    resolves.shift()();
  }
}
```

## 三、总结

原理很简单，就是利用的 jsonp 的实现原理加载模块，只是在这里并不是从 server 拿数据而是从其他模块中。
**整体的流程为：**

1. **加载入口 js 文件**,`__webpack_require__(__webpack_require__.s = 0)`
2. **执行入口 js 文件**：modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

- 具体执行的代码为：

```js
(function(module, exports, __webpack_require__) {
  eval(
    'module.exports = __webpack_require__(/*! D:\\webpack\\src\\index.js */"./src/index.js");\n\n\n//# sourceURL=webpack:///multi_./src/index.js?'
  );

  /***/
});

//和
eval(
  '\r\nconst css = __webpack_require__.e(/*! import() */ 0).then(__webpack_require__.t.bind(null, /*! ./index.css */ "./src/index.css", 7))\r\nconst css2 = __webpack_require__.e(/*! import() */ 1).then(__webpack_require__.t.bind(null, /*! ./index2.css */ "./src/index2.css", 7))\r\n\n\n//# sourceURL=webpack:///./src/index.js?'
);
```

3. 由于上述代码分别`__webpack_require__.e`了**0 和 1**，分别使用`类jsonp`的方式异步加载对应 chunk，并**缓存到 promise 的 resolve 中**，并标记对应 chunk 已经加载\*\*

4. 调用对应 chunk 模块时会在 window 上注册一个 webpackJsonp 数组，`window['webpackJsonp'] = window['webpackJsonp'] || []`。并且执行`push`操作。由于`push`操作是使用`webpackJsonpCallback`进行重写的，所以每当执行`push`的时候就会触发`webpackJsonpCallback`. webpackJsonpCallback 标记对应 chunk 已经加载并执行代码。

```js
while (resolves.length) {
  // 执行异步加载的所有 promise 的 resolve 函数
  resolves.shift()();
}
```
5. 完成各个模块的加载

![](/images/js/webpack_code_split.png)