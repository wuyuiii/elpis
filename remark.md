# 面向中后台的企业级全栈开发框架 -- elpis

**暂时完成的内容**

1. 整体项目目录构建
2. 后端核心模块搭建（内核引擎）
3. 后端基础模块配置
4. 前端工程化基础搭建
5. 前端基础功能搭建

**后续要完成的内容**

1. 领域模型的设计实现
2. 动态组件的搭建
3. 持续集成/持续部署 （CI/CD）
4. 实现具体业务，构建真实业务项目



# 1. 整体项目目录构建

项目核心目录按照以下示例区分

```js
app // 核心应用目录，里面存放着框架具体实现的内容，也是elpis-core的核心实现（约定式）
 | controller // 框架控制层目录；-- 和elpis-core约定必须存在的目录
 | service // 框架接口服务层目录；-- 和elpis-core约定必须存在的目录
 | extend // 框架功能拓展目录；-- 和elpis-core约定必须存在的目录
 | middleware // 框架中间件目录；-- 和elpis-core约定必须存在的目录
 | pages // 框架前端页面目录，里面包含多个子目录，每个目录都是一个完整的应用
 | router // 框架路由目录，负责分发路由，例如API接口定义、页面请求；-- 和elpis-core约定必须存在的目录
 | router-schema // 框架路由请求规范目录，负责定义API路由请求时的参数校验；-- 和elpis-core约定必须存在的目录
 | view // 前端渲染模板目录
 | middleware.js // 框架全局中间件
config // 项目整体配置文件目录 -- 和elpis-core约定必须存在的目录
elpis-core // 框架核心目录
 | loader // loader目录，加载app中约定好的内容，controller、service、middleware等等
 | env.js // 环境变量文件
 | index.js // elpis-core核心入口文件
index.js // 框架入口文件，负责调用elpis-core启动基础服务
```



# 2. 后端核心框架搭建（内核引擎）elpis-core

> 做了什么，用来干嘛的？怎么做的？为什么要这样做？

仿照Egg.js的思想搭建了整体项目的服务端核心，具有7个loader加载器（controller、service、middleware、router、router-schema、config、extend），负责加载app目录中约定好的结构，例如 app/controller等。

在`elpis-core/env.js`初始化环境获取方法，在项目启动时挂载到 **app.env** 对象上，使用process.env._ENV获取对应环境，具体\_ENV在启动项目时的脚本中赋予环境值，例如

```json
"scripts": {
		"dev": "cross-env _ENV=local nodemon index.js",
	},
```



在`elpis-core/loader`目录下，定义了7个核心loader，用于扫描、转换、挂载框架对应目录的文件，每个loader对应挂载到 **app.loader.框架自定义loader**，例如：app.controller.customController。每个loader都使用globSync扫描框架对应模块目录下的文件，然后解析文件路径获取文件名，并将文件名转换成驼峰命名，挂载到对应的loader对象上。核心7个loader划分如下：

1. controller loader：框架控制层loader，负责扫描`app/controller`目录
2. service loader：框架服务层loader，负责扫描`app/service`目录
3. extend loader：框架拓展功能loader，负责扫描`app/extend`目录
4. router loader：框架请求路由loader，负责扫描`app/router`目录
5. router-schema loader：框架请求参数schema loader，负责扫描`app/router-schema`目录
6. middleware loader：框架中间件loader，负责扫描`app/middleware`目录
7. config loader：框架核心配置loader，负责扫描`config`目录

内核使用Koa搭建，在`elpis-core/index.js`暴露核心启动方法`start`，供框架入口使用，在启动方法`start`中加载约定式的loader，加载框架对应的模块。



