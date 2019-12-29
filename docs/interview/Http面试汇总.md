## 浏览器输入 url 到页面的展现，具体发生了些什么可以展开说下么?

一般会经历以下几个过程：

- 1、首先，在浏览器地址栏中输入url

- 2、浏览器先查看浏览器缓存-系统缓存-路由器缓存，如果缓存中有，会直接在屏幕中显示页面内容。若没有，则跳到第三步操作。

- 3、在发送http请求前，需要域名解析(DNS解析)，解析获取相应的IP地址。

- 4、浏览器向服务器发起tcp连接，与浏览器建立tcp三次握手。

- 5、握手成功后，浏览器向服务器发送http请求，请求数据包。

- 6、服务器处理收到的请求，将数据返回至浏览器

- 7、浏览器收到HTTP响应

- 8、读取页面内容，浏览器渲染，解析html源码

- 9、生成Dom树、解析css样式、js交互

- 10、客户端和服务器交互

- 11、ajax查询



### 缓存及DNS解析过程

- (1)浏览器缓存: 当用户通过浏览器访问某域名时，浏览器首先会在自己的缓存中查找是否有该域名对应的IP地址（若曾经访问过该域名且没有清空缓存便存在)；
- (2)系统缓存： 当浏览器缓存中无域名对应IP则会自动检查用户计算机系统Hosts文件DNS缓存是否有该域名对应IP；
- (3)路由器缓存: 当浏览器及系统缓存中均无域名对应IP则进入路由器缓存中检查，以上三步均为客户端的DNS缓存；
- (4)ISP（互联网服务提供商）DNS缓存: 当在用户客服端查找不到域名对应IP地址，则将进入ISP DNS缓存中进行查询。比如你用的是电信的网络，则会进入电信的DNS缓存服务器中进行查找；(或者向网络设置中指定的local DNS进行查询，如果在PC指定了DNS的话，如果没有设置比如DNS动态获取，则向ISP DNS发起查询请求)
- (5)根域名服务器: 当以上均未完成，则进入根服务器进行查询。全球仅有13台根域名服务器，1个主根域名服务器，其余12为辅根域名服务器。根域名收到请求后会查看区域文件记录，若无则将其管辖范围内顶级域名（如.com）服务器IP告诉本地DNS服务器；
- (6)顶级域名服务器: 顶级域名服务器收到请求后查看区域文件记录，若无则将其管辖范围内主域名服务器的IP地址告诉本地DNS服务器；
- (7)主域名服务器: 主域名服务器接受到请求后查询自己的缓存，如果没有则进入下一级域名服务器进行查找，并重复该步骤直至找到正确记录；
- (8)保存结果至缓存: 本地域名服务器把返回的结果保存到缓存，以备下一次使用，同时将该结果反馈给客户端，客户端通过这个IP地址与web服务器建立链接。

