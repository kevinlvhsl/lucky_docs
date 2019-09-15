
<a href="https://github.com/MrGaoGang/oview/blob/master/examples/components/chart/Area.vue">
<img src="https://img.shields.io/badge/oview-%E5%8C%BA%E5%9F%9F%E9%9D%A2%E7%A7%AF%E5%9B%BE%E6%A0%B7%E4%BE%8B%E6%BA%90%E7%A0%81-brightgreen.svg"/>
</a>

> [区域面积图扫码预览]()

<img src="../../../images/oview/qrcode.png" style="width:160px;height:160px;">

如果您仔细查看了，区域面积图和折线图，您会发现，二者其实并无巨大差异，区域面积图是基于折线图进行的改造。主要额外使用到了以下两个属性:

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

所以，**详细配置[请见折线图](./line.md)**