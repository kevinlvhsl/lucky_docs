# 常用前端跨域方案

## 一、使用 jsonp 方式跨域

**亲测有效：只支持get请求**

> 通常为了减轻 web 服务器的负载，我们把 js、css，img 等静态资源分离到另一台独立域名的服务器上，在 html 页面中再通过相应的标签从不同域名下加载静态资源，而被浏览器允许，基于此原理，我们可以通过动态创建 script，再请求一个带参网址实现跨域通信。

```html
<script>
  //jsonp实现跨域get请求
  let script = document.createElement("script");
  let callbackName = "jsonp_callback";
  if (url.indexOf("?") != -1) {
    url += "&callback=" + callbackName;
  } else {
    url += "?callback=" + callbackName;
  }
  script.src = url;
  window[callbackName] = function(data) {
    // ...做一些你的事情
    document.body.removeChild(script);
  };
  document.body.appendChild(script);
</script>
```

## 二、 window.name + iframe 跨域

**亲测有效**

window.name 属性的独特之处：name 值在不同的页面（甚至不同域名）加载后依旧存在，并且可以支持非常长的 name 值（2MB）。

1. a.html：(http://www.domain1.com/a.html)

```js
//记得将这段代码放在body里面哦
var proxy = function(url, callback) {
  var state = 0;
  var iframe = document.createElement("iframe");

  // 加载跨域页面
  iframe.src = url;

  // onload事件会触发2次，第1次加载跨域页，并留存数据于window.name
  iframe.onload = function() {
    if (state === 1) {
      // 第2次onload(同域proxy页)成功后，读取同域window.name中数据
      callback(iframe.contentWindow.name);
      destoryFrame();
    } else if (state === 0) {
      // 第1次onload(跨域页)成功后，切换到同域代理页面
      iframe.contentWindow.location = "http://www.domain1.com/proxy.html";
      state = 1;
    }
  };

  document.body.appendChild(iframe);

  // 获取数据以后销毁这个iframe，释放内存；这也保证了安全（不被其他域frame js访问）
  function destoryFrame() {
    iframe.contentWindow.document.write("");
    iframe.contentWindow.close();
    document.body.removeChild(iframe);
  }
};

// 请求跨域b页面数据
proxy("http://www.domain2.com/b.html", function(data) {
  alert(data);
});
```

2. proxy.html (http://www.domain1.com/proxy.html)

中间代理页，与 a.html 同域，内容为空即可。

3. b.html：(http://www.domain2.com/b.html)

```html
<script>
  window.name = "This is domain2 data!";
</script>
```

## 三、postMessage 跨域

**亲测有效**

`postMessage`是 HTML5 XMLHttpRequest Level 2 中的 API，且是为数不多可以跨域操作的 window 属性之一，它可用于解决以下方面的问题：

- 页面和其打开的新窗口的数据传递
- 多窗口之间消息传递
- 页面与嵌套的 iframe 消息传递
- 上面三个场景的跨域数据传递

用法：`postMessage(data,origin)`方法接受两个参数

- data： html5 规范支持任意基本类型或可复制的对象，但部分浏览器只支持字符串，所以传参时最好用`JSON.stringify()`序列化。
- origin： 协议+主机+端口号，也可以设置为"\*"，表示可以传递给任意窗口，如果要指定和当前窗口同源的话设置为"/"。

1. a.html：(http://www.domain1.com/a.html)

```html
<iframe
  id="iframe"
  src="http://www.domain2.com/b.html"
  style="display:none;"
></iframe>
<script>
  var iframe = document.getElementById("iframe");
  iframe.onload = function() {
    var data = {
      name: "aym"
    };
    // 向domain2传送跨域数据
    iframe.contentWindow.postMessage(
      JSON.stringify(data),
      "http://www.domain2.com"
    );
  };

  // 接受domain2返回数据
  window.addEventListener(
    "message",
    function(e) {
      alert("data from domain2 ---> " + e.data);
    },
    false
  );
</script>
```

2. b.html：(http://www.domain2.com/b.html)

```html
<script>
  // 接收domain1的数据
  window.addEventListener(
    "message",
    function(e) {
      alert("data from domain1 ---> " + e.data);

      var data = JSON.parse(e.data);
      if (data) {
        data.number = 16;

        // 处理后再发回domain1
        window.parent.postMessage(
          JSON.stringify(data),
          "http://www.domain1.com"
        );
      }
    },
    false
  );
</script>
```

## 四、跨域资源共享（CORS）【推荐】

普通跨域请求：只服务端设置 `Access-Control-Allow-Origin` 即可，前端无须设置，若要带 cookie 请求：前后端都需要设置

- **前端**

```js
var xhr = new XMLHttpRequest(); // IE8/9需用window.XDomainRequest兼容

// 前端设置是否带cookie
xhr.withCredentials = true;

xhr.open("post", "http://www.domain2.com:8080/login", true);
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
xhr.send("user=admin");

xhr.onreadystatechange = function() {
  if (xhr.readyState == 4 && xhr.status == 200) {
    alert(xhr.responseText);
  }
};
```

- **Java 后端**

```java
/*
 * 导入包：import javax.servlet.http.HttpServletResponse;
 * 接口参数中定义：HttpServletResponse response
 */

// 允许跨域访问的域名：若有端口需写全（协议+域名+端口），若没有端口末尾不用加'/'
response.setHeader("Access-Control-Allow-Origin", "http://www.domain1.com");

// 允许前端带认证cookie：启用此项后，上面的域名不能为'*'，必须指定具体的域名，否则浏览器会提示
response.setHeader("Access-Control-Allow-Credentials", "true");

// 提示OPTIONS预检时，后端需要设置的两个常用自定义头
response.setHeader("Access-Control-Allow-Headers", "Content-Type,X-Requested-With");

```

- **NodeJS 后端**

```js
var http = require("http");
var server = http.createServer();
var qs = require("querystring");

server.on("request", function(req, res) {
  var postData = "";

  // 数据块接收中
  req.addListener("data", function(chunk) {
    postData += chunk;
  });

  // 数据接收完毕
  req.addListener("end", function() {
    postData = qs.parse(postData);

    // 跨域后台设置
    res.writeHead(200, {
      "Access-Control-Allow-Credentials": "true", // 后端允许发送Cookie
      "Access-Control-Allow-Origin": "http://www.domain1.com", // 允许访问的域（协议+域名+端口）
      /*
       * 此处设置的cookie还是domain2的而非domain1，因为后端也不能跨域写cookie(nginx反向代理可以实现)，
       * 但只要domain2中写入一次cookie认证，后面的跨域接口都能从domain2中获取cookie，从而实现所有的接口都能跨域访问
       */
      "Set-Cookie": "l=a123456;Path=/;Domain=www.domain2.com;HttpOnly" // HttpOnly的作用是让js无法读取cookie
    });

    res.write(JSON.stringify(postData));
    res.end();
  });
});

server.listen("8080");
console.log("Server is running at port 8080...");
```

## 五、nginx 代理跨域 【推荐】

**亲测有效**

1.  **nginx 配置解决 iconfont 跨域**

```bash
location / {
  add_header Access-Control-Allow-Origin *;
}
```

2. **nginx 反向代理接口跨域**

```bash
#proxy服务器
server {
    listen       81;
    server_name  www.domain1.com;

    location /api/ {
        proxy_pass   http://www.domain2.com:8080;  #反向代理
        proxy_cookie_domain www.domain2.com www.domain1.com; #修改cookie里域名
        index  index.html index.htm;

        # 当用webpack-dev-server等中间件代理接口访问nignx时，此时无浏览器参与，故没有同源限制，下面的跨域配置可不启用
        add_header Access-Control-Allow-Origin http://www.domain1.com;  #当前端只跨域不带cookie时，可为*
        add_header Access-Control-Allow-Credentials true;
    }
}

```

前端代码：

```js
var xhr = new XMLHttpRequest();

// 前端开关：浏览器是否读写cookie
xhr.withCredentials = true;

// 访问nginx中的代理服务器
xhr.open("get", "http://www.domain1.com:81/api/?user=admin", true);
xhr.send();
```

## 六、 Nodejs 中间件代理跨域

**亲测有效**

### vue 本地跨域

`vue-cli`提供本地跨域方案。其实也是启动`webpack-dev-server`代理接口跨域。
详情请见[vue-cli ddevServer 配置](https://cli.vuejs.org/zh/config/#devserver-proxy)

```js
module.exports = {
  devServer: {
    host: "www.domain1.com",
    proxy: {
      "/api": {
        target: "http://www.domain2.com:8080",
        ws: true,
        changeOrigin: true
      }
    }
  }
};
```

### 非 vue 本地跨域

可以利用`node + express + http-proxy-middleware`搭建一个`proxy`服务器。

- 前端代码

```js
var xhr = new XMLHttpRequest();

// 前端开关：浏览器是否读写cookie
xhr.withCredentials = true;

// 访问同源下的：http-proxy-middleware代理服务器
xhr.open("get", "http://www.domain1.com:3000/login?user=admin", true);
xhr.send();
```

- Node 后端 proxy 代码

```js
var express = require("express");
var proxy = require("http-proxy-middleware");
var app = express();

app.use(
  "/",
  proxy({
    // 代理跨域目标接口
    target: "http://www.domain2.com:8080",
    changeOrigin: true,

    // 修改响应头信息，实现跨域并允许带cookie
    onProxyRes: function(proxyRes, req, res) {
      res.header("Access-Control-Allow-Origin", "http://www.domain1.com");
      res.header("Access-Control-Allow-Credentials", "true");
    },

    // 修改响应信息中的cookie域名
    cookieDomainRewrite: "www.domain1.com" // 可以为false，表示不修改
  })
);

app.listen(3000);
console.log("Proxy server is listen at port 3000...");
```
