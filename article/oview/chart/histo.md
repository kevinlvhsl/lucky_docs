<a href="https://github.com/MrGaoGang/oview/blob/master/examples/components/chart/Histogram.vue">
<img src="https://img.shields.io/badge/oview-%E6%9F%B1%E7%8A%B6%E5%9B%BE%E6%A0%B7%E4%BE%8B%E6%BA%90%E7%A0%81-brightgreen.svg"/>
</a>

> [柱状图扫码预览]()

<img src="../../../images/oview/qrcode.png" style="width:160px;height:160px;">


## 一、 柱状图基础构建

```html
 <p class="item-desc">普通的柱状图</p>
    <o-chart :data="data" :tooltip="tooltip">
      <o-histogram position="year*sales"></o-histogram>
    </o-chart>
```
构建柱状图，**必须提供的数据有:data和position**。
如果您需要显示提示信息/图例那么就需要配置:tooltip和:legend。
data的数据结构为:`[[{
             year: "1951 年",
             sales: 38
         },
         {
             year: "1952 年",
             sales: 52
         }]`

说明:
- 坐标轴position为必传项。
- 公用配置信息已在[前文](../Chart.md)提及，请查阅

> 样例中有**普通的柱状图，分组柱状图，层叠柱状图，区间柱状图，基础条形图**其不同之处在于对每一项的配置不同而已，如您需要实现其中的某一部分请查阅[样例源码](https://github.com/MrGaoGang/oview/blob/master/examples/components/chart/Histogram.vue)
，查看具体配置,具体配置信息和作用已在前文和样例中注明，请查阅。

## 二、柱状图额外配置
> [公用配置信息](../Chart.md)

### coord (坐标系)
- 是否必须:False
- 参数类型:Object
- 描述:坐标系
- 默认：`{ coordType: "rect",options: {transposed: false // 坐标系不翻转}}`，默认使用极坐标系的方式
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

