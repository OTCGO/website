<template>
  <o-table :tableHeader="bonusHeader" :dataSource="bonusSource" :buttonStatus="claimStatus"></o-table>
</template>

<script>
import oTable from "~components/common/Table";
import { mapGetters } from "vuex";
import { findBalances } from "~utils/util";
import service from "~api";

const bonusHeader = [
  {
    label: "资产名称",
    width: "25%"
  },
  {
    label: "待提取数量",
    width: "25%"
  },
  {
    label: "可提取数量",
    width: "25%"
  },
  {
    label: "",
    width: "25%"
  }
];

export default {
  // async created() {
  //  await this.getClaim();
  //   // this.claimTimer = setInterval(
  //   //   () => this.$store.dispatch("GET_ASSET").then(() => this.getClaim()),
  //   //   2000
  //   // );
  //   // this.$store.watch(
  //   //   state => state.blockHeight,
  //   //   (newVal, oldVal) => {
  //   //     if (newVal !== oldVal) this.blockChanged = true;
  //   //   }
  //   // );
  // },
  data: () => ({
    bonusHeader,
    bonusSource: [],
    blockChanged: true,
    btnDisable:false
  }),
  components: { oTable },
  computed: {
    ...mapGetters(["balances","blockHeight", "wa"]),
    claimStatus() {
      return this.blockChanged;
    },
    address() {
      return this.wa("address");
    }
  },
  async mounted() {
    try {
      this.loading = true;
      await this.getClaim();
      this.loading = false;

      console.log("seac this.bonusSource", this.bonusSource);
    } catch (error) {
      this.loading = false;
      console.log("error", error);
    }
  },

  methods: {
    async getClaim() {
      // console.log('getClaim',service)
      const bonus = await service.getSeacBonus(this.address);

      this.bonusSource = [
        {
          name: { render: true, value: "SEAC" },
          disable: { render: true, value: bonus.unavailable },
          enable: { render: true, value: bonus.available },
          button: {
            btnClass: "btn-blue",
            value: "一键提取",
            render: true,
            hide: false,
            // disable:false,
            disable: bonus.available === '0' ? true : false,
            event: cb => this.claim(cb)
          }
        }
      ];
    },
    claim(cb) {
      if (this.bonusSource[0].enable.value == 0) {
        return;
      }
      

      this.blockChanged = false;
      cb(false);

      if (this.bonusSource[0].enable.value > 0) {
        console.log('claim')
        this.transfer();
      }
    },
    transfer() {
      this.loading = true;

      const [{ assetId, valid }] = findBalances(this.balances, "de7be47c4c93f1483a0a3fff556a885a68413d97");
      console.log('assetId',assetId)
      console.log('valid',valid)
      this.$store
        .dispatch("TRANSFER", {
          assetId,
          dest:this.address,
          amount: valid > 1 ? 1 : valid
        })
        .then((r) => {
          if (r.hasOwnProperty("result") && r.result) {
              this.$message.success("提取成功,到账需要区块确认，请稍后查看余额");
              this.getClaim()
          }

          this.blockChanged = true
          this.loading = false;
          this.disabled = true;
        })
        .catch(e => {
          this.blockChanged = true
          console.log('e',e)
          this.$message.error("提取失败，请稍后重试");
          this.disabled = true;
        });

        
    }


    // watch: {
    //   balances() {
    //     this.getClaim();
    //   }
    // },
  },
  destroyed() {}
};
</script>

<style lang="css">
</style>
