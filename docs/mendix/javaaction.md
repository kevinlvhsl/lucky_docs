> 以下所有文件均是原创，如需转载请注明作者和链接地址。


>此文demo地址：https://github.com/mrgaogang/mendix  

> 日常开发中我们难免会有一些情况是无法使用微流实现的，此时需要我们使用Java原生的能力:JavaAction；此文主要介绍如何JavaAction对数据库的数据进行增删改查和使用action执行微流。


目录:
- 数据添加；
- 数据删除；
- 数据修改；
- 数据查询；
- 使用Action执行微流；

### JavaAction使用注意事项

JavaAction使用有几个注意点：
1. executeAction()是mendix默认调用的方法，且我们只能在//BEGIN 和//END之间编写Java代码。

```js
	public java.util.List<IMendixObject> executeAction() throws Exception
	{
		// BEGIN USER CODE
		//此处是你的代码
		// END USER CODE
	}
```

2. 如果你有大量的代码需要编写请在类的末尾以下两个分隔符之间编写

```js
// BEGIN EXTRA CODE
// END EXTRA CODE
```


### 一、数据的添加

> 数据的创建可以使用Core.instantiate创建一个空的对象，也可直接new 出空对象；数据的提交可以使用obj.commit()可以使用Core.commit()

```js
public IMendixObject executeAction() throws Exception
	{
		// BEGIN USER CODE
	//第一种方式使用 IMendxObject创建数据		
	// IMendixObject ob=	Core.instantiate(getContext(),"Demo.User");
	// ob.setValue(getContext(),"UserName",UserName);
	// ob.setValue(getContext(),"Password",Password);
	// ob.setValue(getContext(),"Age",Age);
	// Core.commit(getContext(),ob);

	//第二种方式直接创建对象
	User us=new User(getContext());
	us.setUserName(UserName);
	us.setPassword(Password);
	us.setAge(Age);
	//提交数据到数据库
	us.commit(getContext());
	//也可以使用以下方式
	//Core.commit(getContext(),us.getMendixObject());
	return us.getMendixObject();
		// END USER CODE
	}

```


二、数据的删除
> 数据的删除可以使用obj.delete()也可使用Core.delete()

```js
public java.lang.Boolean executeAction() throws Exception
	{
		this.ParameterParameter1 = __ParameterParameter1 == null ? null : demo.proxies.User.initialize(getContext(), __ParameterParameter1);

		// BEGIN USER CODE
		//可以直接使用obj.delete
			ParameterParameter1.delete(getContext());
			return	true;
		// 也可以使用Core.delete的方式删除数据
		 //return Core.delete(getContext(),ParameterParameter1.getMendixObject());
		// END USER CODE
	}
```

三、数据的修改
> 数据的修改和数据的提交类似，只是在action将数据修改后重新提交。

```js
	@Override
	public IMendixObject executeAction() throws Exception
	{
		this.ParameterParameter1 = __ParameterParameter1 == null ? null : demo.proxies.User.initialize(getContext(), __ParameterParameter1);

		// BEGIN USER CODE
		ParameterParameter1.setUserName("===>我修改啦");
		ParameterParameter1.setPassword("我修改了密码");
		ParameterParameter1.setAge(200L);
		Core.commit(getContext(),ParameterParameter1.getMendixObject());
		return ParameterParameter1.getMendixObject();
		// END USER CODE
	}
```


四、查询数据
> 数据的查询主要使用以下几种方式

1. Core.retrieveXPathQuery()
2. Core.retrieveXPathQueryAggregate()
3. Core.	retrieveId()
4. Core.	retrieveIdAsync()

> 其中XPath查询数据需要在前方加上// ；但是在mendix客户端编写xpath（比如在datagrid查询数据使用xpath）时 不需要加上//。

- //Demo.User 检索所有用户。
- //Demo.User[UserName='mrgao'] 检索名为'mrgao'的所有用户。
- avg(//Demo.User[Age >10 ]/Age) 检索所有用户年龄大于10岁的 年龄平均数。

其中XPath可用的函数有：
avg、count、max、min、sum、contains、starts-with、ends-with、not、true、false

```js
	@Override
	public java.util.List<IMendixObject> executeAction() throws Exception
	{
		// BEGIN USER CODE
		List<IMendixObject> list=Core.retrieveXPathQuery(getContext(),"//Demo.User");
		return list;
		// END USER CODE
	}

```


五、执行微流

> 微流的执行科分为同步执行execute()和异步执行executeAsyn()；此例子主要以同步执行为例；

1. 微流执行时参数的传递主要使用Map<String,Object>的方式，且Key必须要和参数入参名称相同；
2. 如果传入的是Object类型，则需要转化成mendixobject；
3. 微流执行完成可获取到其返回的参数；

```js
public java.lang.String executeAction() throws Exception
	{
		this.ParameterParameter1 = __ParameterParameter1 == null ? null : demo.proxies.User.initialize(getContext(), __ParameterParameter1);

		// BEGIN USER CODE
		Map<String,Object> map=new HashMap<>();
		//记得转换成mendixobject,且Map的key需要和微流入参的名称一样
		map.put("User",ParameterParameter1.getMendixObject());
		map.put("other",other);
		//执行微流，mf为微流，map则为需要执行微流的入参
		String result=Core.execute(getContext(),mf,map);
		return result;
		// END USER CODE
	}
```

> 如果还想了解更多相关Core的知识，请访问官方API [：Mendix官方CoreAPI](https://apidocs.mendix.com/7/runtime/com/mendix/core/Core.html#retrieveXPathQuery-com.mendix.systemwideinterfaces.core.IContext-java.lang.String-)   以及IMendixObject的API [:IMendixObject官方API](https://apidocs.mendix.com/7/runtime/com/mendix/systemwideinterfaces/core/IMendixObject.html)