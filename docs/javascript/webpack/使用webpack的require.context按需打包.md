前端性能优化中有一个关键点就是：**减少打包体积**
目前常用的按需打包组件的方式有如下几种:

1. **手工`import`所有需要打包的组件**；目前大部分前端 ui 库都使用的这种方式，在入口文件处导出所有的组件。

2. **使用 Lerna 将每个库单独打包，单独发布**：`vue-next`等都使用此种方式，在宿主工程手动引入所需package

那么还有没有其他的方式，做到按需打包呢？**答案是有的**

## 一、 分析场景

现有如下一个工程目录:

```js
├─App.vue
├─assets
│ └─logo.png
├─components
│ └─HelloWorld.vue
├─main.js
├─packages //存放所有组件
│ ├─button
│ │ ├─button-prop.vue  //设计态组件的vue
│ │ └─button.vue //运行时组件的vue
│ └─input
│   ├─input-prop.vue
│   └─input.vue
├─require.js //使用webpack的require.context自动读取packages目录下的组件
└─widget-render.js //运行态组件打包

```

我的工程目录下所有的组件都存放在`packages`目录下。每一个组件又分为:

- 设计态的组件的属性配置面板
- 运行态组件

现在我的要求是：

> 使用`require.context`自动读取`packages`目录下的**运行态组件**，并打包发布。**不允许打包设计态组件**

## 二、解决方案

### 1. 手动使用 import 逐个引入

```js
// widget-render.js
import button from "./packages/button.vue";
import input from "./packages/input.vue";
...
```

显然这不符合我的要求：使用 `require.context`自动读取

### 2. 使用 lerna 管理

使用 lerna 管理，此处不做详情赘述；lerna 管理会将 packages 目录下的组件单独发布成一个包。但是会让用户在用户侧手动`import`多个组件(当然您也可以说 自己创建一个 index.js 做全局引入)。但是这似乎也不太符合我们的要求。

### 2. 使用 webpack 的 alias+externals 实现

首先我们先查看一下`widget-render.js`和`require.js`的内容:
**其主要工作就是使用 require.context 去加载所有的 vue 组件,并同步注册发布**

```js
//require.js

import endsWith from "lodash/endsWith";
/**
 * 加载组件和组件的属性面板
 * @param {*} ignoreProps
 */
export default function(ignoreProps = false) {
  let components = [],
    propComponents = [];
  const requireAll = context => context.keys().map(context);

  const component = require.context("./packages", true, /\.vue$/);

  requireAll(component).forEach(file => {
    let item = file.default;
    if (endsWith(item.name, "prop") && !ignoreProps) {
      propComponents.push({
        key: item.name,
        value: item
      });
    } else if (!endsWith(item.name, "prop") && item.name) {
      components.push({
        key: item.name,
        value: item
      });
    }
  });

  return { components, propComponents };
}
```

```js
import getAllWidgets from "./require";
// 如果你只需要打包组件的话，而忽略属性面板
const widgets = getAllWidgets(true).components;

export { widgets };

export default {
  widgets
};
```

#### （1）默认打包 lib

```json
"scripts": {
    "serve": "vue-cli-service serve",
    "build": "vue-cli-service build",
    "lint": "vue-cli-service lint",
    "lib": "vue-cli-service build --mode lib --target lib src/widget-render.js -name render.js --dest dist-lib"
  }

```

运行

```bash
yarn lib --report
```

其打包的结果为：

<a data-fancybox title="" href="/images/webpack/has-props.png">![](/images/webpack/has-props.png)</a>

展示效果为:

<a data-fancybox title="" href="/images/webpack/success-first.png">![](/images/webpack/success-first.png)</a>

**疑问？**

> 为什么，明明打包出来的组件没有`prop`，但是为何 report 文件中却存在`prop.vue`相关文件呢？

**答案**

> 因为 webpack 的`require.context`会自动去加载`packages`目录下的指定文件，由于上面写的匹配规则为\.vue\。所以也会加载 prop 结尾的文件。并打包到 lib 中。

#### (2) 使用 alias+externals 打包

上面讲到使用默认的 require.context 会将匹配到的文件都统一打包的，那么肯定有朋友说，我把匹配规则写成匹配**非 prop 结尾的文件**。不就可以了吗？ 欢迎尝试。

解决办法：

> 既然以 prop 结尾的文件被打包，那么我们是不是可以利用 webpack 自带的 externals 去排除掉呢？同时将所有以 prop 结尾的文件都设置别名。这样打包即可。

```js
//vue.config.js
module.exports = {
  productionSourceMap: false,
  configureWebpack: config => {
    if (process.env.BUILD_TARGET === "lib") {
      // 将所有匹配的文件都设置一个empty-widget的别名
      config.resolve.alias[/^(\.\/).+(-prop.vue)/] = "empty-widget";
      // 然后利用externals的function模式，对匹配到的文件设置external
      config.externals = [].concat(config.externals || [], [
        function(context, request, callback) {
          if (/^(\.\/).+(-prop.vue)/.test(request)) {
            return callback(null, "empty-widget");
          }
          callback();
        }
      ]);
    }
  }
};
```
其打包的结果为：不存在prop文件了

<a data-fancybox title="" href="/images/webpack/no-prop.png">![](/images/webpack/no-prop.png)</a>

展示效果为:

<a data-fancybox title="" href="/images/webpack/success-two.png">![](/images/webpack/success-two.png)</a>

最后只需要在宿主工程引入一个`yarn add empty-widget`即可。`empty-widget`的体积 19B，可以忽略不计哦。

最后： **其核心思想就是使用占位符的方式，将不需要的打包组件进行占位，从而减少打包体积**




[代码地址](https://github.com/MrGaoGang/webpack-external-files)
