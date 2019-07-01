
### 基础知识
- http
    - 三次握手和四次挥手
    - 常见的http状态码(101,200,201,202,301,302,400,401,403,404,408,409,500,501,503);
    - 常见的http头部
    - request头部（请求行/请求头/空行/请求体）
    - response头部（响应行/响应头/空行/响应体）
    - 常见的请求方法
    - https工作原理
    - http和https的区别
- cookie和session
- for in 和for of的区别
- instanceof 和typeof的区别
- grid布局了解吗

---- 
### CSS
- css3有哪些新特性？
- 怎样形成BFC？

----

### Javascript
- 跨越问题
- 原型及原型链
- 微任务与宏任务
- 防抖和节流
- 重绘和回流
    - 引起回流有哪些情况?
- 了解XSS和CSRF吗

----

### Vue
- Vue diff算法
- Vue和React的区别
- 介绍一下Vuex和Redux，Mobx


----
### 前端性能优化
- webpack打包如何优化？
    - 如何提高构建速度？
    - 如何提高程序质量？
- 你遇过内存泄漏问题吗?

 
----
### Android相关
- Android生命周期


- **Webview了解多少？**
    - Android通过webview调用js
        - 通过Webview的loadUrl();
        - 通过WebView的evaluateJavascript()

    - js通过webview调研Android
        - 通过WebView的addJavascriptInterface（）进行对象映射
        - 通过 WebViewClient 的shouldOverrideUrlLoading ()方法回调拦截 url
        - 通过 WebChromeClient 的onJsAlert()、onJsConfirm()、onJsPrompt（）方法回调拦截JS对话框alert()、confirm()、prompt（） 消息




- **Android的四种启动模式**:
    - Standard:每次启动activity都会创建一个新的实例入栈，无论实例是否存储
    - SingleTop：若栈顶存在当前实例，则直接复用
    - SingleInstance：全局只有一个activity实例
    - SingleTask：若当前栈中存在activity实例，则弹出activity上面的实例，将当前实例置顶。

- **自定义View的步骤**
    - 基于View的自定义
    - 基于ViewGroup的自定义
    - 基于已有组件的自定义

- **MVP设计模式和MVVM设计模式(ViewModel+Lifecycle+LiveData)**
- **线程池**
    - FixThreadPool:固定数量的核心线程，
    - SingleThreadPool:只有一个核心线程，确保所有任务都在同一线程中按顺完成。
    - CachedThreadPool: 只有非核心线程，所有都活动时会为新任务创建新线程。
    - ScheduledThreadPool: 核心线程数固定，非核心线程数没有限制，主要用于执行定时任务以及有固定周期的重复任务。
- **Android性能优化**
    - 安装包大小优化
    - 耗电优化
    - 稳定性优化
    - 存储优化
    - 绘制优化
    - 内存泄漏

- **Android组件化和插件化**
    - ARouter和VirtualApk

### 其他知识
- nginx反向代理
- 介绍一下BFF
- Restful接口
- Docker了解吗
