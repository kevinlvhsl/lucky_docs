通常我们使用`vue-cli`开发多页面的时候，不知道您是否注意一个问题没有？

**默认情况：webpack 会将多入口通用的组件库等，打包一个 vendor 的 chunk js 中**

现在假设有两个页面：

> 入口 admin 使用到了`element-ui`组件库和`echarts`图表库，入口 index 使用了`iview`的组件库

## 一、问题描述及解决方案

### 1. 多入口存在的问题

那么这样就会存在问题：

1. 打出来的`chunk-vendor.xxxx.js`会包含`element-ui`和`echarts`和`iview`组件库，所以 js 体积会非常大
2. `chunk-vendor.xxxx.js`默认是所有`node_modules`下面的库集合
3. index 入口只是使用了 iview，由于需要加载`chunk-vendor.xxxx.js`，所以造成了不必要的加载
4. admin 入口 同上 会额外引入 iview

### 2. 我的预期效果

那么针对以上的问题，我们预期应该是怎样的呢？

1. index 入口和 admin 各自单独打包，按需引入各自的库
2. index 和 admin 公用的库 只打包一次

### 3. 可行方案

针对以上的需求，我探索出了一下两种方案：

1. **删除默认 splitChunk 配置，打公共 chunks,单独分离各自的 ui 库**（做减法）
2. **删除默认 splitChunk 配置，抽离公共资源**（做加法）

## 二、方案一:打公共 chunks,单独分离各自的 ui 库

> 方案 1： **删除默认 splitChunk 配置，打公共 chunks,单独分离各自的 ui 库**

`删除默认 splitChunk 配置`是了取消 webpack 的默认配置，因为 webpack 默认的配置是将`node_modules下的`所用到的库打包成一个`chunk-vendor.xxxx.js`。

主要分成三步：

- 第一步： 删除默认 splitChunk 的配置
- 第二步： 单独配出 splitChunk
- 第三部： 为多入口，各自单独配置 chunks

**详细配置如下:**

```js
let pages = {
  index: {
    entry: "src/main.js",
    template: "public/index.html",
    // 特别注意：由于各个入口单独分离了chunk之后，需要将对于的chunk名显示的列出
    chunks: [
      "index", //注意：这个是页面名称的chunk,下面的chunk名称需要对呀splitChunk对应的名称
      "chunk-vendors", //这是node_modules下的chunk
      "chunk-common", //这是admin和Index入口公用的chunk
      "chunk-iview" //index的单独chunk
    ]
  },
  admin: {
    entry: "src/admin.js",
    template: "public/admin.html",
    // 特别注意：由于各个入口单独分离了chunk之后，需要将对于的chunk名显示的列出
    chunks: [
      "admin", //注意：这个是页面名称的chunk,下面的chunk名称需要对呀splitChunk对应的名称
      "chunk-vendors", //这是node_modules下的chunk
      "chunk-common", //这是admin和Index入口公用的chunk
      "chunk-element-ui", //admin的单独chunk
      "chunk-echarts", //admin的单独chunk
      "zrender" //echarts用到了zrender
    ]
  }
};
module.exports = {
  pages,
  publicPath: process.env.BASE_URL,
  outputDir: "dist",
  assetsDir: "assets",
  runtimeCompiler: true,
  productionSourceMap: false,
  parallel: true,
  css: {
    // 是否提取css 生产环境可以配置为 true
    extract: true
  },
  chainWebpack: config => {
    if (process.env.NODE_ENV === "production") {
      // 删除系统默认的splitChunk
      config.optimization.delete("splitChunks");
    }
  },
  configureWebpack: config => {
    // 给输出的js名称添加hash
    config.output.filename = "[name].[hash].js";
    config.output.chunkFilename = "[name].[hash].js";

    config.optimization = {
      splitChunks: {
        cacheGroups: {
          // 抽离所有入口的公用资源为一个chunk
          common: {
            name: "chunk-common",
            chunks: "initial",
            minChunks: 2,
            maxInitialRequests: 5,
            minSize: 0,
            priority: 1,
            reuseExistingChunk: true,
            enforce: true
          },
          // 抽离node_modules下的库为一个chunk
          vendors: {
            name: "chunk-vendors",
            test: /[\\/]node_modules[\\/]/,
            chunks: "initial",
            priority: 2,
            reuseExistingChunk: true,
            enforce: true
          },
          // 由于Index入口使用了iview,所以讲iview单独处理出来，这样admin入口就不会使用此js
          iview: {
            name: "chunk-iview",
            test: /[\\/]node_modules[\\/]iview[\\/]/,
            chunks: "all",
            priority: 3,
            reuseExistingChunk: true,
            enforce: true
          },
          // 由于admin入口使用了element-ui,所以讲element-ui单独处理出来，这样index入口就不会使用此js
          element: {
            name: "chunk-element-ui",
            test: /[\\/]node_modules[\\/]element-ui[\\/]/,
            chunks: "all",
            priority: 3,
            reuseExistingChunk: true,
            enforce: true
          },
          // 由于admin入口使用了echarts,所以讲echarts单独处理出来，这样index入口就不会使用此js
          echarts: {
            name: "chunk-echarts",
            test: /[\\/]node_modules[\\/](vue-)?echarts[\\/]/,
            chunks: "all",
            priority: 4,
            reuseExistingChunk: true,
            enforce: true
          },
          // 由于echarts使用了zrender库，那么需要将其抽离出来，这样就不会放在公共的chunk中
          zrender: {
            name: "zrender",
            test: /[\\/]node_modules[\\/]zrender[\\/]/,
            chunks: "all",
            priority: 3,
            reuseExistingChunk: true,
            enforce: true
          }
        }
      }
    };
  }
};
```

