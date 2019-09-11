
> 以下所有文件均是原创，如需转载请注明作者和链接地址。

#### 1、如何读取resource下的配置文件信息
    假设resource目录下的文明为properties文件；
    
```
//第一步：获取配置文件目录:
File resourcePath=Core.getConfiguration().getResourcesPath();

//第二步：读取对应配置文件，此处可以根据环境的不同读取不同的配置文件
File configFile=new File(resourcePath,"config.properties");

Properties prop = new Properties();
//第三步：读取属性文件到Properties中
InputStream in = new BufferedInputStream (new FileInputStream(configFile));
prop.load(in);     ///加载属性列表
 Iterator<String> it=prop.stringPropertyNames().iterator();
         while(it.hasNext()){
            String key=it.next();
            System.out.println(key+":"+prop.getProperty(key));
         }
in.close();
```



#### 2、如何获取Cookie



```java
String cookies="";
Cookie[] cook=this.context().getRuntimeRequest().get().getHttpServletRequest().getCookies();

for(Cookie c:cook){
    cookies+=c.getName()+"="+c.getValue()+";";
}
```

#### 3、如何在java中打Log

```
private static ILogNode log=Core.getLogger("mylogname");
```
#### 4、如何在mendix启动之前做一下预处理？

> 只需要在Project》Settings》Runtime》After Startup中调用即可。

#### 5、自定义Rest服务
>常常使用mendix自带的Rest服务无法满足我们的需求，那么怎么自定义Rest服务呢？自定义Rest服务只需要继承RequestHandler即可。

```
//第一步：继承RequestHandler，并实现processRequest方法
public class ArticleService extends RequestHandler {
    @Override
    protected void processRequest(IMxRuntimeRequest iMxRuntimeRequest, IMxRuntimeResponse iMxRuntimeResponse, String path) throws Exception {
        
    }
}

//第二步：在启动整个mendix的时候，调用一个Javaaction，在此Action中进行Rest服务注册。

public java.lang.Boolean executeAction() throws Exception
	{
		// BEGIN USER CODE
		//throw new com.mendix.systemwideinterfaces.MendixRuntimeException("Java action was not implemented");
		// 注册自定义服务
		Core.addRequestHandler("my/rest",new ArticleService());
		return true;
		// END USER CODE
	}

```
