> 在Vue开发中我们难免会引用各种组件和样式；有时候样式不符合业务需求；则需要对指定的dom进行样式的修改；如果我们在vue中使用了scoped，
则无法在父组件中修改子组件的样式。下面介绍几种修改样式的方法

### 1、部分全局方法

```css
<style>
/**在全局样式中修改要覆盖的样式**/
</style>

<style scoped>
/**本地样式**/
</style>
```


### 2、深选择器

```css
.parentclass >>> .childClass{

}
/**或者使用**/
.parentclass /deep/ .childClass{

}

```
