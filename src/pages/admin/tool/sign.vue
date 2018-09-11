<template src="./sign.html"></template>
<style lang="stylus" src="./sign.styl"></style>

<script>
import { signatureData as ljSign } from "~libs/wallet";

export default {
  data() {
    return {
      signStrBefore: "",
      signStrAfter: ""
    };
  },
  methods: {
    async signStr() {
      try {
        console.log("sign");
        /*  
            1 长度为偶数
            2 只能含有0-9 a-f 
        */
        if (this.signStrBefore.length % 2 != 0) {
          console.log("length");  
          this.$message.error("非法字符!");
          return;
        }

        const pattern = /[a-f0-9]/i;
        if (!pattern.test(this.signStrBefore)) {
          this.$message.error("非法字符!");
          return;
        }

        this.signStrAfter = await this.$store.dispatch(
          "SIGN_STR",
          this.signStrBefore
        );
      } catch (error) {}
    }
  }
};
</script>