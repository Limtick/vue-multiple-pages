# vue-multiple-pages

## Add Project

新增项目,命名规则需按照{ <b>project</b> }字段配置

<b>下方三个目录必须全部配置,且project字段不可存在特殊符号</b>

* src/pages/{<b>project</b>}/{<b>project</b>}_main.js (必须)

* src/pages/{<b>project</b>}{<b>project</b>}.html (必须)

* static/{<b>project</b>}/** (存放对应项目的静态文件，对应项目的目录必须创建, 可为空)

## Notice

* <font color="#f54545" face="黑体">每个项目的所有静态文件都需要放入一个与项目名称相同的项目目录中</font>

* <font color="#f54545" face="黑体">通用静态资源 需要放入{commonSourcePath} 默认为/public 项目名不可与通用资源文件夹名称相同</font>

* <font color="#f54545" face="黑体">目前暂不支持history路由模式</font>

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:{config.dev.port}
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# choose build
# npm run build -- projectA projectB
npm run build -- [projects]

# choose build and view the bundle analyzer report
# npm run build --report -- projectA projectB
npm run build --report -- [projects]

# serve for production
npm run server
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
