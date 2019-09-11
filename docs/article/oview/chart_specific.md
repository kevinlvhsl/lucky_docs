此文内容：**各类图表公用配置属性**

阅读此文，大概需要5分钟。相信您已经知晓构建一个图表的基础步骤：

```javascript
<o-chart :data="normalData" :col-defs="normaColConfig" :tooltip="normalTootip">
    <o-line :axis="normaAxis" :position="'date*value'"></o-line>
</o-chart>

```
> 上一篇文章讲述了o-chart的配置，如果您没有查阅[图表Chart](https://mrgaogang.github.io/article/oview/Chart.html)，请先移步查看。这边文章主要讲述各个图表具体实现配置。目前oview支持的所有图表类型有：
- [饼状图](https://mrgaogang.github.io/oview/docs/#/pie)
- [柱状图](https://mrgaogang.github.io/oview/docs/#/histo)
- [折线图](https://mrgaogang.github.io/oview/docs/#/line)
- [雷达图](https://mrgaogang.github.io/oview/docs/#/radar)
- [散点图和气泡图](https://mrgaogang.github.io/oview/docs/#/point)
- [面积图](https://mrgaogang.github.io/oview/docs/#/area)


下面将对，各类图表公用配置属性进行简单介绍，主要包括:position(坐标轴) , axis(多个坐标轴具体配置) , colors(颜色) , animate(动画),chartStyle(图表样式）, size（数据图形大小）


### position (坐标轴)
- 是否必须:**True**
- 参数类型:String
- 说明: 配置x,y坐标轴，示例:`position="date*value"`，其中date为x轴,value为y轴。饼状图较为特殊，需传`position="name*percent"`名字和百分比，**其中percent为数据结构中必有字段**
- 示例:

```js
<o-line :axis="normaAxis" :position="'date*value'"></o-line>
<o-pie :coord="coord" position="name*percent"></o-pie>

```

### adjust(数据调整)
- 是否必须:**False**
- 参数类型:**Object**
- 默认值:`{type:'stack'}`
- 说明:声明几何标记对象的数据调整方式，可用于绘制层叠图、分组图等。支持单一的数据调整方式也支持各种数据调整方式的组合。**支持的调整类型包括：'stack', 'dodge'**




### axis (多个坐标轴具体配置)
- 是否必须:**False**
- 参数类型:**Array**
- 注意：**如使用axis，请必须上fieldName配置项,表示对某个坐标轴的具体配置**
- 说明: 多单个或者多个坐标轴，镜像详细配置,配置坐标轴的文本(label)，轴线(line)，刻度线(tickLine)，网格线(grid)。[详细配置文档](https://www.yuque.com/antv/f2/api-axis#5kktpp)
- 示例:

```js
//以雷达图具体配置（此例子对两个坐标轴的文本和网格线进行配置）
   normaAxis: [
        {
          fieldName: "score",//注意fieldName为必传项，表示对某个坐标轴的具体配置
          label: function label(text, index, total) {
            if (index === total - 1) {
              return null;
            }
            return {
              top: true
            };
          },
          grid: {
            lineDash: null,
            type: "arc" // 弧线网格
          }
        },
        {
          fieldName: "item",
          grid: {
            lineDash: null
          }
        }
      ],

```


### colors (颜色)
- 是否必须:False
- 参数类型:**Array**
- 说明: 默认值为["#1890FF","#13C2C2","#2FC25B","#FACC14","#F04864","#8543E0"]，如需要图表显示为单个颜色，请传入一个值即可

### colorField
- 是否必须:False
- 参数类型:String
- 说明: 为哪个坐标轴设置颜色


### animate (动画)
- 是否必须:False
- 参数类型:**Object**
- 说明:给x，y轴设置动画。[详细文档](https://www.yuque.com/antv/f2/api-animate#1fwryo)

```js
 <o-chart :data="normalData" :legend="normalLegend" :col-defs="normalColumnConfig">
      <o-radar
        :axis="normaAxis"
        is-area
        :animate="animate"
        position="item*score"
        color-field="user"
      ></o-radar>
 </o-chart>

//data部分
 animate: {
    //可以配置动效哦
    appear: {
        animation: "groupWaveIn",
        delay: 500 //延迟500s
    }
},
```



### chartStyle（图表样式）
- 是否必须:False
- 参数类型:**Object**
- 说明: 为图表设置样式。
示例:

```js
<o-point
    :axis="normaAxis"
    position="height*weight"
    color-field="gender"
    :chart-style="{fillOpacity: 0.65}"
></o-point>

```

### size（数据图形大小）
- 是否必须:False
- 参数类型:**Object**
- 说明:常用于散点图、气泡图。 将数据值映射到图形的大小上的方法。[详细文档](https://www.yuque.com/antv/f2/api-geometry#75hbfn)
- 注意：**fieldName**字段为必传项，表示对那个坐标轴的配置。且 **不同图形的 size 的含义有所差别**：
    - point 图形的 size 影响点的半径大小；
    - line, area, path 中的 size 影响线的粗细；
    - interval 的 size 影响柱状图的宽度。
- 此处暂时只支持，回调的方式。

示例:

```js
{
    fieldName: "z",//
    callback: function(z) {
        return [10, 40];
    }
}
```
