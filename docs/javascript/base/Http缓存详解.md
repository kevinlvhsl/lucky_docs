> http 缓存主要针如 css，js，图片等更新频率不大的静态文件。

阅读本文可以了解到：

- 强缓存和协商缓存
- 缓存头部优先级
- http缓存
- http缓存方案
- 浏览器刷新对缓存的影响

http 缓存大致分为两种: `强缓存`和`协商缓存`。

## 一、强缓存

> 通过特殊的 HTTP`Cache-Control`首部和`Expries`首部,HTTP 让原始服务器向每个文档附加了一个过期日期,这些首部说明了在多长时间内可以将这些内容视为新鲜的。

### 强缓存的头部

1. `Cache-control`

   - `max-age=x`: (单位秒) 。请求缓存后的 X 秒不再发起请求，属于`http1.1`属性，与下方`Expires`(http1.0 属性)类似，但优先级要比`Expires`高。**max-age 是相对过期时间，Expires 是绝对过期时间**
   - `no-store`: 所有内容都不缓存
   - `no-cache`: 缓存，但是浏览器使用缓存前，都会请求服务器判断缓存资源是否是最新。不缓存过期资源。
   - `public`: 客户端和代理服务器(CDN)都可缓存
   - `private`: 只有客户端可以缓存

2. `Expires`
   > 响应头，代表`资源过期时间`(绝对过期时间)，由服务器返回提供，GMT 格式日期，是 http1.0 的属性，在与 max-age(http1.1)共存的情况下，优先级要低。

## 二、协商缓存

> 在使用本地缓存前，先与服务器协商，核对缓存文件是否为最新。比如设置了 cache-control=no-cache，不管你做任何操作，都会发起请求，这一类就是协商性缓存了。

- `Last-Modified`
  响应头，资源最新修改时间，由服务器告诉浏览器。
- `if-Modified-Since`
  请求头，资源最新修改时间，由浏览器告诉服务器(其实就是上次服务器给的 Last-Modified，请求又还给服务器对比)，和 Last-Modified 是一对，它两会进行对比。

> 服务器端返回字段：`Last-Modified`(日期),对应客户端匹配字段`If-Modified-Since`:date**如果服务器 date 小于等于客户端请求 date 则返回 304，否则返回修改后的资源**

- `Etag`
  响应头，资源标识，由服务器告诉浏览器。
- `if-None-Match`
  请求头，缓存资源标识，由浏览器告诉服务器(其实就是上次服务器给的 Etag)，和 Etag 是一对，它两会进行对比。

> 服务器端返回字段 `Etag`： xxxx (一般为 md5 值) 对应客户端匹 配字段为， `If-None-Match`: w/xxx(**xxx 的值和上面的 `etag` 的 xxx 一样则返 回 304，否则返回修改后的资源**)

## 三、缓存头部优先级

**同时存在各种缓存头时，各缓存头优先级及生效情况**

1、强缓存和协商缓存同时存在，如果强缓存还在生效期则强制缓存覆盖协商缓存，协商缓存不生效；如果强缓存不在有效期，协商缓存生效。即：`强缓存优先级 > 协商缓存优先级`

2、强缓存 expires 和 cache-control 同时存在时，则 cache-control 会覆盖 expires，expires 无论有没有过期，都无效。 即：`cache-control优先级 > expires优先级`。

3、协商缓存 Etag 和 Last-Modified 同时存在时，则 Etag 会覆盖 Last-Modified，Last-Modified 不会生效。即：`ETag优先级 > Last-Modified优先级`。

当然还有一种缓存 pragma，和 cache-control 类似，前者是 http1.0 内容后者是 http1.1 内容，并且`pragma优先级 > cache-control优先级`，不过前者目前基本不使用。

ps: 当我们不设置 cache-control，只设置协商缓存，在不同浏览器下会有不同的表现。chrome 会直接从本地缓存获取，其他会请求服务器返回 304.这时候有两种方式让他们的响应一致。

1、设置 cache-control: public, max-age=0;记住，这里的 public 是关键。因为默认值是 private，表示其他代理都不要缓存，只有服务器缓存，而 max-age 又为 0，所以每次都会发起 200 的请求。设置 public 的意思就是允许其他各级代理缓存资源，因此如果资源没改变会返回 304。

2、直接设置 max-age=1000。即是一秒之后内容过期，目的是触发浏览器缓存。也能达到想要 304 的效果。

## 四、使用 http 缓存

### 使用 Expires(GMT 时间格式)

浏览器会先对比当前时间是否已经大于 Expires，也就是判断文件是否超过了约定的过期时间。

时间没过，不发起请求，直接使用本地缓存。

时间过期，发起请求，继续上述的浏览器与服务器的谈话日常。

