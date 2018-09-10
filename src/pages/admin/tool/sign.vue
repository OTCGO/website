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
        this.signStrAfter = await this.$store.dispatch(
          "SIGN_STR",
          this.signStrBefore
        );
      } catch (error) {}
    }
  }
};
</script>