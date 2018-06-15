<template>
  <div class="video">
        <video id="my-video" class="video-js vjs-big-play-centered" controls preload="auto" width="1000" height="500"
                        poster="" data-setup="{}">
   
        <source :src="v_url">
    <p class="vjs-no-js">
      To view this video please enable JavaScript, and consider upgrading to a web browser that
      <a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a>
    </p>
  </video>
  </div>
</template>

<script>
  export default {
   // this.$route.query
    data: () => ({
        v_url:'http://paclsxg3t.bkt.clouddn.com/SEA%28%E8%93%9D%E9%B2%B8%E6%B7%98%29%E7%BD%91%E9%A1%B5%E9%92%B1%E5%8C%85%E4%BD%BF%E7%94%A8%E6%95%99%E7%A8%8B.mp4'
    }),
    mounted(){
        const type = this.$route.query.name
        console.log('mounted',type)
        switch(type){
            case 'web': this.v_url = 'http://paclsxg3t.bkt.clouddn.com/SEA%28%E8%93%9D%E9%B2%B8%E6%B7%98%29%E7%BD%91%E9%A1%B5%E9%92%B1%E5%8C%85%E4%BD%BF%E7%94%A8%E6%95%99%E7%A8%8B.mp4'
                break;
            case 'app': this.v_url = 'http://paclsxg3t.bkt.clouddn.com/SEA%28%E8%93%9D%E9%B2%B8%E6%B7%98%29%E7%BD%91%E9%A1%B5%E9%92%B1%E5%8C%85%E4%BD%BF%E7%94%A8%E6%95%99%E7%A8%8B.mp4'
        }
    }
  }
</script>

<style lang="stylus">
    #my-video
        margin : 10px auto
</style>