## 三、方案二:删除默认 splitChunk 配置，抽离公共资源

其实告诉你，`webpack`如果是多入口的话，**删除默认的 splitChunk 配置，多入口会单独各自打包，但是公共资源不会抽取**。

针对以上的情况我们可以通过以下三步达到优化目的：

- 第一步：删除默认的 splitChunk
- 第二步：抽离公共的入口资源
- 第三部：为各自入口单独配置 chunks

**详细配置如下**

```js
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
let pages = {
  index: {
    entry: "src/main.js",
    template: "public/index.html",
    chunks: ["index", "chunk-common"] //分别是入口的名称，也就是前面的key值,和公共chunk的名称
  },
  admin: {
    entry: "src/admin.js",
    template: "public/admin.html",
    chunks: ["admin", "chunk-common"] //分别是入口的名称，也就是前面的key值,和公共chunk的名称
  }
};
module.exports = {
  pages,
  publicPath: process.env.BASE_URL,
  outputDir: "dist",
  assetsDir: "assets",
  runtimeCompiler: true,
  productionSourceMap: false,
  parallel: true,
  css: {
    // 是否提取css 生产环境可以配置为 true
    extract: true
  },

  chainWebpack: config => {
    // 删除默认的splitChunk
    config.optimization.delete("splitChunks");
  },
  configureWebpack: config => {
    // js output config
    config.output.filename = "[name].[hash].js";
    config.output.chunkFilename = "[name].[hash].js";

    config.optimization = {
      splitChunks: {
        cacheGroups: {
          common: {
            //抽取所有入口页面都需要的公共chunk
            name: "chunk-common",
            chunks: "initial",
            minChunks: 2,
            maxInitialRequests: 5,
            minSize: 0,
            priority: 1,
            reuseExistingChunk: true,
            enforce: true
          }
        }
      }
    };
  }
};
```

## 四、方案对比

1. 方案一： **删除默认 splitChunk 配置，打公共 chunks,单独分离各自的 ui 库**（做减法）

优点：不需要处理公共 chunk,单独分离各自的 chunk
缺点：如果多入口使用的库比较多，需要各自单独的抽离

**适用场景**

**适用于：多个入口页面耦合性比较强的(也就是多入口使用的公共资源比较多的)，只有少量组件库不同**

2. **删除默认 splitChunk 配置，抽离公共资源**（做加法）

优点：不需要单独分离各自的 chunk，只需要处理公共 chunk 即可
缺点：如果多入口公共库使用的比较多，抽离需要更加细致化

**适用场景**

**适用于：多个入口页面耦合性比较低的（也就是多入口使用的公共资源比较少，通常是多个入口没有任何关系的）**
