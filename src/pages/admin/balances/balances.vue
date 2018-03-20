<template src="./balances.html"></template>
<style lang="stylus" src="./balances.styl"></style>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import transferModal from '~components/admin/transferModal.vue'
  import askModal from '~components/admin/askModal'

  export default {
    components: { transferModal, askModal },
    data: () => ({
      // dialog
      dialogPay: false,
      dialogDisPay: false,
      transferModal: false,
      askModal: false,
      // btnText:'隐藏余额为0的资产',
      isDisplay:true
    }),

    computed: {
      ...mapGetters(['balances'])
    },

    methods: {
      transfer({ name }) {
        this.$store.commit('SET_DELIVER', name)
        this.transferModal = true

        var ua = navigator.userAgent,
        iOS = /iPad|iPhone|iPod/.test(ua),
        iOS11 = /OS 11_0_1|OS 11_0_2|OS 11_0_3|OS 11_1|OS 11_1_1|OS 11_1_2|OS 11_2|OS 11_2_1/.test(ua);
        //.style.position = 'fixed';
        //document.getElementsByClassName('tiny-dialog')[0].style.position = 'fixed';
        console.log('iOS11',iOS11)
        if (iOS && iOS11) {
            //document.body.style.position = 'fixed';
            document.body.style.overflow = 'hidden';
            document.getElementsByClassName('tiny-dialog')[0].style.position = 'absolute';
       }

      },
      transferSuccess() {
        this.transferModal = false
      },
      // 显示和隐藏按钮
      switchAsset() {
        this.isDisplay = ! this.isDisplay
        console.log('switchAsset')
      },
      ask({ name }, receiverName) {
        this.$store.commit('SET_DELIVER', name)
        this.$store.commit('SET_RECEIVE', receiverName)
        this.askModal = true
      },
      askSuccess() {
        this.askModal = false
      },
      ...mapActions({
        getAsset: 'GET_ASSET',
        getUID: 'GET_UID'
      }),
    },

    created() {
      this.getAsset()
      this.balancesTimer = window.setInterval(() => this.getAsset(), 1000 * 2)
      this.getUID()
    },

    destroyed() {
      window.clearInterval(this.balancesTimer)
    }
  }
</script>
