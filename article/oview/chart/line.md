<a href="https://github.com/MrGaoGang/oview/blob/master/examples/components/chart/Line.vue">
<img src="https://img.shields.io/badge/oview-%E6%8A%98%E7%BA%BF%E5%9B%BE%E6%A0%B7%E4%BE%8B%E6%BA%90%E7%A0%81-brightgreen.svg"/>
</a>


> [折线图扫码预览]()

<img src="../../../images/oview/qrcode.png" style="width:160px;height:160px;">


## 一、 折线图基础构建

```html
<p class="item-desc">光滑的的折线图</p>
 <o-chart :data="normalData" :col-defs="normaColConfig" :tooltip="normalTootip">
        <!-- 如果为line类型：shape可选为'line', 'smooth', 'dash'   dash：虚线，smooth： 平滑线 -->
        <o-line :axis="normaAxis" shape="smooth" :position="'date*value'"></o-line>
</o-chart>
```
这是一个光滑折线图的案例，其中包括的配置项，
- 必须有的是data和position;
- col-defs：对提供的每个数据进行配置，tooltip:显示提示信息,
- axis:坐标系配置,
- shape:设置线段类型，shape可选为'line', 'smooth', 'dash'

具体配置，请见下文

说明:
- 坐标轴position为必传项。
- 公用配置信息已在[前文](../Chart.md)提及，请查阅

> 样例中有**普通的折线图，光滑的的折线图，带点的折线图，光滑的带点折线图，层叠的带点光滑折线图**其不同之处在于对每一项的配置不同而已，如您需要实现其中的某一部分请查阅[样例源码](https://github.com/MrGaoGang/oview/blob/master/examples/components/chart/Line.vue)
，查看具体配置,具体配置信息和作用已在前文和下文中注明，请查阅。


## 二、折线图额外配置
> [公用配置信息](../Chart.md)

### type (显示类型)
- 是否必须:False
- 参数类型:枚举`['line','point']`中的二选一
- 默认：line
- 说明:显示类型，以线段显示还是使用带点折线图显示


### shape (线段形状)
- 是否必须:False
- 参数类型:见下
- 默认:line
- 说明:只支持接收一个参数，指定几何图像对象绘制的形状。根据上述设置的type不同，可以设置不同的shape形状

| **(type)类型** | **shape 类型** | **解释** |
| --- | --- | --- |
| point | 'circle', 'hollowCircle', 'rect' | 默认为 'circle' |
| line | 'line', 'smooth', 'dash' | dash：虚线，smooth： 平滑线 |

### showNulls(是否显示空值)
- 是否必须:False
- 参数类型:Boolean
- 默认：False
- 说明:是否显示空值，**如果为True，则折线图遇到空值，则是不连续线段**。



### isMutiLine（是否存在多条线段）
- 是否必须:False
- 参数类型:Boolean
- 默认：False
- 说明:是否存在多条线段，**如果为True，则是则会显示多条线段，demo请见[区域面积图-层叠面积图](https://github.com/MrGaoGang/oview/blob/master/examples/components/chart/Area.vue)**。





### isArea (区域面积图的配置)
- 是否必须:False
- 参数类型:Boolean
- 默认：False
- 说明:是否以区域方式显示，如果为True则显示[区域面积图](./area.md)

