此文源码案例:[欢迎Star](https://github.com/MrGaoGang/lucky_docs/)

**目录**
- [一、Render 函数参数详解](#一render-函数参数详解)
- [二、样例：如何给表格组件添加表头筛选](#二样例如何给表格组件添加表头筛选)


Vue 组件的开发有几种方式：单文件组件，使用 render 函数渲染，使用 template。

在大多数的情况下，Vue 可以使用单文件/template 的方式来创建页面；然而在有一些情况我们需要使用 JavaScript 的编程能力，比如使用第三方框架时，想要自定义某个功能；这个时候就可以使用到 render 函数。

> 本文将使用 iView table 为例，通过 render 函数添加可搜索的表头筛选。

### 一、Render 函数参数详解

```js
//一个简单的例子：渲染一个p标签，内容为 '我是p标签的内容'
new Vue({
  render: createElement => createElement("p", "我是p标签的内容")
});
```

其实 createElement()还有更强大的参数:

```js
// @returns {VNode}
createElement(
  // {String | Object | Function}
  // 一个 HTML 标签字符串，组件选项对象，或者
  // 解析上述任何一种的一个 async 异步函数。必需参数。
  "div",

  // {Object}
  // 一个包含模板相关属性的数据对象,
  // 你可以在 template 中使用这些特性。可选参数。
  {
    // (详情见下一节)
  },

  // {String | Array}
  // 子虚拟节点 (VNodes)，由 `createElement()` 构建而成，
  // 也可以使用字符串来生成“文本虚拟节点”。可选参数。
  [
    "先写一些文字",
    createElement("h1", "一则头条"),
    createElement(MyComponent, {
      props: {
        someProp: "foobar"
      }
    })
  ]
);
```

> createElement(obj,{},[])

参数详解:

1.  第一个参数为渲染成哪个节点，接受 String,Object,Function 三种类型；
    - 如果是 String,比如是 div，那么表示此标签将会渲染成 div 标签；**String 渲染成普通的 html 标签**
    - **如果是 Object，比如是一个 Vue 的组件:TableFilter，那么表示此标签将会渲染一个组件**。通常我们在单文件组件中使用的时候是 import {Table} from "iview";然后在 template 中引用此标签<Table>；而使用 render 则需要使用 createElement 方式创建一个。
    - 如果是 Function，则可以根据自己的业务逻辑动态觉得是渲染成普通的 html 标签还是 Vue 组件。

2) 第二个参数接受 **一个对象{}类型的数据。其主要作用类似于组件中对某一个节点设置各种 bind 属性：设置样式 style，设置事件 on，设置类 class，设置自定义的命令，设置普通的 html 属性，设置传递参数 props 等等**。

> 有一点要注意：正如在模板语法中，v-bind:class 和 v-bind:style，会被特别对待一样，在 VNode 数据对象中，下列属性名是级别最高的字段。该对象也允许你绑定普通的 HTML 特性，就像 DOM 属性一样，比如 innerHTML (这会取代 v-html 指令)。

```js
{
  // 和`v-bind:class`一样的 API
  // 接收一个字符串、对象或字符串和对象组成的数组
  'class': {
    foo: true,
    bar: false
  },
  // 和`v-bind:style`一样的 API
  // 接收一个字符串、对象或对象组成的数组
  style: {
    color: 'red',
    fontSize: '14px'
  },
  // 普通的 HTML 特性
  attrs: {
    id: 'foo'
  },
  // 组件 props
  props: {
    myProp: 'bar'
  },
  // DOM 属性
  domProps: {
    innerHTML: 'baz'
  },
  // 事件监听器基于 `on`，当子组件使用$emit()方式发生，使用on接收
  // 所以不再支持如 `v-on:keyup.enter` 修饰器
  // 需要手动匹配 keyCode。
  on: {
    click: this.clickHandler
  },
  // 仅用于组件，用于监听原生事件，而不是组件内部使用
  // `vm.$emit` 触发的事件。
  nativeOn: {
    click: this.nativeClickHandler
  },
  // 自定义指令。注意，你无法对 `binding` 中的 `oldValue`
  // 赋值，因为 Vue 已经自动为你进行了同步。
  directives: [
    {
      name: 'my-custom-directive',
      value: '2',
      expression: '1 + 1',
      arg: 'foo',
      modifiers: {
        bar: true
      }
    }
  ],
  // 作用域插槽格式
  // { name: props => VNode | Array<VNode> }
  scopedSlots: {
    default: props => createElement('span', props.text)
  },
  // 如果组件是其他组件的子组件，需为插槽指定名称
  slot: 'name-of-slot',
  // 其他特殊顶层属性
  key: 'myKey',
  ref: 'myRef',
  // 如果你在渲染函数中向多个元素都应用了相同的 ref 名，
  // 那么 `$refs.myRef` 会变成一个数组。
  refInFor: true
}

```

你会发现使用 render 函数没有与 v-model 的直接对应 - 你必须自己实现相应的逻辑：比如

```js
props: ['value'],
render: function (createElement) {
  var self = this
  return createElement('input', {
    domProps: {
      value: self.value
    },
    on: {
      input: function (event) {
        self.$emit('input', event.target.value)
      }
    }
  })
}

```

3. 第三个参数为列表类型的数据，表示当前渲染组件的有哪些子组件。

```js
render(createElement=>
    return createElement(
    'div',
    {
    
    },
    // {String | Array}
    // 子虚拟节点 (VNodes)，由 `createElement()` 构建而成，
    // 也可以使用字符串来生成“文本虚拟节点”。可选参数。
    [//
        '先写一些文字',
        createElement('h1', '一则头条'),
        createElement(MyComponent, {
        props: {
            someProp: 'foobar'
        }
        })
    ]
    ))

```
注意：子组件中的每一项（VNodes）都必须是唯一的;意味着，下面的 render function 是无效的：

```js
render: function (createElement) {
  var myParagraphVNode = createElement('p', 'hi')
  return createElement('div', [
    // 错误-重复的 VNodes
    myParagraphVNode, myParagraphVNode
  ])
}
```


### 二、样例：如何给表格组件添加表头筛选

效果图:

<img src="https://github.com/MrGaoGang/lucky_docs/blob/master/images/table-filter.png?raw=true" width=600 height=300 />

iview的默认table组件不支持 表头输入框筛选，[官方地址](https://www.iviewui.com/components/table#ZDYLMB)
此处默认您有了一定的vue开发基础。
套用iview官方的例子：
```js
//显示表格的例子
<template>
  <Table border :columns="columns7" :data="data6"></Table>
</template>
<script>
import { Table ,Button,Icon,Modal} from "iview";
import Vue from "vue";
export default {
  components: {
    Table
  },
  data() {
    return {
      columns7: [
        {
          title: "Name",
          key: "name",
          //使用render函数自定义列显示效果：文本加粗
          render: (h, params) => {
            return h("div", [//使用render渲染一个div标签
              h(Icon, {//使用render渲染一个iview的组件
                props: {//传递参数
                  type: "person"
                }
              }),
              h("strong", params.row.name)//文字加粗
            ]);
          }
        },
        {
          title: "Age",
          key: "age"
        },
        {
          title: "Address",
          key: "address"
        },
        {
          title: "Action",
          key: "action",
          width: 150,
          align: "center",
          render: (h, params) => {
            return h("div", [//渲染一个div标签
              h(
                Button,//在div标签下渲染一个iview组件
                {
                  props: {//传递参数
                    type: "primary",
                    size: "small"
                  },
                  style: {//设置样式
                    marginRight: "5px"
                  },
                  on: {//监听$emit事件
                    click: () => {
                      this.show(params.index);
                    }
                  }
                },
                "View"
              ),
              h(
                Button,
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.remove(params.index);
                    }
                  }
                },
                "Delete"
              )
            ]);
          }
        }
      ],
      data6: [
        {
          name: "John Brown",
          age: 18,
          address: "New York No. 1 Lake Park"
        },
        {
          name: "Jim Green",
          age: 24,
          address: "London No. 1 Lake Park"
        },
        {
          name: "Joe Black",
          age: 30,
          address: "Sydney No. 1 Lake Park"
        },
        {
          name: "Jon Snow",
          age: 26,
          address: "Ottawa No. 2 Lake Park"
        }
      ]
    };
  },
  methods: {
    show(index) {
      this.$Modal.info({
        title: "User Info",
        content: `Name：${this.data6[index].name}<br>Age：${
          this.data6[index].age
        }<br>Address：${this.data6[index].address}`
      });
    },
    remove(index) {
      this.data6.splice(index, 1);
    }
  },

  

  mounted(){
      //modal注入
      Vue.prototype.$Modal=Modal;
  }
  
};
</script>

```


由于table组件表头筛选不支持输入框筛选，那么我们就必须的自己绘制。
思路如下：

- 找到表头所在的节点
- 在表头节点后添加一个自定义筛选的div节点；
- 使用render函数渲染一个下拉输入的单文件组件

```js
 mounted(){
      //modal注入
      Vue.prototype.$Modal=Modal;
      //等dom元素渲染完成之后渲染筛选
      this.$nextTick(()=>{
        this.renderHeaderFilter();
      })
  }

methods:{
 //添加头部筛选
    renderHeaderFilter(){
      let allHeader =document.querySelectorAll(".ivu-table-header .ivu-table-cell");
console.log(allHeader);

      allHeader.forEach((element)=>{
        let createNew=document.createElement("div");
        createNew.classList.add("vue-header-filter");
        element.appendChild(createNew);
        new Vue({
          render(h){
            return h(TableHeaderFilter,{
              props:{}
            })
          }
        }).$mount(createNew);
      })
    }
}
```

最后实现的效果为:
<img src="https://github.com/MrGaoGang/lucky_docs/blob/master/images/table-filter.png?raw=true" width=600 height=300 />
<img src="https://github.com/MrGaoGang/lucky_docs/blob/master/images/render.png?raw=true" width=600 height=300 />


此文源码案例:[欢迎Star](https://github.com/MrGaoGang/lucky_docs/)
