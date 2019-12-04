**1px 问题解决方案**

> 1px 问题。在设备像素比(dpr)大于 1 的屏幕上，我们写的 1px 实际上是被多个物理像素渲染，这就会出现 1px 在有些屏幕上看起来很粗的现象

首先关于移动端适配，先看一下这篇文档[关于移动端适配，你必须要知道的](https://juejin.im/post/5cddf289f265da038f77696c#heading-28)。

解决方案：

##  **border-image**
   基于 media 查询判断不同的设备像素比给定不同的 border-image：

```css
.border_1px {
  border-bottom: 1px solid #000;
}
@media only screen and (-webkit-min-device-pixel-ratio: 2) {
  .border_1px {
    border-bottom: none;
    border-width: 0 0 1px 0;
    border-image: url(../img/1pxline.png) 0 0 2 0 stretch;
  }
}
```

##  **background-image**
   和 border-image 类似，准备一张符合条件的边框背景图，模拟在背景上。

```css
.border_1px {
  border-bottom: 1px solid #000;
}
@media only screen and (-webkit-min-device-pixel-ratio: 2) {
  .border_1px {
    background: url(../img/1pxline.png) repeat-x left bottom;
    background-size: 100% 1px;
  }
}
```

##  **伪类 + transform【推荐】**
   基于 media 查询判断不同的设备像素比对线条进行缩放：**vux 就是基于此方式**

```less
.setTopLine(@c: #C7C7C7) {
  content: " ";
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  height: 1px;
  border-top: 1px solid @c;
  color: @c;
  transform-origin: 0 0;
  transform: scaleY(0.5);
}

.setBottomLine(@c: #C7C7C7) {
  content: " ";
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  height: 1px;
  border-bottom: 1px solid @c;
  color: @c;
  transform-origin: 0 100%;
  transform: scaleY(0.5);
}

.setLeftLine(@c: #C7C7C7) {
  content: " ";
  position: absolute;
  left: 0;
  top: 0;
  width: 1px;
  bottom: 0;
  border-left: 1px solid @c;
  color: @c;
  transform-origin: 0 0;
  transform: scaleX(0.5);
}

.setRightLine(@c: #C7C7C7) {
  content: " ";
  position: absolute;
  right: 0;
  top: 0;
  width: 1px;
  bottom: 0;
  border-right: 1px solid @c;
  color: @c;
  transform-origin: 100% 0;
  transform: scaleX(0.5);
}

.vux-1px-t {
  &:before {
    .setTopLine();
  }
}

.vux-1px-b {
  &:after {
    .setBottomLine();
  }
}

.vux-1px-tb {
  &:before {
    .setTopLine();
  }
  &:after {
    .setBottomLine();
  }
}

.vux-1px-l {
  &:before {
    .setLeftLine();
  }
}

.vux-1px-r {
  &:after {
    .setRightLine();
  }
}

@media only screen and (-webkit-min-device-pixel-ratio: 2) {
  .vux-1px:before {
    transform: scaleY(0.5);
  }
}
@media only screen and (-webkit-min-device-pixel-ratio: 3) {
  .vux-1px:before {
    transform: scaleY(0.33);
  }
}
```

##  **svg**

上面我们`border-image`和`background-image`都可以模拟 1px 边框，但是使用的都是位图，还需要外部引入。

借助 `PostCSS` 的`postcss-write-svg`我们能直接使用`border-image`和`background-image`创建 svg 的 1px 边框

```css
@svg border_1px {
  height: 2px;
  @rect {
    fill: var(--color, black);
    width: 100%;
    height: 50%;
  }
}
.example {
  border: 1px solid transparent;
  border-image: svg(border_1px param(--color #00b1ff)) 2 2 stretch;
}
```

**编译之后**

```css
.example {
  border: 1px solid transparent;
  border-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' height='2px'%3E%3Crect fill='%2300b1ff' width='100%25' height='50%25'/%3E%3C/svg%3E")
    2 2 stretch;
}
```

##  **设置 viewport**

通过设置缩放，让`CSS`像素等于真正的物理像素。

例如：当设备像素比为 3 时，我们将页面缩放 1/3 倍，这时 1px 等于一个真正的屏幕像素。

```js
const scale = 1 / window.devicePixelRatio;
const viewport = document.querySelector('meta[name="viewport"]');
if (!viewport) {
  viewport = document.createElement("meta");
  viewport.setAttribute("name", "viewport");
  window.document.head.appendChild(viewport);
}
viewport.setAttribute(
  "content",
  "width=device-width,user-scalable=no,initial-scale=" +
    scale +
    ",maximum-scale=" +
    scale +
    ",minimum-scale=" +
    scale
);
```
