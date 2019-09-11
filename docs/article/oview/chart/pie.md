<a href="https://github.com/MrGaoGang/oview/blob/master/examples/components/chart/Pie.vue">
<img src="https://img.shields.io/badge/oview-%E9%A5%BC%E7%8A%B6%E5%9B%BE%E6%A0%B7%E4%BE%8B%E6%BA%90%E7%A0%81-brightgreen.svg"/>
</a>

> [饼状图扫码预览]()  
<img src="/images/oview/qrcode.png" style="width:160px;height:160px;">

## 一、 饼状图基础构建
> [公用配置信息](../Chart.md)

```html
   <o-chart :data="data" :legend="legend">
      <o-pie position="name*percent"></o-pie>
    </o-chart>

```
没错构建一个饼状图就是如此简单，**必须提供的数据有:data和position**。
如果您需要显示提示信息/图例那么就需要配置:tooltip和:legend。
data的数据结构为:`[{name:"item",percent:0.3},{name:"item2",percent:0.7}]`
[样例源码](https://github.com/MrGaoGang/oview/blob/master/examples/components/chart/Pie.vue)

说明:
- 坐标轴percent为必传项。
- 公用配置信息已在[前文](../Chart.md)提及，请查阅

## 二、饼状图额外配置

### coord (坐标系)
- 是否必须:False
- 参数类型:Object
- 描述:坐标系
- 默认：`{ coordType: "polar",options: {transposed: true // 坐标系翻转}}`
- 说明: 图例分为两个部分 数据字段名称，配置信息,

> **coordType：有两种类型，1：笛卡尔坐标系(rect)；2：极坐标系（polar）**
<br>options为配置信息，不同的坐标系配置不同。

-  直角坐标系

| **属性名** | **类型** | **解释** |
| --- | --- | --- |
| `start` | Object | 坐标系的起始点，F2 图表的坐标系原点位于左下角。 |
| `end` | Object | 坐标系右上角的画布坐标。 |
| `transposed` | Boolean | 是否发生转置，true 表示发生了转置。 |
| `isRect` | Boolean | 是否是直角坐标系，直角坐标系下为 true。 |


-  极坐标系

| **属性名** | **类型** | **解释** |
| --- | --- | --- |
| `startAngle` | Number | 极坐标的起始角度，弧度制。 |
| `endAngle` | Number | 极坐标的结束角度，弧度制。 |
| `innerRadius` | Number | 绘制环图时，设置内部空心半径，相对值，0 至 1 范围。 |
| `radius` | Number | 设置圆的半径，相对值，0 至 1 范围。 |
| `isPolar` | Boolean | 判断是否是极坐标，极坐标下为 true。 |
| `transposed` | Boolean | 是否发生转置，true 表示发生了转置。 |
| `center` | Object | 极坐标的圆心所在的画布坐标。 |
| `circleRadius` | Number | 极坐标的半径值。 |


### pieLabel(绘制饼图文本)
- 是否必须:False
- 参数类型:Object
- 描述:PieLabel 是一个用于绘制饼图文本的插件。[详细文档](https://www.yuque.com/antv/f2/pie-label)
示例:

```js
{
        sidePadding: 30,
        activeShape: true,
        label1: function(data) {
          //第一个标签
          return {
            text: data.name,
            fill: "#343434",
            fontWeight: "bold"
          };
        },
        label2: function(data) {
          //第二个标签
          //如果不需要刻意删除label2
          return {
            text: data.percent * 100 + "%",
            fill: "#999"
          };
        },
        onClick: function(ev) {
          //点击之后显示
          var data = ev.data;
          if (data) {
            ev.chart.guide().clear();
            ev.chart.guide().html({
              position: ["50%", "50%"],
              html:
                '<div style="text-align: center;width:150px;height: 50px;">\n      <p style="font-size: 12px;color: #999;margin: 0" class="label1">' +
                data.name +
                '</p>\n      <p style="font-size: 18px;color: #343434;margin: 0;font-weight: bold;" class="label2">' +
                data.percent * 100 +
                "%</p>\n      </div>"
            });
            ev.chart.repaint();
            // $('#title').text(data.type);
            // $('#money').text(data.money);
          }
        }
      };
```


