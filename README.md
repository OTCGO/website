## update

#### 2018-09-11
* 添加工具签名

#### 2018-07-31
* 添加一键提取
* 优化ong|ont转账

#### 2018-07-10
* 添加ont 主网映射

#### 2018-07-02
* 修复ios 视频教程无法点击问题

#### 2018-06-28
* 添加Nep2登陆

#### 2018-06-20
* 修复打开wif，nep2

#### 2018-06-20
* 添加个人中心打开wif，输入密码。



# 蓝鲸淘前端部分

蓝鲸淘是一个基于[NEO区块链](http://neo.org)的智能资产管理平台。
![Screenshot](https://raw.githubusercontent.com/AmagiDDmxh/otcgo/master/doc/Home.png)

## 源代码
源代码地址：👉 https://github.com/OTCGO/website

欢迎大家star和fork😄

## 预览
在线预览地址：👉 http://future.otcgo.cn

## 技术栈
* **Vue2.0**：前端页面展示。
* **vue-router**：页面路由跳转
* **vue-resource**：一个基于 `Promise` 的 HTTP 库，向后端发起请求。
* **ES6**、**ES7**：采用ES6语法。箭头函数、Promise等等语法。
* **Webpack**：vue-cli自带Webpack，但是需要自己改造一下，比如要对需要安装sass相关loader，vue-cli已经配置好了webpack，你只需要安装依赖就可以，使用的时候只需要`<style lang="scss"></style>`。

## 即将到来的改变
* **功能**：双边交易，联系人，强密码适配
* **技术栈**：将添加Vuex, 使用Pug、Stylus，api重构， 替换resource为axios...等等


## 时间轨迹
* **4.17前**: :innocent: 作者失去意识，忘掉了过去。。
* **4.17**：添加转账历史记录、集市功能，改进交易数据。
* **4.28**：添加交易历史记录、添加首页内容跳转、暂时禁用交易功能！
* **4.29**：更改登陆模块，准备开始大型重构!:fire::fire:
* **5.01**：功能到位，准备上船。
* **5.06**：登陆及创建钱包功能加强

## Todo
* **性能优化**：处理ajax时单纯用的是同步事件，调整为异步队列
* **CSS**：css的整体重构优化与加强

## About
源代码地址：👉 [GitHub](https://github.com/OTCGO/website)

白皮书： [中文]() -**等待更新**



neo新人交流群：529334803

技术交流群：192911607

## Contribution
非常欢迎贡献者。
最简单的贡献方式，就是参与讨论，并向我们提出产品的改进意见。此外，我们也非常欢迎测试和提交BUG。

``` bash
# clone the project
git clone https://github.com/OTCGO/website.git

# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For detailed explanation on how things work, consult the [docs for vue-loader](http://vuejs.github.io/vue-loader).



