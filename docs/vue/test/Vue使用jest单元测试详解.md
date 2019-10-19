文章首发[原文地址](https://mrgaogang.github.io/vue/test/Vue使用jest单元测试详解.html)

工欲善其事必先利其器，使用 jest 做 vue 单元测试前，首先的了解什么是 jest。

> Jest 是一个由 Facebook 开发的测试运行器，致力于提供一个“bettery-included”单元测试解决方案。你可以在其[官方文档](https://jestjs.io/docs/zh-Hans/getting-started)学习到更多 Jest 的知识。

## 一、搭建环境

建议使用 vue-cli3 脚手架，搭建 vue 环境，并使用 vue 创建一个 demo 环境

```bash
npm install -g @vue/cli-service-global
vue create test-demo

//安装依赖

//插件的方式引入（建议使用此种方式）
vue add @vue/unit-jest
yarn add --dev babel-core@^7.0.0-bridge.0

//或者自定义安装
yarn add --dev @babel/preset-env jest babel-jest vue-jest @vue/test-utils babel-core@^7.0.0-bridge.0 jest-transform-stub jest-html-reporter jest-serializer-vue jest-environment-jsdom-fifteen

```

其实使用`@vue/unit-jest`的方式安装 jest 测试环境，也是讲上面的`babel-jest,vue-jest`等依赖统一安装。此处我使用的自定义依赖安装方式以便于更好的介绍。

**依赖说明：**

- @babel/preset-env es6 语法转换
- jest: facebook 测试框架，必需品
- babel-jest: 测试文件默认使用 require 方式引用模块，如果要使用 es6 语法 Import 则需要将代码转换成 es5 语法。
- vue-jest: 告诉 Jest 如何处理 \*.vue 文件，我们需要安装和配置 vue-jest 预处理器;
- @vue/test-utils: 使用 vue-test-utils 测试框架测试。
- babel-core： 要在测试文件中使用 es6 语法，需要使用到 babel-core 转换代码，**注意点：这里的 babel-core 一定是 7.0.0 版本以上的，比如 7.0.0-bridge.0**，很多情况下我们有大量的依赖库，导致 babel-core 的版本降低到 7.0.0 以下，所以我们必须要知道 core 的版本。
- jest-transform-stub：转换文件
- jest-html-reporter: 【可选】代码测试结果展示
- jest-serializer-vue: 做快照测试的咯
- jest-environment-jsdom-fifteen: 【可选】js dom 操作
- jest-watch-typeahead: 【可选】

**如果使用自定义安装方式，请记得将 babel.config.js 修改如下**

```js
module.exports = {
  presets: ["@vue/app", "@babel/preset-env"]
};
```

## 二、jest 环境配置

**如果你不是使用的`vue add @vue/unit-jest`的方式构建 jest 环境，请查看如下配置，否则请忽略！**

此处只是简单介绍我在项目开发中使用到的配置，如果有兴趣请见[官方网址](https://jestjs.io/docs/zh-Hans/configuration)。
等上述工程依赖安装完成之后，请查阅项目根目录使用有一个`jest.config.js`文件，如果不存在建议在根目录下单独创建一个。

`jest.config.js说明`

```js
module.exports = {
  //每个测试脚本都会执行的入口文件，常常我们在这里做一些初始化工作，比如可能项目中引用了一些ui库。
  setupFiles: ["<rootDir>/test/setup"],
  //告诉jest处理那些文件，需要注意，测试vue文件，肯定的加上vue
  moduleFileExtensions: ["js", "vue", "jsx", "json"],
  //别名，类似于webpack中的alias，可自己定义一些别名，方便引入库
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@components/(.*)$": "<rootDir>/src/components/$1",
    "^@plugins": "<rootDir>/test/utils/plugins",
    "^@test": "<rootDir>/test"
  },
  //代码转换配置，此处配置的js/jsx文件使用babel-jest转换成es5
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
    "^.+\\.vue$": "vue-jest", //使用vue-jest转换vue代码
    ".+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$":
      "jest-transform-stub"
  },
  testEnvironment: "jest-environment-jsdom-fifteen",

  //快照测试时使用jest-serializer-vue，
  snapshotSerializers: ["jest-serializer-vue"],
  //jest做单元测试结果展示，一般情况测试结果会在控制台展示出来，如果需要以html的方式展示，可以
  //安装jest-html-reporter，或者 majestic进行结果展示
  //如何自定义展示结果，请见第三章
  reporters: [
    "default",
    [
      "./node_modules/jest-html-reporter",
      {
        pageTitle: "DemoTest",
        includeFailureMsg: true,
        outputPath: "./test-report.html",
        includeConsoleLog: true
      }
    ]
  ],
  //此处很重要，见下文介绍
  transformIgnorePatterns: ["/node_modules/", "/node_modules/(?!(你的ui库))"],

  //正则匹配那些文件需要测试
  testMatch: [
    "**/src/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)",
    "**/test/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)"
  ],

  testURL: "http://localhost/",

  //监听测试文件插件，也可以自定义哦
  watchPlugins: [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname"
  ],
  //是否开启代码测试覆盖率【建议开启】
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["json", "lcov", "text", "clover"],
  //此处必须要添加进行代码测试覆盖率时忽略那些文件
  coveragePathIgnorePatterns: ["/node_modules/", "package.json", "yarn.lock"]
};
```

**transformIgnorePatterns 配置说明**:

`默认情况下jest不会转换任何/node_modules中的代码`,由于 jest 在 node 中运行，因此我们也不必转换任何使用现代 ECMAScript 功能的东西，因为 Node> = 8 已经支持这些功能。
但是在一些情况下，我们确实需要转换 node_modules 中的代码。

- typescript 代码
- 单文件组件(.vue)通过 vue-jest 运行
- 使用 es 的`import/export` 编译成`module.export`
- **你有依赖的 ui 库，并且使用 es6 语法编写**

针对上述四种情况，可以看出，如果你在单元测试文件中有使用到自定义 ui 库的话，则必须告诉 jest，需要编译转换`node_modules`中的那些代码。此处的例子只是介绍了`/node_modules/(?!(你的ui库))`。

## 三、自定义 jest 测试结果

默认情况下 jest 会将展示结果展示在控制台中，那么我们如何自定义 jest 的展示结果呢？请见下文。
其实 jest 在执行完成单元测试之后会将测试结果以对象的方式返回。那么我们如何获取到测试结果，官方文档提供了一个口子，就是`reports`配置。

> 也许很多朋友会说，jest 单元测试支持直接在构建时使用-json 的方式直接获取，但是等你使用 reports 方式获取时，你会发现 Json 结构是不一样的。

**自定义结果收集**

```js
// 自定义报告文件
class MyCustomReporter {
  constructor(globalConfig, options) {
    this._globalConfig = globalConfig;
    this._options = options;
  }

  /**
   **我们可以在测试完成之后使用results获取到测试结果
   */
  onRunComplete(contexts, results) {
    console.log("jest配置: ", this._globalConfig);
    console.log("额外的惨: ", this._options);
    //通过results可以将对象已html/其他方式展示，就看你自己 咯。
  }
}

module.exports = MyCustomReporter;
```

## 四、使用 vue-test-utils 进行 vue 测试

前面已经讲述了 vue 和 jest 环境配置，如果没看的朋友建议先看一下。
那么为什么我们要使用`vue-test-utils`进行单元测试呢？引用官方的一句话`Vue Test Utils 是 Vue.js 官方的单元测试实用工具库。`

如果不了解 Vue Test Utils 的话，建议先去[官网](https://vue-test-utils.vuejs.org/zh/guides/#%E8%B5%B7%E6%AD%A5)学一下。

此处根据 vue 官方提供的例子，简单介绍几个测试用例的编写，具体的测试用例还得根据业务场景去测试。

### 测试点击事件

```js
import { shallowMount } from "@vue/test-utils";
import MessageToggle from "@/components/MessageToggle.vue";
import Message from "@/components/Message.vue";

describe("MessageToggle.vue", () => {
  it("toggles msg passed to Message when button is clicked", () => {
    const wrapper = shallowMount(MessageToggle);
    const button = wrapper.find("#toggle-message");
    button.trigger("click");
    const MessageComponent = wrapper.find(Message);
    expect(MessageComponent.props()).toEqual({ msg: "message" });
    button.trigger("click");
    expect(MessageComponent.props()).toEqual({ msg: "toggled message" });
  });
});
```

### 快照测试

首先我们得明白快照测试的意义,快照测试会将上一次运行(如果没有使用命令更新快照的话)的结果(html)保存一份，以供和下一次单元测试结果进行对比，查看结果(html)是否相同。

**注意理解：此处的和前一次对比，并不是和前面代码的`toMatchSnapshot`结果对比，而是上一次执行单元测试的结果。**

```js
import { shallowMount } from "@vue/test-utils";
import List from "@/components/List.vue";

describe("List.vue", () => {
  it("renders li for each item in props.items", () => {
    const items = ["1", "2"];
    const wrapper = shallowMount(List, {
      propsData: { items }
    });
    expect(wrapper.findAll("li")).toHaveLength(items.length);
  });

  it("matches snapshot", () => {
    const items = ["item 1", "item 2"];
    const wrapper = shallowMount(List, {
      propsData: { items }
    });
    //快照测试
    expect(wrapper.html()).toMatchSnapshot();
  });
});
```

### 插槽测试

```html
//源文件child2.vue

<template>
  <div>
    <span>哈哈哈哈我是child</span>
    <slot name="aa"></slot>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        data: {
          name: "插槽测试-----"
        }
      };
    }
  };
</script>

<style></style>
```

```js
import { mount } from "@vue/test-utils";
import Child from "@/components/child2.vue";

describe("Child", () => {
  it("插槽测试", () => {
    const wrapper = mount(Child, {
      slots: {
        //此处aa对应的是插槽的名字
        aa: ` <div>啦啦啦，我是插槽的数据</div>`
      }
    });

    expect(wrapper.html()).toMatchSnapshot();
  });
});
```

### 作用域插槽测试

```html
//源文件child.vue

<template>
  <div>
    <span>哈哈哈哈我是child</span>
    <slot name="ab" :bb="data"></slot>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        data: {
          name: "测试-----"
        }
      };
    }
  };
</script>

<style></style>
```

```js
//测试用例child.spec.js

import { mount } from "@vue/test-utils";
import Child from "@/components/child.vue";

describe("Child", () => {
  it("作用域插槽测试", () => {
    const wrapper = mount(Child, {
      scopedSlots: {
        //此处ab对应的是插槽的名字
        ab: ` <div slot-scope="data">{{data.bb.name}}啦啦1</div>`
      }
    });

    expect(wrapper.html()).toMatchSnapshot();
  });
});
```

最后，感谢大家的阅读，如果对您有帮助，请记得点个赞哦
[原文地址](https://mrgaogang.github.io/vue/test/Vue使用jest单元测试详解.html)
