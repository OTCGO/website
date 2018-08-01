<template>
  <o-table
      :tableHeader="bonusHeader"
      :dataSource="bonusSource"
      :buttonStatus="claimStatus"
  ></o-table>
</template>

<script>
import oTable from "~components/common/Table";
import { mapGetters } from "vuex";
import { findBalances } from "~utils/util";



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
    label: "操作",
    width: "25%"
  }
];

export default {
  created() {
    this.getClaim();

    this.claimTimer = setInterval(
      () => this.$store.dispatch("GET_ASSET").then(() => this.getClaim()),
      2000
    );

    this.$store.watch(
      state => state.blockHeight,
      (newVal, oldVal) => {
        if (newVal !== oldVal) this.blockChanged = true;
      }
    );
  },
  data: () => ({
    bonusHeader,
    bonusSource: [],
    blockChanged: true
  }),
  components: { oTable },
  computed: {
    ...mapGetters(["balances", "blockHeight",'wa']),
    claimStatus() {
      // return true;
      // return this.bonusSource[0].enable.value > 0 && this.blockChanged;

      return this.blockChanged;
    }
  },
  methods: {
    getClaim() {
      const anc = findBalances(this.balances, "gas");


      this.bonusSource = anc.reduce(
        (arr, item) =>
          arr.concat({
            name: { render: true, value: item.name },
            disable: { render: true, value: item.disable },
            enable: { render: true, value: item.enable },
            button: {
              btnClass: "btn-blue",
              value: "一键提取",
              render: true,
              hide: false,
              event: cb => this.claim(cb)
            }
          }),
        []
      );
    },
    claim(cb) {
      console.log("this.bonusSource[0].enable",this.bonusSource[0].enable.value);
       console.log("this.bonusSource[0].disable",this.bonusSource[0].disable.value);

      // tran

      if(this.bonusSource[0].disable.value == 0 && this.bonusSource[0].enable.value == 0){
        return
      }

              // gas 
      cb(false);
      this.blockChanged = false;

      if(this.bonusSource[0].disable.value > 0){
          this.claimTransfer()
      }
     


      if(this.bonusSource[0].enable.value > 0){
        this.$store
          .dispatch("DO_CLAIM")
          .then(r => {
            if (r.hasOwnProperty("result") && r.result)
              this.$message.success("提取成功");
            if (r.error) this.$message.warning(r.error);
            this.$store.dispatch("GET_ASSET").then(() => this.getClaim());
          })
          .catch(e => {
            this.$message.error(JSON.parse(e.bodyText).error);
          });
      }

    },

    claimTransfer() {
      console.log("claimTransfer");

      this.loading = true;
      const [{ assetId, valid }] = findBalances(this.balances, "neo");

      if(valid < 0){
        return
      }


      const dest = this.wa("address");
      if (!valid) {
        this.loading = false;
        return;
      }
      this.$store
        .dispatch("TRANSFER", {
          assetId,
          dest,
          amount: valid
        })
        .then(() => {
          this.loading = false;
          this.disabled = true;
          // this.$message.success("转账成功！请等待区块确认完毕后领取GAS！");
        })
        .catch(e => {
          this.$message.error(e.body.error);
          this.disabled = true;
        });

      this.loading = false;
    },
    watch: {
      balances() {
        this.getClaim();
      }
    }
  },
  destroyed() {
    window.clearInterval(this.claimTimer);
  }
};
</script>

<style lang="css">
</style>
