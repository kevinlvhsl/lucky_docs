> 在开发之前，我想您应该知道关于图表的一些简单概念。一般情况下，F2 的图表包含坐标轴（Axis）、几何标记（Geometry）、提示信息（Tooltip）、图例（Legend）等。Axis,Tooltip,Legend等术语作用请见：[官方文档](https://www.yuque.com/antv/f2/understanding-f2-charts)

![](https://gw.alipayobjects.com/zos/rmsportal/tpfdzWDYmxzHkquTihJe.png) 


## 1、oview如何开发一个图表？

```html
      <o-chart :data="normalData" :col-defs="normaColConfig" :tooltip="normalTootip">
        <o-line :axis="normaAxis" :position="'date*value'"></o-line>
      </o-chart>

```
其中由o-chart和o-line/o-pie/等组成。
    **一个o-chart有且只能有一个图表子节点**



## 2、o-chart各个字段介绍

> 希望您能静下心来，花5分钟时间简单了解一下，o-chart各个字段的作用。o-chart主要作用是配置图表的公用属性,抽离不同图形公用方法，并根据类型不同，而渲染不同图形。

### data（数据源）
- 是否必须:**True**
- 参数类型:Array
- 描述:图表的数据源
- 默认：[]


### col-defs (数据源字段配置)
- 是否必须:False
- 参数类型:Object
- 描述:对上述提供的数据源中每个字段进行配置
- 默认：{}

一个示例:

```js
//以折线图为例
  <o-chart :data="normalData" :col-defs="normaColConfig" :tooltip="normalTootip">
      <o-line :axis="normaAxis" :position="'date*value'"></o-line>
  </o-chart>
//data部分
   normaColConfig: {
        //对每个字段配置
        //正常的折线图每一个字段的配置
        value: {
          tickCount: 5, //坐标点的个数
          min: 0
        },
        date: {
          type: "timeCat", //时间类型
          range: [0, 1],
          tickCount: 3 //坐标点的个数
        }
      },
```

[详细配置说明](https://www.yuque.com/antv/f2/api-scale)


### custom-render（自定义渲染图表）
- 是否必须:False
- 参数类型:枚举，**null, "prevent", "extra" 选项中的某个**
- 描述:是否自定义渲染图表。
    - **null**:不自定义渲染
    - **prevent**:完全阻止组件渲染，完全由自己在回调方法中：灌数据，渲染图表等等(一般情况不建议使用此选项);
    - **extra**: 自己在iview渲染的图表基础上，添加自定义操作。（建议使用此选项）

- 默认：null
- 说明：**如果 custom-render为prevent或者extra则需要在o-chart部分添加@on-render监听**。示例请见：[雷达图示例](https://github.com/MrGaoGang/oview/blob/master/examples/components/chart/Radar.vue)

```javascript
<o-chart
    :data="imageData"
    :col-defs="imageColumnConfig"
    custom-render="extra"
    :height="300"
    @on-render="onRender"
    :chart-config="chartConfig"
>
    <o-radar :axis="imageAxis" is-area custom-define :animate="animate" position="item*score"></o-radar>
</o-chart>

//onRender的入参为
  onRender({ chart }) {
      
  }
```

### legend (图例)
- 是否必须:False
- 参数类型:Object
- 描述:图例
- 默认：`{disable:true,fieldName:x轴}`
- 说明: 图例分为两个部分 数据字段名称，配置信息,

```javascript
{
    fieldName:"",//数据字段的名称，默认是以X轴显示图例
    disable:true,//是否显示图例，如果设置为true，则图例不可显示，若此字段不提供或者为false，则显示图例
    ...其他参数

}
```

**其他参数:**

图例的配置信息，支持的属性如下：

<a name="3d0a2df9"></a>

- `position`: String


设置图例的显示位置，可设置的值为：'top'、'right'、'bottom'、'left'，分别表示上、右、下、左。默认为 top。

- `align`: String


当 `position` 为 'top'，'bottom' 时生效，用于设置水平方向上图例的对齐方式，可设置的值为：'left'、'center'、'right' ，默认为 'left' ，左对齐。

| **left（默认）** | **center** | **right** |
| --- | --- | --- |
| ![](https://gw.alipayobjects.com/zos/skylark/14e43b86-b0d3-46bf-aa61-d9d35e40afc3/2018/png/58dffd37-ac70-466a-8ab0-7ff729927c52.png#width=) | ![](https://gw.alipayobjects.com/zos/skylark/8b616505-6336-4423-b600-ef0eda5e43cf/2018/png/71cffe7e-2cec-4a64-98d0-30dc25e601a5.png#width=) | ![](https://gw.alipayobjects.com/zos/skylark/a954ed14-8b32-4cdd-8e7e-c018d642cd2c/2018/png/d58b8647-c5b2-4f03-906d-4438665369b9.png#width=) |


- `verticalAlign`: String


当 `position` 为 'left'、'right' 时生效，用于设置垂直方向上图例的对齐方式，可设置的值为：'top'、'middle'、'bottom'，默认为 'middle'，居中对齐。

| **middle（默认）** | **top** | **bottom** |
| --- | --- | --- |
| ![](https://gw.alipayobjects.com/zos/skylark/3e351090-9e91-44b7-9c79-9fae1576a83e/2018/png/90d4ab82-0baa-429c-a92a-eb06c51e9b0d.png#width=) | ![](https://gw.alipayobjects.com/zos/skylark/a6d8e7cd-951b-409e-96c7-b76a49ec0405/2018/png/6504d001-3bd8-4e3d-acd9-0c1fda595a0f.png#width=) | ![](https://gw.alipayobjects.com/zos/skylark/e5a77ada-f4bc-4acd-9611-aac5f9769a41/2018/png/795f70b0-89bc-4b1b-a8d6-b26b543521c4.png#width=) |


- `itemWidth`: Number/'auto'


用于设置每个图例项的宽度，默认为 'auto'，即使用 F2 默认的图例布局计算 `itemWidth`。如果 `itemWidth` 为 null，则会根据每个图例项自身的宽度计算，另外用户也可以自己设置 `itemWidth` 的数值。

- `showTitle`: Boolean


是否显示图例标题，默认值为 false，即不展示。

- `titleStyle`: Object


图例标题的显示样式设置，详见[绘图属性](https://www.yuque.com/antv/f2/canvas)。

```javascript
titleStyle: {
  textAlign: 'center', // 文本对齐方向，可取值为： start middle end
  fill: '#404040', // 文本的颜色
  fontSize: 12, // 文本大小
  fontWeight: 'bold', // 文本粗细
  textBaseline: 'top' // 文本基准线，可取 top middle bottom，默认为middle
}
```

- `offsetX`: Number


图例 x 方向的整体偏移值，数值类型，数值单位为 'px'，默认值为 0。

- `offsetY`: Number


图例 Y 方向的整体偏移值，数值类型，数值单位为 'px'，默认值为 0。

- `titleGap`: Number

其他详细配置请见:[Legend配置](https://www.yuque.com/antv/f2/api-legend#36f00efb)

### tooltip (提示信息)
- 是否必须:False
- 参数类型:Object
- 描述:提示信息
- 默认：`{disable:true}`
- 说明: 下面列出常用的tooltip配置，在某些情况需要获取到chart实例来进行操作的话，请使用自定义render:custom-render='extra'。[tooltip自定义实例](https://github.com/MrGaoGang/oview/blob/master/examples/components/chart/Radar.vue) 和 [tooltip普通使用实例](https://github.com/MrGaoGang/oview/blob/master/examples/components/chart/Line.vue)

```javascript
{
    disable:true,//是否显示提示信息，如果设置为true，则提示信息不可显示，若此字段不提供或者为false，则显示提示信息
   // 其他配置信息
    alwaysShow: false, // 当移出触发区域，是否仍显示提示框内容，默认为 false，移出触发区域 tooltip 消失，设置为 true 可以保证一直显示提示框内容
    offsetX: 0, // x 方向的偏移
    offsetY: 0, // y 方向的偏移
    triggerOn: [ 'touchstart', 'touchmove' ], // tooltip 出现的触发行为，可自定义，用法同 legend 的 triggerOn
    triggerOff: 'touchend', // 消失的触发行为，可自定义
    showTitle: false, // 是否展示标题，默认不展示
    showCrosshairs: false, // 是否显示辅助线，点图、路径图、线图、面积图默认展示
    crosshairsStyle: {
        stroke: 'rgba(0, 0, 0, 0.25)',
        lineWidth: 2
    }, // 配置辅助线的样式
    showTooltipMarker: true, // 是否显示 tooltipMarker
    tooltipMarkerStyle: {
        fill: '#fff' // 设置 tooltipMarker 的样式
    },
    background: {
        radius: 2,
        fill: '#1890FF',
        padding: [ 6, 10 ]
    }, // tooltip 内容框的背景样式
    titleStyle: {
      fontSize: 24,
      fill: '#fff',
      textAlign: 'start',
      textBaseline: 'top'
    }, // tooltip 标题的文本样式配置，showTitle 为 false 时不生效
    nameStyle: {
       fontSize: 24,
       fill: '#fff',
       textAlign: 'start',
       textBaseline: 'middle'
     }, // tooltip name 项的文本样式配置
     valueStyle: {
      fontSize: 24,
      fill: '#fff',
      textAlign: 'start',
      textBaseline: 'middle'
     }, // tooltip value 项的文本样式配置
    showItemMarker: true, // 是否展示每条记录项前面的 marker
    itemMarkerStyle: {
      radius: 7,
      symbol: 'circle',
      lineWidth: 2,
      stroke: '#fff'
    }, // 每条记录项前面的 marker 的样式配置
     custom: {Boolean}, // 是否自定义 tooltip 提示框
     onShow(obj) {
       // obj: { x, y, title, items }
     }, // tooltip 显示时的回调函数
     onHide(obj) {
    // obj: { x, y, title, items }
    }, // tooltip 隐藏时的回调函数
    onChange(obj) {
    // obj: { x, y, title, items }
    }, // tooltip 内容发生改变时的回调函数
    crosshairsType: {String}, // 辅助线的种类
    showXTip: {Boolean}, // 是否展示 X 轴的辅助信息
    showYTip: {Boolean}, // 是否展示 Y 轴的辅助信息
    xTip: {Object}/{Function}, // X 轴辅助信息的文本样式
    yTip: {Object}/{Function, // Y 轴辅助信息的文本样式
    xTipBackground: {Object}, // X 轴辅助信息的背景框样式
    yTipBackground: {Object}, // Y 轴辅助信息的背景框样式  
    snap: {Boolean} // 是否将辅助线准确定位至数据点

}
```


### chart-config (图表配置)
- 是否必须:False
- 参数类型:Object
- 描述:图表样式的配置，比如给图表添加内外边距(padding: [ 0, 10, 40, 100 ] // 分别设置上、右、下、左边距)，给画布添加边距:appendPadding。所以chart-config应该为:`{padding:[ 0, 10, 40, 100 ],appendPadding:[20,10,30,12]}` 
- 默认：{}


### width/height
- 是否必须:False
- 参数类型:Integer
- 描述:图表的宽度和高度
- 默认：图表宽度，默认为:屏幕宽度；图表高度，默认为:300 

### backgroundColor
- 是否必须:False
- 参数类型:String
- 描述:图表背景颜色
- 默认：#ffffff (白色)




### scale
- 是否必须:False
- 参数类型:Object
- 描述:度量 Scale，是数据空间到图形空间的转换桥梁，负责原始数据到 [0, 1] 区间数值的相互转换工作。针对不同的数据类型对应不同类型的度量。
- 默认：{}
- 说明：示例请见[面积图](https://github.com/MrGaoGang/oview/blob/master/examples/components/chart/Area.vue)

[文档详情说明](https://www.yuque.com/antv/f2/api-scale)
