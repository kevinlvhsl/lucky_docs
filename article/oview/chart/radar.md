<a href="https://github.com/MrGaoGang/oview/blob/master/examples/components/chart/Area.vue">
<img src="https://img.shields.io/badge/oview-%E9%9B%B7%E8%BE%BE%E5%9B%BE%E6%A0%B7%E4%BE%8B%E6%BA%90%E7%A0%81-brightgreen.svg"/>
</a>

> [雷达图扫码预览]()

<img src="../../../images/oview/qrcode.png" style="width:160px;height:160px;">


## 一、 雷达图基础构建

```html
 <p class="item-desc">普通的雷达图</p>
    <o-chart :data="normalData" :legend="normalLegend" :col-defs="normalColumnConfig">
      <o-radar :axis="normaAxis" position="item*score" color-field="user"></o-radar>
    </o-chart>
```
这是一个光滑雷达图的案例，其中包括的配置项，
- 必须有的是data和position;
- col-defs：对提供的每个数据进行配置，legend:显示图例,
- axis:坐标系配置,
- color-field:对数据中的那个字段显示颜色


说明:
- 坐标轴position为必传项。
- 公用配置信息已在[前文](../Chart.md)提及，请查阅

> 样例中有**普通的雷达图，雷达面积图，自定义图标-雷达图**其不同之处在于对每一项的配置不同而已，如您需要实现其中的某一部分请看[样例源码](https://github.com/MrGaoGang/oview/blob/master/examples/components/chart/Radar.vue)
，查看具体配置,具体配置信息和作用已在前文和下文中注明，请查阅。


## 二、雷达图额外配置
> [公用配置信息](../Chart.md)

### isArea (以区域方式显示)
- 是否必须:False
- 参数类型:Boolean
- 默认：False
- 说明:是否以区域方式显示，如果为True则显示为雷达面积图。

### customDefine (是否自定义显示)
- 是否必须:False
- 参数类型:Boolean
- 默认：False
- 说明:是否自定义显示各个图表的logo.