**问题：假设 Expires 已过期，浏览器再次请求服务器，但 a.js 相比上次并未做任何改变，那这次请求我们是否通过某种方式加以避免？**

### 使用(Last-Modified 与 if-Modified-Since)+Expires

- `Expires`未过期，浏览器机智的使用本地缓存。

- `Expires`过期，服务器带上了文件最新修改时间`if-Modified-Since`(也就是上次请求服务器返回的`Last-Modified`)，服务器将`if-Modified-Since`与`Last-Modified`做了个对比。

  - `if-Modified-Since` 与`Last-Modified`不相等，服务器查找了最新的 a.js，同时再次返回`Expires`与全新的`Last-Modified`

  - `if-Modified-Since` 与`Last-Modified`相等，服务器返回了状态码 304，文件没修改过，你还是用你的本地缓存。

**问题：浏览器端可以随意修改 Expires，Expires 不稳定，Last-Modified 只能精确到秒，假设文件是在 1s 内发生变动，Last-Modified 无法感知到变化，这种情况下浏览器永远拿不到最新的文件(假想极端情况)。**

### 使用 (Last-Modified 与 if-Modified-Since)+Expires+Cache-control+(Etag 和 If-None-Match)

由于`cache-control` `max-age`的优先级比`Expires`的高.

**第一次请求**

浏览器：我要资源 a.js

服务器：a.js 我给你，过期时间`Last-Modified`我也给你，再给你一个`max-age=60`(单位秒)，`Last-Modified`你也给我收好，再加一个文件内容唯一标识符`Etag`。

> 第一次请求，服务器给客户端的资源有：**最后更新时间 Last-Modified**，**过期时间 max-age 和 Expires**（`因为max-age是http1.1，而Expires是http1.0的，为了兼容`）,**文件唯一标识符:Etag**

**后续请求....**

- 60S 内，不发起请求，直接使用本地缓存。（max-age=60 代表请求成功缓存后的 60S 内不再发起请求，与 Expires 相似，同时存在 max-age 优先级要比 Expires 高，区别后面具体说）

- 60S 后，浏览器带上了 `if-Modified-Since` 与 `If-None-Match`(上次服务器返回来的 `Etag`)发起请求，服务器对比 `If-None-Match`与 `Etag`(不对比 `if-Modified-Since` 与 `Last-Modified` 了，**Etag 优先级比 Last-Modified 高**，毕竟更精准)

`If-None-Match` 与 `Etag` 不相等，说明 `a.js` 内容被修改过，服务器返回最新 `a.js` 与全新的 `Etag` 与 `max-age=60` 与 `Last-Modified` 与 `Expires`

`If-None-Match` 与 `Etag` 相等，说明 a.js 文件内容无任何改变，返回 `304`，告诉浏览器继续使用之前的本地缓存。

**问题：我们已经可以精确的对比服务器文件与本地缓存文件差异，但其实上面方案的演变都存在一个较大缺陷， max-age 或 Expires 不过期，浏览器无法主动感知服务器文件变化。**

## 五、HTTP 缓存方案

### 文件名 Hash

上述的将的 http 缓存，是针对某个文件，但是如果我所请求的资源路径发生变化了，那么是不是每次都请求的是新的呢？所以我们有如下的思路：

- 将不长变化的资源，设置长期缓存(max-age=较长时间)，通常包括`vue/vuex/vue-router 等资源库。
- 每次打包工程将修改过得文件名称进行 hash,这样只有相应的文件发生变化，浏览器只会请求变化的资源。`webpack`提供了`hash`，`chunk-hash`和`content-hash`三种对文件名称 hash 的方法。

### CDN 缓存

> CDN 是构建在网络之上的内容分发网络，依靠部署在各地的边缘服务器，通过中心平台的负载均衡、内容分发、调度等功能模块，使用户就近获取所需内容，降低网络拥塞，提高用户访问响应速度和命中率。

**CDN 边缘节点缓存数据，当浏览器请求，CDN 将代替源站判断并处理此处请求。**

## 六、浏览器刷新对http缓存的影响

1. **浏览器地址栏回车，或者点击跳转按钮，前进，后退，新开窗口，这些行为，会让 Expires，max-age 生效**，也就是说，这几种操作下，浏览器会判断过期时间，再考虑要不要发起请求，当然 Last-Modified 和 Etag 也有效。

2. **F5 刷新浏览器，或者使用浏览器导航栏的刷新按钮，这几种，会忽略掉 Expires，max-age 的限制，强行发起请求**，Last-Modified 和 Etag 在这种情况下也有效。

3. **CTRL+F5 是强制请求，所有缓存文件都不使用，全部重新请求下载**，因此 Expires，max-age，Last-Modified 和 Etag 全部失效。

## 参考

- [http 缓存详解，http 缓存推荐方案](https://www.cnblogs.com/echolun/p/9419517.html)
