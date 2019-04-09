

为什么要开发插件？
> 插件是对Vue功能上的补充，比如可以设置页面全局共享属性，方法等。


**目录**
- [阅读前必读](#阅读前必读)
- [一、添加全局方法和属性](#一添加全局方法和属性)
- [二、给Vue实例添加方法和属性](#二给vue实例添加方法和属性)
- [三、通过混入 mixin 方法添加一些组件选项;](#三通过混入-mixin-方法添加一些组件选项)    
    - [1. 局部混入](#1-局部混入)    
    - [2. 全局混入](#2-全局混入)
- [四、添加全局资源：指令，过滤器等](#四添加全局资源指令过滤器等)    
    - [1. 添加自定义指令](#1-添加自定义指令)    
    - [2. 添加过滤器](#2-添加过滤器)<!-- /TOC -->




依据[官方文档](https://cn.vuejs.org/v2/guide/plugins.html)插件开发说明，插件开发有四种方式。

1.  添加全局方法或者属性;

2. 添加 Vue 实例方法，通过把它们添加到 Vue.prototype 上实现。

3. 通过全局 mixin 方法添加一些组件选项;

4. 添加全局资源：指令/过滤器/过渡等;

5. 一个库，提供自己的 API，同时提供上面提到的一个或多个功能，

### 阅读前必读
- **Vue.js 的插件应该有一个公开方法 install。这个方法的第一个参数是 Vue 构造器，第二个参数是一个可选的选项对象.** 比如：
```
export default{
    install:function (Vue,options) {  
        Vue.$globalFunction=function (num) { 
            return 2*num;
         };

         Vue.$globalVariable="我是mrgao";
    }
}

```

- 开发插件时，给Vue/Vue实例添加方法或者属性时，建议命名方式使用$开头，这样就不会存在和插件命名冲突。如果冲突了则优先使用组件属性/方法。

### 一、添加全局方法和属性

作用:
> 添加全局方法和属性，所有组件都可共享方法和属性，**当某个组件更新了共享属性，那么其他组件也会同步更新**。并非是组件实例之间的数据共享。



```js
//1:编写组件

export default{
    install:function (Vue,options) {  
        Vue.$globalFunction=function (num) { 
            return 2*num;
         };

         Vue.$globalVariable="我是mrgao";
    }
}

//2:声明组件，注入组件
import install from "./plugins/demo.js";
Vue.use(install);

//3：组件样例
<Poptip trigger="focus">
      <Input
        v-model="gloablFunc"
        prefix="logo-usd"
        placeholder="Enter number"
        style="width: 120px"
      />
      <div slot="content">{{ formatNumber }}</div>
</Poptip>
import Vue from "vue";
export default {
  data() {
    return {
      gloablFunc: ""
    };
  },

  computed: {
    formatNumber: function() {
      //调用全局共享方法
      return Vue.$globalFunction(this.gloablFunc);
    }
  }
};
```



### 二、给Vue实例添加方法和属性

方式:使用Vue.prototype的方式给Vue实例添加方法和属性

**注意点：使用Vue.prototype的方式添加的属性是不会在各个实例之间数据共享的。**
比如A实例修改了某属性，则B实例使用此属性时不会是A修改的值。

```js
//1：组件编写 demo.js
export default {
  install: function(Vue, options) {
    Vue.prototype.$instanceFunction = function(num) {
      return 3 * num;
    };

    Vue.prototype.$instanceVar="我是实例变量";
  }
};

//2：组件声明 main.js
import install from "./plugins/demo.js";
Vue.use(install);



//3:组件使用 Plugins.vue
...省略部分
<span>添加实例方法/属性测试</span>
 <div>{{ instanceVar }}</div>

  mounted(){
      console.log(this.$instanceVar);
      this.instanceVar=this.$instanceVar;
      //this.instanceVar=this.$instanceFunction(20);
  }

```

### 三、通过混入 mixin 方法添加一些组件选项;

混入mixin作用：
**将混入对象的方法/数据对象合并到改组件本身的方法/数据上；若存在同名的方法，则首先调用混入对象，再调用组件本身方法，若存在同名数据对象，则使用组件的数据对象**

混入分为局部混入和全局混入，**一旦使用全局混入对象，将会影响到 所有 之后创建的 Vue 实例**。请谨慎使用全局混入，尽可能使用局部混入。

#### 1. 局部混入


此处借用官方的例子[选项合并](https://cn.vuejs.org/v2/guide/mixins.html)
    
- 当组件和混入对象含有同名选项时，这些选项将以恰当的方式混合。比如，数据对象在内部会进行递归合并，在和组件的数据发生冲突时以组件数据优先。

- 若存在同名方法则优先调用混入对象的方法。

- 值为对象的选项，例如 methods, components 和 directives，将被混合为同一个对象。两个对象键名冲突时，取组件对象的键值对。
```js
var mixin = {
  data: function() {
    return {
      message: "hello",
      foo: "abc"
    };
  },
  created: function() {
    console.log("混入对象的钩子被调用");
  },
  methods:{
      demo1(){
           console.log("混入demo1");
      },
      demo2(){
            console.log("混入demo2");
      }
  }
};

export default {
  mixins: [mixin],
  data: function() {
    return {
      message: "goodbye",
      bar: "def"
    };
  },
  created: function() {
       console.log('组件钩子被调用')
    console.log(this.$data);
    //混入对象的钩子被调用
    //组件钩子被调用
    // => { message: "goodbye", foo: "abc", bar: "def" }
  },
  methods:{
      demo1(){
          console.log("组件demo1");
          
      }
  }
};
```


#### 2. 全局混入

为全局Vue实例混入一个created方法，在每一个实例调用本身的created之前都会首先调用混入的created。

**通常我们可以使用全局混入对Vue实例注入统一处理统计**。

```js

// 为自定义的选项 'myOption' 注入一个处理器。
Vue.mixin({
    created: function () {
    //console.log("相信我，这个Log会在每一个Vue实例created之前调用");
        
      var myOption = this.$options.myOption
      if (myOption) {
        console.log(myOption)
      }
    }
  })

new Vue({
  myOption: 'hello! mrgao'
})
// => "hello!"

```


### 四、添加全局资源：指令，过滤器等

#### 1. 添加自定义指令
除了核心功能默认内置的指令 (v-model 和 v-show等)，Vue 也允许注册自定义指令。

[参考官方文档：自定义指令](https://cn.vuejs.org/v2/guide/custom-directive.html)

指令钩子函数会被传入以下参数：

- el：指令所绑定的元素，可以用来直接操作 DOM 。
- binding：一个对象，包含以下属性：
    - name：指令名，不包括 v- 前缀。
    - value：指令的绑定值，例如：v-my-directive="1 + 1" 中，绑定值为 2。
    - oldValue：指令绑定的前一个值，仅在 update 和 componentUpdated 钩子中可用。无论值是否改变都可用。
    - expression：字符串形式的指令表达式。例如 v-my-directive="1 + 1" 中，表达式为 "1 + 1"。
    - arg：传给指令的参数，可选。例如 v-my-directive:foo 中，参数为 "foo"。
    - modifiers：一个包含修饰符的对象。例如：v-my-directive.foo.bar 中，修饰符对象为 { foo: true, bar: true }。
- vnode：Vue 编译生成的虚拟节点。移步 VNode API 来了解更多详情。
- oldVnode：上一个虚拟节点，仅在 update 和 componentUpdated 钩子中可用。

```js
//D.vue
<template>
  <div v-demo:foo.a.b="message"></div>
</template>

<script>
export default {
  data() {
    return {
      message: "我是demo"
    };
  }
};
//main.js
Vue.directive('demo', {
  bind: function (el, binding, vnode) {
    var s = JSON.stringify
    el.innerHTML =
      'name: '       + s(binding.name) + '<br>' +
      'value: '      + s(binding.value) + '<br>' +
      'expression: ' + s(binding.expression) + '<br>' +
      'argument: '   + s(binding.arg) + '<br>' +
      'modifiers: '  + s(binding.modifiers) + '<br>' +
      'vnode keys: ' + Object.keys(vnode).join(', ')
  }
})



```

结果为：
```
name: "demo"
value: "我是demo"
expression: "message"
argument: "foo"
modifiers: {"a":true,"b":true}
vnode keys: tag, data, children, text, elm, ns, context, fnContext, fnOptions, fnScopeId, key, componentOptions, componentInstance, parent, raw, isStatic, isRootInsert, isComment, isCloned, isOnce, asyncFactory, asyncMeta, isAsyncPlaceholder
```


#### 2. 添加过滤器

```js

//1：编写过滤器 currency.js
const digitsRE = /(\d{3})(?=\d)/g

export function currency (value, currency, decimals) {
  value = parseFloat(value)
  if (!isFinite(value) || (!value && value !== 0)) return ''
  currency = currency != null ? currency : '$'
  decimals = decimals != null ? decimals : 2
  var stringified = Math.abs(value).toFixed(decimals)
  var _int = decimals
    ? stringified.slice(0, -1 - decimals)
    : stringified
  var i = _int.length % 3
  var head = i > 0
    ? (_int.slice(0, i) + (_int.length > 3 ? ',' : ''))
    : ''
  var _float = decimals
    ? stringified.slice(-1 - decimals)
    : ''
  var sign = value < 0 ? '-' : ''
  return sign + currency + head +
    _int.slice(i).replace(digitsRE, '$1,') +
    _float
}


//2：声明 main.js
import { currency } from "./currency";
Vue.filter("currency", currency);

//3：使用Productlist.vue
 <Tag type="dot" closable color="success">单价:{{ product.price | currency }}</Tag>
```




上述已经简单讲解了Vue插件开发的四种方式，最后一种方式，也就是将上述四种组合在一个install方法中即可。

[欢迎Star](https://github.com/MrGaoGang/lucky_docs)