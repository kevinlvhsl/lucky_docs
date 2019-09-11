
> 原生前端API主要有一下几个：

> 1、mx.ui/mx.data/mx.server/mx.session : [链接](https://apidocs.mendix.com/7/client/mx.html)

> 2、mendix ：[链接](https://apidocs.mendix.com/7/client/mendix_lib_MxObject.html)

> 3、mxui : [链接](https://apidocs.mendix.com/7/client/mxui_widget__WidgetBase.html)


## 一、常用的API

### (一) 从实体中获取/创建/删除数据

```
mx.data.get({
    xpath: "//System.User",
    filter: {
        sort: [["Name", "asc"]],
        offset: 0,
        amount: 10
    },
    callback: function(objs) {
        console.log("Received " + objs.length + " MxObjects");
    }
});


mx.data.create({
    entity: "MyFirstModule.Cat",
    callback: function(obj) {
        console.log("Object created on server");
    },
    error: function(e) {
        console.error("Could not commit object:", e);
    }
})

mx.data.remove({
    guids: [ "123456", "45678" ],
    callback: function() {
        console.log("Objects removed");
    },
    error: function(e) {
        console.log("Could not remove objects:", e);
    }
});
```

### （二）执行微流

```
mx.ui.action("微流的名称",{
    context:上下文,
    progress: "modal",
    progressMsg:"进度条消息",
    callback: function(result) {
        console.log("Engine started: " + result);
    }
})

mx.data.action({
    params: {
        applyto: "selection"
        actionname: "微流",
        guids: [ "281530811285515", "281530811285506"]//需要传递的参数
    },
    callback: function(obj) {
        // expect single MxObject
        alert(obj.get("manufacturer"));
    },
    error: function(error) {
        alert(error.message);
    }
});
```

### （三）打开页面

```
/**
请见：https://apidocs.mendix.com/7/client/mendix_lib_MxContext.html
*/
//上下文如何获取?
var _context=mendix.lib.MxContext();
_context.setTrackEntity(你需要传递的实体)
//或者使用_context.setTrackId(你需要传递的guid)
mx.ui.openForm("页面",{
    location: "content/popup/modal",
    context:_context,
    callback: function(form) {
        console.log(form.id);
    }
})
```

### （四）监听实体值得变化

```
//监听某个实体的变化
var subscription = mx.data.subscribe({
    guid: "123213",
    callback: function(guid) {
        console.log("Object with guid " + guid + " changed");
    }
});

mx.data.unsubscribe(subscription);


//监听实体某个属性的变化
var subscription = mx.data.subscribe({
    guid: "123213",
    attr: "Name",
    callback: function(guid, attr, value) {
        console.log("Object with guid " + guid + " had its attribute " +
                    attr + " change to " + value);
    }
});

mx.data.unsubscribe(subscription);

//监听整个实体的变化
// Subscribe to changes in a class
var subscription = mx.data.subscribe({
    entity: "System.User",
    callback: function(entity) {
        console.log("Update on entity " + entity);
    }
});

mx.data.unsubscribe(subscription);
```

### （五）查询管理关系的数据

```
//多对一关系，路径要指定到关联关系实体的字段
obj.fetch("Demo.Test/Test_Test2/test2Attr",function(data){
    //成功回调数据，返回的是一条数据
},function(){
    
});

//多对对一关系，路径要指定到关联关系实体，不能是字段
obj.fetch("Demo.Test/Test_Test3",function(data){
    //成功回调数据，返回的是一个列表数据
},function(){
    
});

```

### （六）创建一个上下文

详情请见:[组件开发上下文](https://apidocs.mendix.com/7/client/mendix_lib_MxContext.html)


```
var context=mendix.lib.MxContext();
context.setTrackEntity(你的obj)


```


## 二、组件开发XML文档

### （一）property配置

```
<property key="你的键" type="配置的类型" 其他的请见下面>


</property>


1、配置的类型有：
   <xs:enumeration value="attribute"/>
    <xs:enumeration value="boolean"/>
    <xs:enumeration value="entity"/>
    <xs:enumeration value="entityConstraint"/>
    <xs:enumeration value="enumeration"/>
    <xs:enumeration value="form"/>//页面
    <xs:enumeration value="image"/>
    <xs:enumeration value="integer"/>
    <xs:enumeration value="microflow"/>//微流
    <xs:enumeration value="object"/>
    <xs:enumeration value="string"/>
    <xs:enumeration value="translatableString"/>

2、其他配置项
isList="" //是否为列表配置，只有当type="object"的时候有效

entityProperty="配置实体的key" 
//执行微流时入参的实体，注意此处的Key为相对位置；
//也即是如果这个key所在的property和你配置的property在同一层级，
//那么就直接使用实体的key，要是此propery比实体的property深一层，
//那么此处就要写:   ../实体的key

allowNonPersistableEntities="false"//是否允许非持久化实体

isPath="no"//是否可通过关联取数据

parameterIsList="false/true"//微流的入参是否为List<Object>的形式

multiline="false"//当type="string"的时候是否支持多行

defaultValue=""//默认值

required="false/true"//此配置项是否必须配置

isDefault="false"//是否默认
```

### （二）两个例子

```

1、枚举选择，实际在读取的时候是按照key

<property key="emnu" type="enumeration" defaultValue="popup">
    <caption>名称</caption>
    <category>分类</category>
    <description>描述</description>
    <enumerationValues>
        <enumerationValue key="popup">弹窗</enumerationValue>
        <enumerationValue key="content">当前页面</enumerationValue>
    </enumerationValues>
</property>

2、实体配置
<property key="enti" type="entity" isPath="true">
    <caption>名称</caption>
    <category>分类</category>
    <description>描述</description>

</property>


3、微流配置（接受list<object>方式的入参）
<property key="mf" type="microflow" entityProperty="enti"parameterIsList="true">
    <caption>名称</caption>
    <category>分类</category>
    <description>描述</description>
    <returnType type="Void"/>
    或者
     <returnType type="Object" isList="true" entityProperty="enti"/>
</property>


//上述的returnType的type可以有
<xs:enumeration value="Void"/>
<xs:enumeration value="Boolean"/>
<xs:enumeration value="Integer"/>
<xs:enumeration value="Decimal"/>
<xs:enumeration value="DateTime"/>
<xs:enumeration value="String"/>
<xs:enumeration value="Object"/>


4、选择实体的属性
<property key="attr" type="attribute" required="true">
    <caption>名称</caption>
    <category>分类</category>
    <description>描述</description>
    <attributeTypes>
        <attributeType name="AutoNumber"/>
         <attributeType name="Decimal"/>
    </attributeTypes>
</property>

//所有可能的类型有:
            <xs:enumeration value="AutoNumber"/>
            <xs:enumeration value="Binary"/>
            <xs:enumeration value="Boolean"/>
            <xs:enumeration value="DateTime"/>
            <xs:enumeration value="Decimal"/>
            <xs:enumeration value="Enum"/>
            <xs:enumeration value="HashString"/>
            <xs:enumeration value="Integer"/>
            <xs:enumeration value="Long"/>
            <xs:enumeration value="String"/>

5、选择实体的属性
//所选择的属性为某个实体下面的属性
<property key="attr" type="attribute" required="true" entityProperty="enti">
    <caption>名称</caption>
    <category>分类</category>
    <description>描述</description>
    <attributeTypes>
        <attributeType name="AutoNumber"/>
         <attributeType name="Decimal"/>
    </attributeTypes>
</property>



```