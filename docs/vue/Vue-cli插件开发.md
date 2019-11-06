# Vue Cli 插件开发记录

## 一、什么是 CLI Plugin

引用官方的一段话:

> CLI 插件是一个可以为 `@vue/cli` 项目添加额外特性的 npm 包。它应该始终包含一个 [Service 插件](#service-插件)作为其主要导出，且可选的包含一个 [Generator](#generator) 和一个 [Prompt 文件](#第三方插件的对话)。

通常我们需要将自己的一些配置/公用组件抽出来，以供各个项目使用，在其他使用`cli`创建的工程可以使用`vue add oview`的方式自动引入。

## 二、Vue-cli 插件目录结构

一个典型的 CLI 插件的目录结构看起来是这样的：

```
.
├── README.md
├── generator.js  # generator (可选)
├── prompts.js    # prompt 文件 (可选)
├── index.js      # service 插件
└── package.json
```

如果你需要在插件安装的同时，通过命令行来选择是否创建一些示例组件，那么目录可以改为：

```
.
├── README.md
├── generator
|——-——template
│   └── index.js  # generator
├── prompts.js    # 命令行提示安装
├── index.js      # service 插件
└── package.json


```

## 三、 GeneratorAPI

一个发布为 npm 包的 CLI 插件可以包含一个 `generator.js` 或 `generator/index.js` 文件。插件内的 generator 将会在两种场景下被调用：

- 在一个项目的初始化创建过程中，如果 CLI 插件作为项目创建 preset 的一部分被安装。

- 插件在项目创建好之后通过 `vue invoke` 独立调用时被安装。

### (1) Generator 作用

- 向 `package.json` 注入额外的依赖或字段，并向项目中添加文件
- 使用`ejs`渲染 generator/template 下的文件。

**示例：**

```js
module.exports = (api, options, rootOptions) => {
  // 修改 `package.json` 里的字段
  api.extendPackage({
    scripts: {
      test: "vue-cli-service test"
    }
  });

  // 复制并用 ejs 渲染 `./template` 内所有的文件
  api.render("./template");

  if (options.foo) {
    // 有条件地生成文件
  }
};
```

### (2) GeneratorAPI 参数说明

一个 generator/index 应该导出一个函数，这个函数接收三个参数：

1. 一个 `GeneratorAPI` 实例：

2. 这个插件的 generator 选项。**使用`prompts.js`创建对话的参数**，或从一个保存在 `~/.vuerc` 中的 preset 中加载。例如，如果保存好的 `~/.vuerc` 像如下的这样：

   ```json
   {
     "presets": {
       "foo": {
         "plugins": {
           "@vue/cli-plugin-foo": { "option": "bar" }
         }
       }
     }
   }
   ```

   如果用户使用 preset `foo` 创建了一个项目，那么 `@vue/cli-plugin-foo` 的 generator 就会收到 `{ option: 'bar' }` 作为第二个参数。

   对于一个第三方插件来说，该选项将会解析自对话或用户执行 `vue invoke` 时的命令行参数中 (详见[第三方插件的对话](#第三方插件的对话))。

3. 整个 preset (`presets.foo`) 将会作为第三个参数传入。

### (3) Generator 常用 API

所有 API 详情请见[这里](https://cli.vuejs.org/dev-guide/generator-api.html)，此处列出常用的 API

#### onCreateComplete

- **入参**

  - `{function}`回调函数

- **Usage**:
  当插件文件写入磁盘后的回调函数，常常用来在安装依赖完成之后，做自定义插件使用操作。例如
  在 _src/main.js 中写入`import oView from "oview";Vue.use(oView)`_

```js
api.onCreateComplete(() => {
  let oview = `\nimport oView from 'oview';\n\nVue.use(oView);`;

  const fs = require("fs");
  const mainPath = api.resolve("./src/main.js");
  // 获取内容
  let contentMain = fs.readFileSync(mainPath, {
    encoding: "utf-8"
  });
  if (contentMain.indexOf("oview") === -1) {
    const lines = contentMain.split(/\r?\n/g).reverse();
    // 注入import
    const lastImportIndex = lines.findIndex(line => line.match(/^import/));
    lines[lastImportIndex] += oview;
    // 修改应用
    contentMain = lines.reverse().join("\n");
    fs.writeFileSync(mainPath, contentMain, {
      encoding: "utf-8"
    });
  }
});
```

#### extendPackage

- **入参**

  - `{object | () => object}`

- **使用说明**:
  _在`package.json`中新增依赖_。 除非传递`{merge：false}`，否则嵌套字段是深度合并的。 还解决了插件之间的依赖冲突。 在将文件写入磁盘之前，可以将工具配置字段提取到独立文件中。

#### render

- **入参**

  - `{string | object | FileMiddleware}` - 可以是一下三者中的某个
    - 某个文件夹的相对路径：例如`./template`;
    - `{sourceTemplate：targetFile}`映射的对象哈希;
    - 自定义文件中间件函数
  - `{object} [additionalData]` - 模板可用的其他数据
  - `{object} [ejsOptions]` - ejs 额外参数

- **Usage**:
  使用`ejs`渲染文件到项目结构中

#### resolve

- **入参**

  - `{string} _path` - 相对于工程根目录目录

- **返回值**

  - `{string}`- 文件绝对路径

- **使用说明**:
  获取一个文件/文件夹的绝对路径

#### hasPlugin

判断是否已经存在某个插件了。

- **入参**

  - `{string} id` - 插件 id, 可以省略(@vue/|vue-|@scope/vue)-cli-plugin- 前缀
  - `{string} version` - 版本范围, 可选值

- **返回值**
  - `{boolean}`

#### cliVersion

使用此插件的`@vue/cli`版本

#### cliServiceVersion

使用此插件的`@vue/cli-service`版本。

## 四、Service 插件

#### registerCommand

- 作用：在 cli 中注册一个类似于`vue-cli-service [name]`的命令
- 入参：
  - 命令名称(name),
  - 可选参数(opts)

```
{
  description: string,
  usage: string,
  options: { [string]: string }
}
```

- 回调函数(fn)

**vue-cli-service serve 的例子**

```js
module.exports = (api, options) => {
api.registerCommand('serve', {
    description: 'start development server',
    usage: 'vue-cli-service serve [options] [entry]',
    options: {
      '--open': `open browser on server start`,
      '--copy': `copy url to clipboard on server start`,
      '--mode': `specify env mode (default: development)`,
      '--host': `specify host (default: ${defaults.host})`,
      '--port': `specify port (default: ${defaults.port})`,
      '--https': `use https (default: ${defaults.https})`,
      '--public': `specify the public network URL for the HMR client`,
      '--skip-plugins': `comma-separated list of plugin names to skip for this run`
    }
  }, async function serve (args) {

}
```

#### chainWebpack

什么是 chainWebpack？请见[这里](https://cli.vuejs.org/zh/guide/webpack.html#%E9%93%BE%E5%BC%8F%E6%93%8D%E4%BD%9C-%E9%AB%98%E7%BA%A7)

[webpack-chain 官网](https://github.com/neutrinojs/webpack-chain#getting-started)

- 作用：通过链式的方式修改 webpack 配置
- 入参：回调函数

```js
//一个例子：修改默认的index.html文件
api.chainWebpack(function(config) {
  config.plugin("html").tap(args => {
    args[0].template = "/Users/username/proj/app/templates/index.html";
    return args;
  });
});
```

#### configureWebpack

configureWebpack 修改 webpack 配置有两种方式。[vue 的 configureWebpack 介绍](https://cli.vuejs.org/zh/guide/webpack.html#%E7%AE%80%E5%8D%95%E7%9A%84%E9%85%8D%E7%BD%AE%E6%96%B9%E5%BC%8F)

- configureWebpack 为`Object`类型时，是**合并配置到 webpack 中**

```js
api.configureWebpack: {
    plugins: [
      new MyAwesomeWebpackPlugin()
    ]
}

```

- configureWebpack 为`function`类型时，是**直接修改 webpack 配置**

```js
api.configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置...
    } else {
      // 为开发环境修改配置...
    }
}
```

#### resolveWebpackConfig

得到修改之后的 webpack 配置，通常我们在使用`api.configureWebpack`或者`api.chainWebpack`之后需要得到修改之后的 webpack 值，那么可以使用

```js
api.chainWebpack(webpackConfig => {
  //.....
});
//得到修改之后的webpack值
const webpackConfig = api.resolveWebpackConfig();
```

#### resolveChainableWebpackConfig

返回一个链式的 chainWebpack 配置，resolveWebpackConfig 是直接返回 webpack 的配置，但是 resolveChainableWebpackConfig 返回的一个 chainWebpack

#### version

当前使用的 cli `@vue/cli-service`的版本。

#### getCwd

当前工作目录

#### resolve

- 入参：相对与根目录的目录
- 返回值： 绝对路径

#### hasPlugin

- 作用：检查项目是否已经存在某个插件
- 入参： 插件 id,可以忽略`@vue/|vue-|@scope/vue`前缀；
- 出参： boolean

## 五、 Prompts 对话

创建新项目或向现有项目添加新插件时，需要提示来处理用户的选择。所有提示逻辑都存储在 prompts.js 文件内.

vue 中的 prompt 是使用的[Inquirer](https://github.com/SBoudrias/Inquirer.js);

当用户通过调用初始化插件时 vue invoke，如果插件`prompts.js`的根目录中包含，则会在调用期间使用它。该文件应导出将由 Inquirer.js 处理的一系列问题。

prompt.js 导出可以有两种方式：

- **导出一个问题数组**
- **导出一个处理问题的函数**

在介绍以上两种之前，需要简单的介绍一下`Inquirer.js`的使用

### Inquirer.js

一个问题其实就是一个对象:

```json
{
  type: "input|number|confirm|list|rawlist|expand|checkbox|password|editor".//默认值为输入:input
  name: String,//此问题的id，在后面查找此问题的结果时可以直接使用options.example取到此问题的值
  message:String | Function,//要打印的问题。如果定义为函数，则第一个参数将是当前查询者会话答案。缺省值为name（后跟冒号）
  default:String | Number | Boolean | Array | Function,//如果未输入任何内容，则使用默认值，或者返回默认值的函数。如果定义为函数，则第一个参数将是当前查询者会话答案,
  choices:Array|Function,//(Array | Function）Choices数组或返回choices数组的函数。如果定义为函数，则第一个参数将是当前查询者会话答案。数组值可以是simple numbers，strings或objects包含name（显示在列表中），value（保存在上面讲的name中和short（选择后显示）属性
  validate：Function,//校验输入的值是否符合要求
  filter:Function,//接收用户输入并返回要在程序内部使用的过滤值，过滤的值将会返回到`Answers `中，询问用户是否正确
  when:Boolean|Function,//接收当前用户的答案哈希，并应返回true或false取决于是否应询问此问题
  pageSize:Number,//当使用list,rawList,expand,checkbox的时候可能存在分页
  prefix:String,//更改默认的前缀消息
  suffix:String//更改默认的后缀消息

}
```

### 导出一个问题数组

```js
module.exports = [
  {
    type: "input",
    name: "locale",
    message: "The locale of project localization.",
    validate: input => !!input,
    default: "en"
  }
  // ...
];
```

### 导出处理问题函数

```js
// 入参为package.json
module.exports = pkg => {
  const prompts = [
    {
      type: "input",
      name: "locale",
      message: "The locale of project localization.",
      validate: input => !!input,
      default: "en"
    }
  ];

  // 动态添加问题
  if ("@vue/cli-plugin-eslint" in (pkg.devDependencies || {})) {
    prompts.push({
      type: "confirm",
      name: "useESLintPluginVueI18n",
      message: "Use ESLint plugin for Vue I18n ?"
    });
  }

  return prompts;
};
```

## 六、一个例子 vue-cli-plugin-oview

此实例做什么？

> 使用`vue-cli`插件安装移动端图表库[oview](https://github.com/mrgaogang/oview)，并新增折线图样例。
> [源码地址](https://github.com/MrGaoGang/lucky_tools)

1. **初始化 npm**

```bash
npm init
# 然后输入vue-cli-plugin-oview
```

2. **新建 `index.js`**
   由于不需要注册命令那么只需要编写默认导出即可。

   ```js
   module.exports = (api, opts) => {};
   ```

3. **编写 generator 生成模板**

- 新建 generator 目录
- 新建 index.js 文件
- 新建 template 目录

文件目录为：

```js
├─generator
│ ├─index.js
│ └─template
│   └─src
│     ├─components
│     │ └─Line.vue
│     └─mock
│       └─data.js
├─index.js
├─package.json
├─prompts.js
└─README.md
```

template 目录中方的是示例模板，cli 会使用 ejs 进行渲染。

4. **添加用户确认**
   我们可能需要用户确认是否需要安装实例，

```js
// prompts.js
module.exports = [
  {
    name: "example",
    type: "confirm",
    message: "是否添加示例组件到项目components目录？",
    default: false
  }
];
```

5. **添加依赖，main.js 中声明**

```js
// generator/index.js
module.exports = (api, options, rootOptions) => {
  //在package.json中新增依赖
  api.extendPackage({
    dependencies: {
      oview: "^1.1.2"
    }
  });
  // 当文件写入磁盘时，读取main.js并在main.js中写入import oView from "oview"; Vue.use(oView)
  api.onCreateComplete(() => {
    let oview = `\nimport oView from 'oview';\n\nVue.use(oView);`;

    const fs = require("fs");
    const mainPath = api.resolve("./src/main.js");
    // 获取内容
    let contentMain = fs.readFileSync(mainPath, {
      encoding: "utf-8"
    });
    if (contentMain.indexOf("oview") === -1) {
      const lines = contentMain.split(/\r?\n/g).reverse();
      // 注入import
      const lastImportIndex = lines.findIndex(line => line.match(/^import/));
      lines[lastImportIndex] += oview;
      // 修改应用
      contentMain = lines.reverse().join("\n");
      fs.writeFileSync(mainPath, contentMain, {
        encoding: "utf-8"
      });
    }
  });
  //prompt.js传递的参数
  if (options.example) {
    //渲染template下的模板
    api.render("./template", {
      ...options
    });
  }
};
```

6. **新建实例项目测试插件**

```bash
vue create demo
# 以下路径换成自己的
npm install --save-dev C:\Users\mrgao\Desktop\demo\vue-cli-plugin-oview
# 上面步骤完成，你可以在package.json中查看到此依赖
vue invoke vue-cli-plugin-oview
# 现在你可以看到一个命令，提示你是否添加文件，如果一切OK，那么就可以在package.json中发现oview的依赖，并且main.js中有oview
```

7. **发布到 npm**

```js
1、设置仓库地址为npm官方仓库地址(国内大部分都使用阿里淘宝镜像，如果没改publish会失败)
npm config set registry https://registry.npmjs.org/

2、登陆npm,用户名密码邮箱需要全部匹配
npm login
Username: 你的npm用户名
Password:
Email: (this IS public) 你的邮箱

3、登陆完可以publish了,执行以下命令
npm publish
输出以下信息说明发布成功
+ ngx-xxx@0.0.1
这时登录https://www.npmjs.com/可以看到自己发布的项目


```


给个赞呗！[原文地址](https://mrgaogang.github.io/vue/Vue-cli%E6%8F%92%E4%BB%B6%E5%BC%80%E5%8F%91.html#%E4%B8%80%E3%80%81%E4%BB%80%E4%B9%88%E6%98%AF-cli-plugin)

## 示例:oview 插件

1. [vue-cli-plugin-oview](https://github.com/MrGaoGang/lucky_tools/blob/master/packages/vue-cli-plugin-oview/README.md)
