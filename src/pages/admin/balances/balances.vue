<template src="./balances.html"></template>
<style lang="stylus" src="./balances.styl"></style>

<script>
import { mapActions, mapGetters } from "vuex";
import transferModal from "~components/admin/transferModal.vue";
import mapModal from "~components/admin/mapModal.vue";
import askModal from "~components/admin/askModal";
import { swapSEA, broadcastSEA } from "~api";

export default {
  components: { transferModal, askModal, mapModal },
  data: () => ({
    // dialog
    dialogPay: false,
    dialogDisPay: false,
    transferModal: false,
    mapModal: false,
    askModal: false,
    // btnText:'隐藏余额为0的资产',
    isDisplay: true
    // transferType: 1, // 1 交易 2 映射
  }),

  computed: {
    ...mapGetters(["wa", "balances"])
    // address() {
    // this.privateKeyEncrypted = this.wa("privateKeyEncrypted");
    // this.publicKey = this.wa("publicKeyCompressed");
    // //this.w_wif = this.wa('wif')
    // // console.log('this.privateKeyEncrypted',this.privateKeyEncrypted)
    //return this.wa("address");
    //   },
  },

  methods: {
    transfer({ name }, type) {
      this.$store.commit("SET_DELIVER", name);

      if (type === 1) {
        this.transferModal = true;
      }

      if (type === 2) {
        this.mapModal = true;
      }

      var ua = navigator.userAgent,
        iOS = /iPad|iPhone|iPod/.test(ua),
        iOS11 = /OS 11_0_1|OS 11_0_2|OS 11_0_3|OS 11_1|OS 11_1_1|OS 11_1_2|OS 11_2|OS 11_2_1/.test(
          ua
        );
      //.style.position = 'fixed';
      //document.getElementsByClassName('tiny-dialog')[0].style.position = 'fixed';
      console.log("iOS11", iOS11);
      if (iOS && iOS11) {
        //document.body.style.position = 'fixed';
        document.body.style.overflow = "hidden";
        document.getElementsByClassName("tiny-dialog")[0].style.position =
          "absolute";
      }
    },

    // 申一股，申一币置换
    async switchSEA({ assetId }) {
      try {
        // console.log("switch_publicKey", this.wa("publicKeyCompressed"));
        const { transaction,result } = await swapSEA(`${this.wa("address")}_${assetId}`);

        if(!transaction){
          return this.$message.success("置换失败，请稍后再试！");
        }

        console.log("switch,transaction", transaction);
        if(result){
          const result = await broadcastSEA(this.wa("publicKeyCompressed"),this.wa("privateKey"),transaction)
          console.log("switch,broadcastSEA", result);
          if(result){
           return this.$message.success("置换成功，请等待1-2区块后查看资产！");
          }
          
          return this.$message.success("置换失败，请稍后再试！");
        }

        return this.$message.success("置换失败，请稍后再试！");
        
      } catch (error) {
        console.log("switch", error);
        return this.$message.success("置换失败，请稍后再试！");
      }
    },

    transferSuccess() {
      this.transferModal = false;
    },
    // map
    mapSuccess() {
      this.transferModal = false;
    },
    // 显示和隐藏按钮
    switchAsset() {
      this.isDisplay = !this.isDisplay;
      console.log("switchAsset");
    },
    ask({ name }, receiverName) {
      this.$store.commit("SET_DELIVER", name);
      this.$store.commit("SET_RECEIVE", receiverName);
      this.askModal = true;
    },
    askSuccess() {
      this.askModal = false;
    },
    ...mapActions({
      getAsset: "GET_ASSET",
      getUID: "GET_UID"
    })
  },

  created() {
    this.getAsset();
    this.balancesTimer = window.setInterval(() => this.getAsset(), 1000 * 2);
    this.getUID();
  },

  destroyed() {
    window.clearInterval(this.balancesTimer);
  }
};
</script>