![DNS解析流程](https://user-gold-cdn.xitu.io/2018/11/28/1675a9b6f6a79d44?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

### Web缓存
- 为什么需要缓存？
- 缓存的命中和未命中
- 新鲜度检测
- 强缓存原理
- 协商缓存原理
- 缓存的更新和废弃
- 缓存优先级

[答案：Web缓存](https://juejin.im/post/5ae081aaf265da0b767d263a#heading-2)

[前端缓存实践](https://juejin.im/post/5c136bd16fb9a049d37efc47#heading-2)


### Web缓存优先级

**强缓存**：只要请求了一次，在有效时间内，不会再请求服务器（请求都不会发起），直接从浏览器本地缓存中获取资源。主要字段有（expires：date（过期日期）、cache-control： max-age=time（毫秒数，多久之后过期）|no-cache|no-store）。`如果expires和cache-control同时存在，cache-control会覆盖expires。建议两个都写`，cache-control是http1.1的头字段，expires是http1.0的头字段，都写兼容会好点。

**协商缓存**：无论是否变化，是否过期都会发起请求，如果内容没过期，直接返回304，从浏览器缓存中拉取文件，否则直接返回更新后的内容。主要字 段有：

1、服务器端返回字段 Etag： xxxx (一般为md5值) 对应客户端匹 配字段为， If-None-Match: w/xxx(xxx的值和上面的etag的xxx一样则返 回304，否则返回修改后的资源)。

2、服务器端返回字段：Last-Modifieddate(日期),对应客户端匹配字段If-Modified-Since:date（如果服务器date小于等于客户端请求date则返回304，否则返回修改后的资源））。

**同时存在各种缓存头时，各缓存头优先级及生效情况**

1、强缓存和协商缓存同时存在，如果强缓存还在生效期则强制缓存覆盖协商缓存，协商缓存不生效；如果强缓存不在有效期，协商缓存生效。即：`强缓存优先级 > 协商缓存优先级`

2、强缓存expires和cache-control同时存在时，则cache-control会覆盖expires，expires无论有没有过期，都无效。 即：`cache-control优先级 > expires优先级`。

3、协商缓存Etag和Last-Modified同时存在时，则Etag会覆盖Last-Modified，Last-Modified不会生效。即：`ETag优先级 > Last-Modified优先级`。

当然还有一种缓存pragma，和cache-control类似，前者是http1.0内容后者是http1.1内容，并且`pragma优先级 > cache-control优先级`，不过前者目前基本不使用。


ps: 当我们不设置cache-control，只设置协商缓存，在不同浏览器下会有不同的表现。chrome会直接从本地缓存获取，其他会请求服务器返回304.这时候有两种方式让他们的响应一致。

1、设置cache-control: public, max-age=0;记住，这里的public是关键。因为默认值是private，表示其他代理都不要缓存，只有服务器缓存，而max-age又为0，所以每次都会发起200的请求。设置public的意思就是允许其他各级代理缓存资源，因此如果资源没改变会返回304。 

2、直接设置max-age=1000。即是一秒之后内容过期，目的是触发浏览器缓存。也能达到想要304的效果。





### HTTP1.0、HTTP1.1 和 HTTP2.0 的区别
- [参考：HTTP1.0、HTTP1.1 和 HTTP2.0 的区别](https://www.cnblogs.com/heluan/p/8620312.html)


### 常用的HTTP状态码

- 1xx：指示信息–表示请求已接收，继续处理。

    - 100 客户必须继续发出请求

    - 101 客户要求服务器根据请求转换HTTP协议版本

- 2XX 成功

    - 200 OK，表示从客户端发来的请求在服务器端被正确处理 ✨
    - 201 Created 请求已经被实现，而且有一个新的资源已经依据请求的需要而建立
    - 202 Accepted 请求已接受，但是还没执行，不保证完成请求
    - 204 No content，表示请求成功，但响应报文不含实体的主体部分
    - 206 Partial Content，进行范围请求 ✨

- 3XX 重定向

    - 301 moved permanently，永久性重定向，表示资源已被分配了新的 URL
    - 302 found，临时性重定向，表示资源临时被分配了新的 URL ✨（通常解析到CDN）
    - 303 see other，表示资源存在着另一个 URL，应使用 GET 方法获取资源
    - **304 not modified（缓存）**，如果客户端发送了一个带条件的 GET 请求且该请求已被允许，而文档的内容（自上次访问以来或者根据请求的条件）并没有改变，则服务器应当返回这个状态码 ✨
    - 307 temporary redirect，临时重定向，和302含义相同

- 4XX 客户端错误

    - 400 bad request，请求报文存在语法错误 ✨
    - 401 unauthorized，表示发送的请求需要有通过 HTTP 认证的认证信息 ✨
    - 403 forbidden，表示对请求资源的访问被服务器拒绝 ✨
    - 404 not found，表示在服务器上没有找到请求的资源 ✨
    - 408 Request timeout, 客户端请求超时 ✨
    - 409 Confict, 请求的资源可能引起冲突

- 5XX 服务器错误

    - 500 internal sever error，表示服务器端在执行请求时发生了错误 ✨
    - 501 Not Implemented 请求超出服务器能力范围，例如服务器不支持当前请求所需要的某个功能，或者请求是服务器不支持的某个方法
    - 503 service unavailable，表明服务器暂时处于超负载或正在停机维护，无法处理请求
    - 505 http version not supported 服务器不支持，或者拒绝支持在请求中使用的 HTTP 版本


### HTTP 头部

HTTP头可以看做是一个键值对，在HTTP标准中，Request Header如下图：

![](https://user-gold-cdn.xitu.io/2019/2/20/1690aee1a27d4803?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

Response Header如下图：

![](https://user-gold-cdn.xitu.io/2019/2/20/1690aee1a29607f3?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

### TCP的三次握手和四次挥手

**TCP三次握手**
浏览器获得 IP 地址后，就会对目标服务器发起建立 TCP 连接的请求，建立连接主要有三个步骤，一般称为客户端与服务器端的三次握手：
- 第一次握手： 建立连接时，客户端发送syn包（syn=j）到服务器，并进入SYN_SENT状态，等待服务器确认；
- 第二次握手： 服务器收到syn包，必须确认客户的SYN（ack=j+1），同时自己也发送一个SYN包（syn=k），即SYN+ACK包，此时服务器进入SYN_RECV状态；
- 第三次握手： 客户端收到服务器的SYN+ACK包，向服务器发送确认包ACK(ack=k+1），此包发送完毕，客户端和服务器进入ESTABLISHED（TCP连接成功）状态，完成三次握手。

![](https://user-gold-cdn.xitu.io/2018/11/28/1675a9b89949265e?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)


**TCP四次挥手**
客户端或服务器均可主动发起挥手动作
- 第一次挥手: 主动关闭方，将FIN置为1，Seq设置为Z为上一次对方传送过来的Ack值，Ack设置为X为Seq值+1。设置好以上值后，将数据发送至被动关闭方(这里标记为：B)。然后A进入FIN_WAIT_1状态。
- 第二次挥手：B收到了A发送的FIN报文段，向A回复，Ack设置为第一次挥手中的Seq值+1，Seq设置为Y第一次挥手中的Ack值。然后B进入CLOSE_WAIT状态，A收到B的回复后，进入FIN_WAIT_2状态。
- 第三次挥手：B再次向A发送报文，将FIN置为1，Ack设置为X，Seq设置为Y。然后B进入LAST_ACK状态，A收到B的报文后，进入TIME_WAIT状态。
- 第四次挥手：A收到B发送的FIN报文段，Ack设置为Y，Seq设置为X。然后A进入TIME_WAIT状态，B在收到报文后进入CLOSED状态，A在发送完报文等待了2MSL时间后进入CLOSED状态。

![](https://user-gold-cdn.xitu.io/2018/11/28/1675a9b9ae26867a?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)


### HTTP和HTTPS的区别
- [HTTP和HTTPS的区别](https://mp.weixin.qq.com/s/UE7Zw0aSbxLuFFSraSUIOQ)
- [HTTP1.0 2.0的区别](https://mp.weixin.qq.com/s/GICbiyJpINrHZ41u_4zT-A?)

### 浏览器渲染过程和原理

- [浏览器的渲染：过程与原理](https://zhuanlan.zhihu.com/p/29418126)


### SSL中的对称加密和非对称加密

- [理解SSL中的对称加密和非对称加密](https://www.cnblogs.com/hai-blog/p/8311671.html)



**参考**

- [腾讯前端面试](https://juejin.im/post/5ace1b306fb9a028c71ed009)
- [可能是全网最全的http面试答案](https://juejin.im/post/5d032b77e51d45777a126183)
- [输入url按回车后发生的一系列不可描述的事情](https://juejin.im/post/5bfe9e6c6fb9a049ad76c1b6)
