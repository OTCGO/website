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
    label: "",
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
    ...mapGetters(["balances", "blockHeight", "wa"]),
    claimStatus() {
      return this.blockChanged;
    }
  },
  methods: {
    getClaim() {
      const anc = findBalances(this.balances, "ontology-ONG");

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
              disable:true,
              event: cb => this.claim(cb)
            }
          }),
        []
      );
    },
    claim(cb) {
      
      if(this.bonusSource[0].disable.value == 0 && this.bonusSource[0].enable.value == 0){
        return
      }

      this.blockChanged = false;
      cb(false);

      if(this.bonusSource[0].disable.value > 0){
         this.claimOngTransfer();
      }


      if(this.bonusSource[0].enable.value > 0){
        const [{ total }] = findBalances(this.balances, "ontology-ONG");
        if (parseFloat(total) < 0.01) {
          this.$message.error("ontology-ONG 余额不足");
          return;
        }

       
        

        
        this.$store
          .dispatch("DO_CLAIM_ONG")
          .then(r => {
            if (r.hasOwnProperty("result") && r.result) {
              this.$message.success("提取成功");
            }

            if (r.error) this.$message.warning(r.error);
            this.$store.dispatch("GET_ASSET").then(() => this.getClaim());
          })
          .catch(e => {
            this.$message.error(JSON.parse(e.bodyText).error);
          });

          
      }

    },
    // watch: {
    //   balances() {
    //     this.getClaim();
    //   }
    // },

    // ont Transfer
    claimOngTransfer() {
      const [{ total }] = findBalances(this.balances, "ontology-ONG");

      console.log("total", total);
      if (parseFloat(total) < 0.01) {
        this.$message.error("ontology-ONG 余额不足");
        return;
      }

      this.loading = true;

      const [{ assetId, valid }] = findBalances(this.balances, "ontology-ONT");

      if(!valid){
        return
      }
      const dest = this.wa("address");

      if (!valid) {
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
          // this.$message.success(
          //   "转账成功！请等待区块确认完毕后领取ontology-ONT！"
          // );
        })
        .catch(e => {
          this.$message.error(e.body.error);
          this.disabled = true;
        });

      this.loading = false;
    }
  },
  destroyed() {
    window.clearInterval(this.claimTimer);
  }
};
</script>

<style lang="css">
</style>
