> 简介:由Vue2.0+Webpack4.0+iView3.0+Vuex+Router搭建的Vue开发模板

----


### 如何使用此lucky_vue_template模板？

[Github地址(lucky_vue_template)](https://github.com/MrGaoGang/lucky_vue_template)

``` bash
$ npm install -g vue-cli
$ vue init mrgaogang/lucky_vue_template my-project
$ cd my-project
$ npm install
$ npm run dev
```
此脚手架配套vscode插件: [查看插件](https://github.com/MrGaoGang/lucky_npm)


项目地址:https://github.com/MrGaoGang/lucky_vue_template


### 目录结构


```javascript
|-- lucky_vue
    |-- babel.config.js//babel配置
    |-- index.css//全局css样式
    |-- index.html
    |-- package-lock.json
    |-- package.json
    |-- webpack.base.config.js//webpack打包基础配置
    |-- webpack.dev.config.js//本地环境打包配置
    |-- webpack.prod.config.js//生产打包配置
    |-- dist//打包生产目录
    |   |-- index.html
    |   |-- css
    |   |-- fonts
    |   |-- img
    |   |-- js
    |-- src
        |-- App.vue
        |-- main.js//单页面入口
        |-- modules.js
        |-- components//子组件
        |   |-- Home.vue
        |-- plugins//一些插件
        |   |-- iview.js
        |-- router//页面路由统一配置
        |   |-- index.js
        |-- server//所有服务请求
        |   |-- fetch.js//封装的网络请求
        |   |-- index.js
        |   |-- api
        |   |   |-- index.js//一些api常量
        |   |-- modules//请求模块化
        |       |-- home.js
        |-- store//状态管理
            |-- index.js
            |-- modules//状态管理模块化
                |-- home.js
```

![](/images/vue_template.png)
