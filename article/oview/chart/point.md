
<a href="https://github.com/MrGaoGang/oview/blob/master/examples/components/chart/Point.vue">
<img src="https://img.shields.io/badge/oview-%E6%95%A3%E7%82%B9%E5%9B%BE%E6%A0%B7%E4%BE%8B%E6%BA%90%E7%A0%81-brightgreen.svg"/>
</a>

> [散点图扫码预览]()

<img src="../../../images/oview/qrcode.png" style="width:160px;height:160px;">


## 一、 散点图基础构建

```html
   <p class="item-desc">散点图</p>
    <o-chart
      :data="pointData"
      :legend="legend"
      :col-defs="normalColumnConfig"
      :chart-config="chartConfig()"
    >
      <o-point
        :axis="normaAxis"
        position="height*weight"
        color-field="gender"
        :chart-style="{fillOpacity: 0.65}"
      ></o-point>
    </o-chart>
```
这是一个光滑散点图的案例，其中包括的配置项，
- 必须有的是data和position;
- col-defs：对提供的每个数据进行配置，
- legend:显示图例,
- axis:坐标系配置,
- color-field:对数据中的那个字段显示颜色


说明:
- 坐标轴position为必传项。
- 公用配置信息已在[前文](../Chart.md)提及，请查阅

> 样例中有**散点图和气泡图**其不同之处在于对每一项的配置不同而已，如您需要实现其中的某一部分请看[样例源码](https://github.com/MrGaoGang/oview/blob/master/examples/components/chart/Point.vue)
，查看具体配置,具体配置信息和作用已在前文和下文中注明，请查阅。


## 二、散点图额外配置
> [公用配置信息](../Chart.md)

### shape(散点图的形状)
- 是否必须:False
- 参数类型:枚举 **['circle', 'hollowCircle', 'rect' ]** 中的一个
- 默认:circle
- 说明:只支持接收一个参数，指定几何图像对象绘制的形状


