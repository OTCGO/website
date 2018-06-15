<style lang="stylus" src="./oNav.styl" scoped></style>

<template>
  <div>
    <nav class="navbar" role="navigation">
      <!-- Collect the nav links, forms, and other content for toggling -->
      <ul class="nav navbar-nav">
        <li class="first">
          <!-- <a class="menu">
            交易对
            <ul class="menulist">
              <router-link
                  v-for="item in marketLists"
                  class="text-center pointer"
                  :to="item.link"
                  tag="li"
                  v-text="item.name"
              ></router-link>
            </ul>
          </a> -->
          <a href="//otcgo.cn/download/" target="_blank" class="menu">APP下载</a>
        </li>
  
        <li>
          <router-link class="menu" to="/"> 首 &nbsp; 页 </router-link>
        </li>

        <li class="first">
           <a class="menu">
            视频教程
            <ul class="menulist">
              <router-link
                  v-for="item in videoLists"
                  v-bind:key="item.name"
                  class="text-center pointer"
                  :to="item.link"
                  tag="li"
                  v-text="item.name"
              ></router-link>
            </ul>
          </a> 
        </li>
        <!--<li>
          <router-link class="menu" to="/ico/status">ICO专区</router-link>
        </li>-->
        <li>
          <a class="menu" href="//shang.qq.com/wpa/qunwpa?idkey=1c63793c5fc8adaf4d6c5c9ee782c1ce8fb14dee9494d69a7372efc5415988d6" target="_blank" title="蓝鲸淘第五社群">加入社群</a>
         </li>
      </ul>

      <form class="col-sm-12 navbar-form navbar-right" style="margin-right: 20px;">
        <div class="form-group">
          <input type="text" class="form-control" placeholder="资产关键词搜索暂未开放" disabled>
        </div>
        <button type="submit" class="btn btn-default" @click.prevent="" disabled>搜索</button>
      </form>

    </nav>

    <el-row class="tac">
      <el-col :span="24">
        <el-menu default-active="2" class="el-menu-vertical-demo">
          <el-submenu index="1">
            <template slot="title">蓝鲸淘</template>

            <el-menu-item index="1-4-1">
              <a class="menu"  href="//otcgo.cn/download/" > APP下载 </a>
            </el-menu-item>

            <!-- <el-menu-item-group>
              <template slot="title">交易对</template>
              <el-menu-item index="1-4-1">
                <router-link class="text-center pointer" :to="{path: '/markets',
                          query: { 'class': 'neocny' }}" tag="li">小蚁股-人民币
                </router-link>
              </el-menu-item>
              <el-menu-item index="1-4-1">
                <router-link class="text-center pointer" :to="{path: '/markets',
                          query: { 'class': 'gascny' }}" tag="li">小蚁币-人民币
                </router-link>
              </el-menu-item>
              <el-menu-item index="1-4-1">
                <router-link class="text-center pointer" :to="{path: '/markets',
                            query: { 'class': 'kacneo' }}" tag="li">开拍币-小蚁股
                </router-link>
              </el-menu-item>
              <el-menu-item index="1-4-1">
                <router-link class="text-center pointer" :to="{path: '/markets',
                          query: { 'class': 'lzglzj' }}" tag="li">量子股份-量子积分
                </router-link>
              </el-menu-item>
            </el-menu-item-group> -->
  
            <el-menu-item index="1-4-1">
              <router-link class="menu" to="/"> 首 &nbsp; 页 </router-link>
            </el-menu-item>

            <el-menu-item-group>
              <template slot="title">视频教程</template>
              <el-menu-item index="1-4-1">
                <router-link class="text-center pointer" :to="{path: '/video',
                          query: { 'name': 'web' }}" tag="li">网页钱包
                </router-link>
              </el-menu-item>
              <el-menu-item index="1-4-1">
                <router-link class="text-center pointer" :to="{path: '/video',
                          query: { 'name': 'app' }}" tag="li">APP钱包
                </router-link>
              </el-menu-item>
            </el-menu-item-group> 
            <!--<el-menu-item index="1-4-1">
              <router-link class="menu" to="/ico/status">ICO专区</router-link>
            </el-menu-item>-->
          </el-submenu>
        </el-menu>
      </el-col>

    </el-row>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        marketLists: [
          {
            link: {
              path: '/markets',
              query: { 'class': 'kacneo' },
              render: true
            },
            name: '开拍币-NEO'
          },
          {
            link: {
              path: '/markets',
              query: { 'class': 'lzglzj' },
              render: true
            },
            name: '量子股份-量子积分'
          }
        ],
         videoLists: [
          {
            link: {
              path: '/video',
              query: { 'name': 'web' },
              // render: true
            },
            name: '网页钱包'
          },
          {
            link: {
              path: '/video',
              query: { 'name': 'app' },
              // render: true
            },
            name: 'APP钱包'
          }
        ]
      }
    }
  }

  /*          {
   link: {
   path: '/markets', query: { 'class': 'anscny' }
   },
   name: '小蚁股-人民币'
   },
   {
   link: {
   path: '/markets', query: { 'class': 'anccny' }
   },
   name: '小蚁币-人民币'
   },*/
</script>
