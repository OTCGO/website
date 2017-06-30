<template>
  <o-table
      :tableHeader="bonusHeader"
      :dataSource="bonusSource"
      :buttonStatus="claimStatus"
  ></o-table>
</template>

<script>
  import oTable from '~components/common/Table'
  import { mapGetters } from 'vuex'
  import { findBalances } from '~utils/util'

  const bonusHeader = [{
    label: '资产名称',
    width: '25%'
  }, {
    label: '不可提取数量',
    width: '25%'
  }, {
    label: '可提取数量',
    width: '25%'
  }, {
    label: '',
    width: '25%'
  }]

  export default {
    created() {
      const anc = findBalances(this.balances, 'anc')
      console.log(anc)

      this.bonusSource = anc.reduce((arr, item) => arr.concat({
        name: {
          render: true,
          value: item.name
        },
        disable: {
          render: true,
          value: item.disable
        },
        enable: {
          render: true,
          value: item.enable
        },
        button: {
          btnClass: 'btn-blue',
          value: '提取',
          render: true,
          hide: item.enable <= 0,
          event: cb => {
            this.claim(cb)
          }
        }
      }), [])
    },
    data: () => ({
      bonusHeader,
      bonusSource: [],
      claimStatus: true
    }),
    components: { oTable },
    computed: {
      ...mapGetters(['balances'])
    },
    methods: {
      claim(cb) {
        this.$store.dispatch('CLAIM')
            .then()
        cb(true)
      }
    }
  }
</script>

<style lang="css">


</style>
