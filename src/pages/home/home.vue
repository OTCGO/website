<template lang="pug">
    .page-index
        .index
            el-carousel(:interval="5000")
                el-carousel-item(v-for="banner in banners")
                    a.test(v-bind:href="banner.route.path",target="_blank")
                        img.test-img(:src="banner.src", :alt="banner.dec")
            o-content

            //- el-dialog(visible=true,title="提示",:visible.sync="dialogVisible",center)
            //-     span SEA网页钱包升级中，转账功能暂不可用，需要进行转账操作请复制NEP2至移动端钱包进行转账操作，造成不便，请谅解。
                    


</template>

<script>
import oContent from "../../components/common/oContent/index.vue";

export default {
  components: { oContent },

  data: () => ({
    banners: [
      {
        src: require("~images/banner1.jpg"),
        preview: require("~images/banner1.jpg"),
        dec: "",
        route: {
          path: "/"
        }
      },
      /*{
                  src: require("~images/app-download.jpg"),
                  preview: require("~images/app-download.jpg"),
                  dec: "sea app download",
                  route: {
                    path: "//otcgo.cn/download/"
                  }
                }*/
      {
        src: require("~images/banner_2.jpg"),
        preview: require("~images/banner_2.jpg"),
        dec: "",
        route: {
          path: "/"
        }
      },{
        src: require("~images/banner_3.jpg"),
        preview: require("~images/banner_3.jpg"),
        dec: "",
        route: {
          path: "/"
        }
      }
    ],
    loading: false,
    dialogVisible: true
  })
};
</script>

<style lang="stylus">
.el-table__body {
  text-align: center;
}

.el-table__header .is-leaf {
  text-align: center;
}
.el-carousel__container{
    height:400px
}
    @media (max-device-width:576px){
        .el-carousel__container{
            height:320px !important
        }
    }
@media (max-width: 500px) {
  .el-carousel {
    display: none;
  }

  form.navbar-right {
    display: none;
  }

  .el-carousel__item img {
    width: 100%;
    height: 400px;
  }

  .el-carousel__container > button {
    display: none;
  }

  /* .carousel-control
                background: #8e8e8e;
                height: 100px;
                line-height: 100px;
                font-size: 50px !important;
                width: 51px !important;
                margin-top: 140px;
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0);
                background-image: none;
  
              .carousel-inner img
                width: 100%;
                height: 400px; */
}
    .test{
        width:100%;
        height:100%;
        .test-img{
            width:100%;
            height:100%
        }
    }
</style>
