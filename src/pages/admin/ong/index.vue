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
    label: "不可提取数量",
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
    ...mapGetters(["balances", "blockHeight"]),
    claimStatus() {
      return this.bonusSource[0].enable.value > 0 && this.blockChanged;
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
              value: "提取",
              render: true,
              hide: false,
              event: cb => this.claim(cb)
            }
          }),
        []
      );
    },
    claim(cb) {
      const [{ total }] = findBalances(this.balances, "ontology-ONG");
      if (parseFloat(total) < 0.01) {
        this.$message.error("ontology-ONG 余额不足");
        return;
      }

      cb(false);
      this.blockChanged = false;
      this.$store
        .dispatch("DO_CLAIM_ONG")
        .then(r => {
          if (r.hasOwnProperty("result") && r.result)
            this.$message.success("提取成功");
          if (r.error) this.$message.warning(r.error);
          this.$store.dispatch("GET_ASSET").then(() => this.getClaim());
        })
        .catch(e => {
          this.$message.error(JSON.parse(e.bodyText).error);
        });
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
