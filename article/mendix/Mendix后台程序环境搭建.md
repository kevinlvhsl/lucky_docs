
> 以下所有文件均是原创，如需转载请注明作者和链接地址。


目录：
- 一、Docker的安装
- 二、Docker Compose安装
- 三、Mendix环境搭建
- 四、启动成功
- 五、Mendix后台环境搭建注意事项
    - 1、端口是否已被占用
    - 2、登录时为何使用Administor无法登录
    - 3、docker-compose-mysql字段简要介绍
    - 4 、访问地址为何过总是报错502

> 当在Mendix Desktop上编写完成项目，此时需要打包发布；首先请在客户端 -->Project-->Create Deployement  Project；
<img src="https://note.youdao.com/yws/public/resource/0987e4f96f6b436ed52b85016f1c84f8/xmlnote/WEBRESOURCE49021e83598f5daad897a346d65ebc63/33991" width="700" height="400" style="text-align:center">

    Mendix后台程序需要运行在Docker环境下，此文主要介绍mendix如何在centos下运行。
    打包环境必须为生产环境：
![](https://note.youdao.com/yws/public/resource/0987e4f96f6b436ed52b85016f1c84f8/xmlnote/WEBRESOURCE0f4b5e4d659abfd9fb58184d49346712/33988)
    
    Mendix程序需要运行需要的环境限制：
在Centos7.3及以上版本,且Docker 要求 CentOS 系统的内核版本高于 3.10；
由于Mendix运行的Docker compose版本为1.22,所以请安装Docker 17.06.2。


### 一、Docker的安装

- 1、Docker 要求 CentOS 系统的内核版本高于 3.10 ，查看本页面的前提条件来验证你的CentOS 版本是否支持 Docker 。
通过 uname -r 命令查看你当前的内核版本
 $ uname -r
- 2、使用 root 权限登录 Centos。确保 yum 包更新到最新。
$ sudo yum update
- 3、卸载旧版本(如果安装过旧版本的话)
$ sudo yum remove docker  docker-common docker-selinux docker-engine
- 4、安装需要的软件包， yum-util 提供yum-config-manager功能，另外两个是devicemapper驱动依赖的
$ sudo yum install -y yum-utils device-mapper-persistent-data lvm2
- 5、设置yum源
$ sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
 ![](https://note.youdao.com/yws/public/resource/0987e4f96f6b436ed52b85016f1c84f8/xmlnote/F762973DA5CE4BD69D91C962DB0184CC/33878)

- 6、可以查看所有仓库中所有docker版本，并选择特定版本安装
$ yum list docker-ce --showduplicates | sort -r

<img src="https://note.youdao.com/yws/public/resource/0987e4f96f6b436ed52b85016f1c84f8/xmlnote/9633B2B29917464D891698FE75048B3E/33887" width="700" height="400">
- 7、安装docker
$ sudo yum install docker-ce-17.06.2  #安装的是最新稳定版17.06.2
- 8、启动并加入开机启动
$ sudo systemctl start docker
$ sudo systemctl enable docker
- 9、验证安装是否成功(有client和service两部分表示docker安装启动都成功了)
$ docker version

<img src="https://note.youdao.com/yws/public/resource/0987e4f96f6b436ed52b85016f1c84f8/xmlnote/084DEBDFC501499594A581DB01C4AAF7/33885" width="600" height="400">

### 二、Docker Compose安装

    在安装Docker Compose之前请确定已经安装了python-pip。
    python-pip安装教程请见此文
    https://blog.csdn.net/yulei_qq/article/details/52984334

    安装好pip之后，就可以安装Docker-Compose了.
    在linunx终端执行：pip install docker-compose.

    检查docker-compose是否安装成功：

![](https://note.youdao.com/yws/public/resource/0987e4f96f6b436ed52b85016f1c84f8/xmlnote/B2DB9061D02B442EB64E31E33287DEB8/33896)

### 三、Mendix环境搭建
    Mendix运行在docker中，其开源环境请见:https://github.com/mendix/docker-mendix-buildpack。
![](https://note.youdao.com/yws/public/resource/0987e4f96f6b436ed52b85016f1c84f8/xmlnote/4003B12DA0294FE6B5325338F928F218/33903)
    开源地址的Readme.md文件有如下介绍：


<img src="https://note.youdao.com/yws/public/resource/0987e4f96f6b436ed52b85016f1c84f8/xmlnote/5C8F5B5FD9EB4C31BC354AE11F5C998D/33906" width="500" height="300">
    简单介绍：
get-sample：得到一个Mendix应用程序，并将其解压到build目录下；
buid-image：创建Mendix运行，需要的镜像；
run-container：启动容器。
    
    1、请将您之前打包好的mda文件上传到服务器
    scp xxx.mda root@ip地址:/usr/local/mendix/app
    (xxx：自己的工程名；mendix/app是自己创建的目录)
    
    2、复制项目并切换目录
        git clone https://github.com/mendix/docker-mendix-buildpack
	cd docker-mendix-buildpack
    
    3、将sample的apk替换成自己的apk
    
![](https://note.youdao.com/yws/public/resource/0987e4f96f6b436ed52b85016f1c84f8/xmlnote/7BD9499F9EEC482D9BEFB499E2AABE87/33916)
    替换成：
    <img src="https://note.youdao.com/yws/public/resource/0987e4f96f6b436ed52b85016f1c84f8/xmlnote/8C28E37E352443C9A1409AA56F95F80E/33919" width="600" height="400">

    4、启动容器
    运行make run-container
![](https://note.youdao.com/yws/public/resource/0987e4f96f6b436ed52b85016f1c84f8/xmlnote/420443281B1946668EFEBF59997A2C6E/33965)
正常情况下容器会被启动，这样就可以通过url地址访问自己的应用程序。但是在启动时总会遇到各种问题。



### 四、启动成功

<img src="https://note.youdao.com/yws/public/resource/0987e4f96f6b436ed52b85016f1c84f8/xmlnote/121EB0D2F0ED4AC5A5FECE0B1DD4EB8B/33970" width="600" height="400">


### 五、Mendix后台环境搭建注意事项

1、端口是否已被占用
    由于在配置文件中配置了docker的8080映射到服务器的80端口，以及8090映射到81端口；所以请确认服务器的这两个端口是否已被占用（如果已经被占用：可修改此处的配置文件）
<img src="https://note.youdao.com/yws/public/resource/0987e4f96f6b436ed52b85016f1c84f8/xmlnote/46ECE91F8DAD400F959D041A280D5BB7/33928" width="600" height="400">

如果修改成其他的端口，请记修改Dockerfile配置文件中的nginx端口：否则程序不会允许
<img src="https://note.youdao.com/yws/public/resource/0987e4f96f6b436ed52b85016f1c84f8/xmlnote/52B4C799667D44EA84BB4842E4C6CE5E/33933" width="600" height="400">

3、登录时为何使用Administor无法登录
    mendix客户端的administor账户是在测试环境使用的；
<img src="https://note.youdao.com/yws/public/resource/0987e4f96f6b436ed52b85016f1c84f8/xmlnote/WEBRESOURCEa576049bb39f79bd36e779c46a55a82c/33994" width="600" height="400">

    如果程序发布到服务器，
    则需要登录的账户为：MxAdmin
    密码为：docker-compose-mysql中的ADMIN_PASSWORD字段
<img src="https://note.youdao.com/yws/public/resource/0987e4f96f6b436ed52b85016f1c84f8/xmlnote/380AC56B7D7D47488CF173C32CA431CE/33943" width="600" height="400">

    4、docker-compose-mysql字段简要介绍
    mendixapp:
        image:为docker镜像；
        ADMIN_PASSWORLD:使用MxAdmin账户登录系统的密码；
        DATABASE_ENDPOINT：应用的数据库地址，最后一个mendix为创建的mendix数据库；
        ports：docker端口和服务器端口的映射关系，如果服务器的端口已被占用，则需要修改映射的端口；
    
    db：
        MYSQL_DATABASE=mendix   //mendix数据库名
        MYSQL_USER：mendix数据库的用户
        MYSQL_PASSWORD：mendix数据库的密码
        MYSQL_ROOT_PASSWORD=root  //数据库最高权限密码（当然账号也为root）
        ports：docker中数据库端口和服务器端口的映射关系。
    
    5、访问地址为何过总是报错502
![](https://note.youdao.com/yws/public/resource/0987e4f96f6b436ed52b85016f1c84f8/xmlnote/30D1D8431E6447B2BA608D3CE0BE892C/33975)
        哪些情况出现502:
访问次数过多；
3个小时左右会自动停止；
        之所以一直报错502的最根本原因是没有向Mendix购买license；没有license 最多只能在线10个用户，且系统每隔3小时左右关闭。所以需要向Mendix购买License。
        停止了，可重启容器
    ![](https://note.youdao.com/yws/public/resource/0987e4f96f6b436ed52b85016f1c84f8/xmlnote/5CB2EA5BE3CF415DA861F22FEE10DC87/35306)
        
        重新部署包，则需要先关闭mysql容器，再使用make run-container。
        
        