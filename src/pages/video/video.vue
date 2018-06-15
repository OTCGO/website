<template>

       <div class="player" style="margin:10px 0">
          <video-player  class="vjs-custom-skin"
                         ref="videoPlayer"
                         :options="playerOptions"
                        >
          </video-player>
        </div>
</template>

<script>
    import 'vue-video-player/src/custom-theme.css'

    import 'video.js/dist/video-js.css'

    import { videoPlayer } from 'vue-video-player'

  export default {
    components: {
        videoPlayer
    },

   // this.$route.query
    data: () => ({
        // v_url:'http://paclsxg3t.bkt.clouddn.com/SEA%28%E8%93%9D%E9%B2%B8%E6%B7%98%29%E7%BD%91%E9%A1%B5%E9%92%B1%E5%8C%85%E4%BD%BF%E7%94%A8%E6%95%99%E7%A8%8B.mp4',
        // playerOptions:{
        //     height: '500',
        //     autoplay: true,
        // }
        playerOptions: {
          height: '500',
          autoplay: false,
          muted: false,
          language: 'en',
          playbackRates: [0.7, 1.0, 1.5, 2.0],
          sources: [{
            type: "video/mp4",
            // mp4
            //src: 'http://paclsxg3t.bkt.clouddn.com/SEA%28%E8%93%9D%E9%B2%B8%E6%B7%98%29%E7%BD%91%E9%A1%B5%E9%92%B1%E5%8C%85%E4%BD%BF%E7%94%A8%E6%95%99%E7%A8%8B.mp4',
            src:''
          }],
          poster: "",
        }
      
    }),
    watch: {
      '$route' (to, from) {
        if (to.path === '/video'){
            console.log('to',to)
            // this.watchChange(to)
            window.location.reload()
        }
          
        
      },

    },
    mounted(){
        const type = this.$route.query.name
        console.log('mounted',type)
        switch(type){
            case 'web': this.playerOptions.sources[0].src = 'http://paclsxg3t.bkt.clouddn.com/SEA%28%E8%93%9D%E9%B2%B8%E6%B7%98%29%E7%BD%91%E9%A1%B5%E9%92%B1%E5%8C%85%E4%BD%BF%E7%94%A8%E6%95%99%E7%A8%8B.mp4'
                break;
            case 'app': this.playerOptions.sources[0].src   = 'http://paclsxg3t.bkt.clouddn.com/SEA%20app%E9%92%B1%E5%8C%85%E4%BD%BF%E7%94%A8%E6%95%99%E7%A8%8B.MOV'
        }
       
    }
  }
</script>


<style lang="stylus">

</style>
