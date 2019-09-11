<a href="https://github.com/MrGaoGang/oview/blob/master/examples/components/chart/Interaction.vue">
<img src="https://img.shields.io/badge/oview-%E6%8A%98%E7%BA%BF%E5%9B%BE%E6%A0%B7%E4%BE%8B%E6%BA%90%E7%A0%81-brightgreen.svg"/>
</a>

> [图表交互扫码预览]()

<img src="/images/oview/qrcode.png" style="width:160px;height:160px;">

**如果您有图表左右移动端的诉求，请配置 ineraction 和滚动条是否显示**

### 一、图表是否支持滚动配置(ineraction)

```html
<p class="item-desc">散点图平移和缩放</p>
<o-chart
  :data="pointData"
  :interaction="getPointInteraction()"
  show-scroll-x
  show-scroll-y
>
  <o-point
    position="Calories*Potassium"
    color-field="Manufacturer"
    :chart-style="{fillOpacity: 0.65}"
  ></o-point>
</o-chart>
```

**其中重点配置项为:interaction**

-

- 接收数据类型: `Object或者Array`
- 单个数据格式:`{type:'pan',...其他配置}`
  - type 所有可取类型值，可以从`import {INTERACTION_TYPE} from "oview"`中获取到（包括以 5 种类型）
  - 饼图选中
  - 柱状图选中
  - 图表平移
  - 图表缩放
  - 图表 swipe 快扫

#### 1. 饼图选中

```json
{
  "type": "pie-select",
  "startEvent": { String }, // 触发事件，默认为 tap
  "animate": { Boolean } || { Object }, // 动画配置
  "offset": { Number }, // 光环偏移距离
  "appendRadius": { Number }, // 光环大小
  "style": { Object }, // 光环的样式配置
  "cancelable": { Boolean }, // 是否允许取消选中，默认值为 true，表示允许
  "onStart": { Function }, // 事件触发后的回调
  "onEnd": { Function }, // 事件结束后的回调
  "defaultSelected": { Object } // 设置默认选中的数据，该属性需要在 chart.render() 之后调用方可生效
}
```

#### 2. 柱状图选中

```json
{
  "type": "interval-select",
  "startEvent": { String }, // 触发事件，默认为 tap 事件
  "selectStyle": { Object }, // 被选中图形的样式配置
  "unSelectStyle": { Object }, // 未被选中图形的样式配置
  "selectAxis": { Boolean }, // 是否高亮坐标轴文本
  "selectAxisStyle": { Object }, // 坐标轴文本被选中后的样式
  "cancelable": { Boolean }, // 是否允许取消选中，默认值为 true，表示允许
  "onStart": { Function }, // 事件触发后的回调
  "onEnd": { Function }, // 事件结束后的回调
  "mode": { String }, // 选中策略，默认为 'shape', 即击中柱子才会触发交互
  "defaultSelected": { Object } // 设置默认选中的数据，该属性需要在 chart.render() 之后调用方可生效
}
```

#### 3. 图表平移

```json
{
  "type": "pan",
  "mode": { String }, // 图表平移的方向，默认为 'x'
  "speed": { number }, // 用于控制分类类型或者 TimeCat 类型数据的平移速度
  "step": { number }, // 用于控制分类类型或者 TimeCat 类型数据每次平移的数据条数
  "panThreshold": { Number }, // hammer.js 设置，用于设置触发 pan 事件的最小移动距离
  "pressThreshold": { Number }, // hammer.js 设置，用于设置触发 press 事件的设置
  "pressTime": { Number }, // hammer.js 设置，用于设置触发 press 事件的最小时间差
  "limitRange": { Object }, // 限制范围
  "onStart": { Function }, // 事件触发后的回调
  "onProcess": { Function }, // 事件进行中的回调
  "onEnd": { Function } // 事件结束后的回调
}
```

#### 3. 图表缩放

```json
{
  "type": "pinch",
  "mode": { String }, // 图表平移的方向，默认为 'x'
  "sensitivity": { Number }, // 用于控制分类类型数据的缩放灵敏度
  "minScale": { Number }, // 缩小的最小倍数
  "maxScale": { Number }, // 放大的最大倍数
  "onStart": { Function }, // 事件触发后的回调
  "onProcess": { Function }, // 事件进行中的回调
  "onEnd": { Function }, // 事件结束后的回调
  "pressThreshold": 9, // hammer.js 设置，用于设置触发 press 事件的设置
  "pressTime": 251 // hammer.js 设置，用于设置触发 press 事件的最小时间差
}
```

#### 4. 图表快扫

```json
{
  "type": "swipe",
  "speed": { number }, // 用于控制分类类型或者 TimeCat 类型数据的平移速度
  "threshold": { Number }, // hammer.js 设置，用于设置触发 swipe 事件的最小移动距离
  "velocity": { Number }, // hammer.js 设置，用于设置 swipe 的最小速度
  "limitRange": { Object }, // 限制范围
  "onStart": { Function }, // 事件触发后的回调
  "onProcess": { Function }, // 事件进行中的回调
  "onEnd": { Function } // 事件结束后的回调
}
```

[详细 Interaction 配置请见](https://www.yuque.com/antv/f2/api-interaction)

### 二、图表平移滚动条配置

#### 1、是否显示横向滚动条和纵向滚动条(快捷方式配置)

**您可以使用 show-scroll-x 或者 show-scroll-y 快捷方式配置是否显示横向滚动条和纵向滚动条**

```html
<o-chart
  :data="pointData"
  :interaction="getPointInteraction()"
  show-scroll-x
  show-scroll-y
>
  <o-point
    position="Calories*Potassium"
    color-field="Manufacturer"
    :chart-style="{fillOpacity: 0.65}"
  ></o-point>
</o-chart>
```

#### 2、是否显示横向滚动条和纵向滚动条(详细配置)

> 当快捷方式配置无法满足您的需求时，就需要使用详细配置了

```html
<o-chart
  :data="scrollData"
  :col-defs="scrollConfig"
  :interaction="getScrollInteraction()"
  :scroll-bar="scrollBarConfig"
>
  <o-line :position="'release*count'"></o-line>
</o-chart>
```

**scrollBarConfig 的配置如下**

<img src="/images/oview/scroll.png" >
