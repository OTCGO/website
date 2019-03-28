<template>
    <div class="app">
        <top-nav></top-nav>

        <div class="pageDiv container" style="background-color:#fff;">
            <h></h>
            <o-nav></o-nav>

            <transition name="fade" mode="out-in">
                <router-view></router-view>
            </transition>


            <foot></foot>
            <footer class="footer">
                <div class="footer-link">
                    Copyright &copy; 2017 &nbsp;<a href="https://otcgo.cn/">otcgo.cn</a>&nbsp; 版权所有 湘ICP备16019051号-1
                </div>
                <div class="concat-link">
                    <template v-for='item in concats'>
                        <a v-if="item.type!=='wx'" :href="item.link" target="_blank">
                            <img :src="item.src" width="25" height="25" style="margin-left: 15px" :alt="item.desc">
                        </a>
                        <a class="weixin" v-if="item.type==='wx'" href="javascript:;">
                            <img class="weixin-qrcode" width="100" height="100" :src="item.qrCode" alt="蓝鲸淘智能资产管理平台">
                            <img :src="item.src" width="25" height="25" style="margin-left: 15px" :alt="item.desc">
                        </a>
                    </template>
                </div>
                <!--<div>
                  Copyright 2017 <a href="https://otcgo.cn/">otcgo.cn</a> 蓝鲸淘
                </div>-->
            </footer>

        </div>

    </div>
</template>
<script>
    import topNav from '~components/header/topNav';
    import h from './components/header/header.vue';
    import foot from './components/footer/footer.vue';
    import oNav from '~components/header/oNav/oNav.vue'

    export default {
        components: {h, foot, topNav, oNav},
        data () {
            return {
                concats: [
                    {
                        link: 'https://github.com/OTCGO/website',
                        src: require('~images/svgs/Github.svg'),
                        desc: 'Github'
                    }, {
                        link: '//shang.qq.com/wpa/qunwpa?idkey=084887ec4235e85c771e41797f3360ae4be6f50b82d410e5e5d6890e11966d86',
                        src: require('~images/svgs/QQ.svg'),
                        desc: 'QQ'
                    }, {
                        link: '',
                        src: require('~images/svgs/wx.svg'),
                        desc: 'wx',
                        type: 'wx',
                        qrCode: require('~images/wx-QRcode.jpg')
                    }, {
                        link: '//t.me/otcgo',
                        src: require('~images/svgs/Telegram.svg'),
                        desc: 'Telegram'
                    }, {
                        link: 'https://twitter.com/smart_exchangea',
                        src: require('~images/svgs/Twitter.svg'),
                        desc: 'Twitter'
                    }
                ]
            };
        }
    };
</script>

<style>
    /*common css*/
    body {
        font-family: "Microsoft YaHei", serif;
    }

    .container-padding {
        padding: 0 20px 20px !important;
    }

    .error-text {
        color: red;
        margin: 0;
        text-indent: 5px;
    }

    .btn-lj-red {
        background-color: #ff0000;
        color: #fff;
    }

    .btn-lj-red:hover {
        background-color: #ea0303;
        color: #fff !important;
    }

    /*common css*/

    a {
        text-decoration: none;
    }

    a:hover {
        text-decoration: none;
    }

    .pageDiv {
        padding: 0;
    }

    .logo {
        width: 100%;
        margin: 0 auto;
    }

    .logo > img {
        margin: 0 10px 0 50px;
    }

    .navbar {
        background-color: #000 !important;
        border: none !important;
    }

    .nav {
        width: 65%;
    }

    ul > .frist {
        background: url(images/ver-line.png) no-repeat left center;
    }

    ul > li > .menu {
        color: #fff !important;
        font-size: 1.2em;
        background: url(images/ver-line.png) no-repeat right center;
        padding-left: 30px !important;
        padding-right: 30px !important;
    }

    .menu > a {
        color: inherit;
    }

    .search {
        display: inline-block;
    }

    .msg {
        background-color: #f2f2f2;
        margin: 10px auto;
        width: 1200px;
        padding: 10px;
        border-radius: 6px;
    }

    .bg-blue {
        width: 50px;
        height: 50px;
        display: inline-block;
        border-radius: 6px;
        background: #009cff no-repeat center;
    }

    .bg-blue1 {
        background-image: url(images/foot-1.png);
    }

    .bg-blue2 {
        background-image: url(images/foot-2.png);
    }

    .bg-blue3 {
        background-image: url(images/foot-3.png);
    }

    .bg-blue4 {
        background-image: url(images/foot-4.png);
    }

    .foot-li {
        display: inline-block;
        font-family: '黑体';
        padding-left: 12px;
        vertical-align: top;
        padding-top: 4px;
    }

    .bg-li {
        background: url(images/ver-line2.png) right center no-repeat;
    }

    .foot-type {
        font-size: 22px;
        font-weight: 600;
        line-height: 1;
        padding-bottom: 5px
    }

    .foot-des {
        font-size: 20px;
        color: #5f5f5f;
        line-height: 1
    }

    .list-unstyled > li {
        padding-left: 75px;
        text-align: left;
    }

    .text-color {
        color: #666 !important
    }

    .text-color2 {
        color: #9d9d9d !important
    }

    .text-type2 {
        font-family: "黑体", serif;
    }

    .footer-link {
        display: flex;
        align-items: center;
        justify-content: flex-start;
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .2s ease;
    }

    .fade-enter, .fade-leave-active {
        opacity: 0;
    }

    body {
        background-color: #eee;
    }

    .footer {
        padding: 0 30px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 60px;
        line-height: 60px;
        background: black;
        color: #fff;
        border-top: 5px solid #009cff;
    }

    .footer .weixin {
        position: relative;
    }

    .footer .weixin:hover .weixin-qrcode {
        display: block;
    }

    .footer .weixin-qrcode {
        position: absolute;
        bottom: 20px;
        left: -30px;
        display: none;
    }

    /*@media (max-width: 500px) {
        .footer-link{
          display: none
        }
        .footer{
         display: block
        }
    }*/
</style>
