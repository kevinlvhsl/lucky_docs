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

## 示例:oview 插件

1. [vue-cli-plugin-oview](https://github.com/MrGaoGang/lucky_tools/blob/master/packages/vue-cli-plugin-oview/README.md)
