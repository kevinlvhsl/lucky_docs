**Vue 文章目录**

## 一、基础知识系列

- [1. Vue 父组件使用 scoped 无法修改子组件样式](./Vue父组件使用scoped无法修改子组件样式.md)
- [2. Vue 使用 render 函数渲染组件](./Vue使用render函数渲染组件.md)
- [3. Vue 中插件开发的四种方式](./Vue中插件开发的四种方式.md)
- [4. Vue 路由变化页面没有刷新](./Vue路由变化页面没有刷新解决办法.md)
- [5. Vuex 中 Getter,Action,Mutation 函数参数说明](./Vuex中Getter,Action,Mutation函数参数说明.md)

## 二、深入系列

- [1. Vue 响应式原理解析](./deep/Vue响应式原理解析.md)
- [2. Vue CLI 插件开发](./Vue-cli插件开发.md)

## 三、实现方案

- [1. 如何全局显示工具栏](./program/如何全局显示工具栏.md)

## 四、推荐文章系列

- [1. 30 道 Vue 面试题，内含详细讲解](https://juejin.im/post/5d59f2a451882549be53b170#heading-1)
- [2. 记录面试中一些回答不够好的题](https://juejin.im/post/5a9b8417518825558251ce15)
- [3. 滴滴 webapp 5.0 Vue 2.0 重构经验分享 ](https://github.com/DDFE/DDFE-blog/issues/13)
- [4. 现代浏览器观察者 Observer API 指南](https://juejin.im/post/5db10695e51d452a091fde90)

## 五、单元测试

- [1. Vue 使用 jest 单元测试详解](./test/Vue使用jest单元测试详解.md)

## 刘、自动化测试工具

### 1. [vue-styleguidist](https://github.com/vue-styleguidist/vue-styleguidist) (推荐)

- [vue-styleguidist](packages/vue-styleguidist) 使用 [vue-docgen-api](packages/vue-docgen-api) 并创建一个网站站点来展示和开发组件

- [vue-docgen-api](packages/vue-docgen-api) 解析 Vue 组件，生成组件说明文档 api.

- [vue-inbrowser-compiler](packages/vue-inbrowser-compiler) 接受用 es6 编写的 vue 组件代码，并使用 buble 使其与所有浏览器兼容。

- [vue-cli-plugin-styleguidist](packages/vue-cli-plugin-styleguidist) 在[vue-cli 3](https://cli.vuejs.org/guide/)中使用 styleguidist.

### 2. [vue-test-utils](https://github.com/vuejs/vue-test-utils) (推荐)

**Vue Test Utils 是 Vue.js 官方的单元测试实用工具库。**

### 3. [@vue/cli-plugin-unit-jest](https://github.com/vuejs/vue-cli/blob/dev/packages/%40vue/cli-plugin-unit-jest/README.md)（推荐）

**Vue Cli 的 jest 单元测试插件。默认是包含了以下几个库**

- [vue-test-utils](https://github.com/vuejs/vue-test-utils)
- [jest](https://jestjs.io/docs/en/getting-started)

### 4. [majestic](https://github.com/Raathigesh/majestic) (推荐)

**浏览器中显示单元测试结果和代码覆盖率**

![](/images/vue/majestic.png)

### 5. [jest-html-reporter](https://github.com/Hargne/jest-html-reporter)

**Jest 单元测试结果分析**
![](/images/vue/report.png)

## 七、工作中使用的开源项目

### 1. [vue-grid-layout](https://github.com/jbaysolutions/vue-grid-layout)

vue-grid-layout 是一个类似于[Gridster](http://dsmorse.github.io/gridster.js/)的栅格布局系统, 适用于 Vue.js。 **灵感源自于 [React-Grid-Layout](https://github.com/STRML/react-grid-layout)**

- 可拖拽
- 可调整大小
- 静态部件（不可拖拽、调整大小）
- 拖拽和调整大小时进行边界检查
- 增减部件时避免重建栅格
- 可序列化和还原的布局
- 自动化 RTL 支持
- 响应式

### 2. [Vue.Draggable](https://github.com/SortableJS/Vue.Draggable)

**列表拖动最佳选择**

- 支持列表元素拖动，滚动
- 多列表拖动
- 动画切换
- 表格列/行拖动

### 3. [interact.js](https://github.com/taye/interact.js)

**任意元素拖动，最佳选择**

- dom 元素拖动(draggable),设置拖动区(dropzone)
- 可以在线调整 dom 元素大小(resize)
- 惯性和对齐
- 多点触控，同步互动
- 跨浏览器和设备，支持 Chrome，Firefox 和 Opera 以及 Internet Explorer 9+的桌面和移动版本
- 与 SVG 元素的交互
- 是独立的，可定制
- 不修改 DOM 除了更改光标（但你可以禁用它）

### 4. [element-resize-detector](https://github.com/wnr/element-resize-detector)

**优化的浏览器调整元素大小的侦听器**

### 5. [monaco-editor](https://github.com/microsoft/monaco-editor)

**微软在线代码编辑器，最佳选择**

### 6. [set-webpack-public-path plugin for webpack](https://github.com/microsoft/web-build-tools/tree/master/webpack/set-webpack-public-path-plugin)

**解决 webpack 打包 js/image/css，设置不同 publicPath，导致相对路径问题**

### 7. [vue-form-making](https://github.com/GavinZhuLei/vue-form-making)

**在线拖拽，基于 Vue 的表单设计器，让表单开发简单而高效**

### 8. [vue-cli-plugin-electron-builder](https://github.com/nklayman/vue-cli-plugin-electron-builder)(重要)

**使用 Vue 开发 Mac,Windows 应用程序**
