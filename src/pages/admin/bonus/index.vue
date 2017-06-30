<template>
  <div>
    <table-container
        :tableHeader="header"
        :dataSource="source"
    >

    </table-container>
  </div>
</template>

<script>
  import tableContainer from '~components/common/Table'
  import { mapGetters } from 'vuex'
  import { findBalances } from '~utils/util'

  const header = [
    { label: '类型' },
    { label: '委托价格' },
    { label: '委托数量' },
    { label: '操作' }
  ]

  export default {
    created() {
      this.source = findBalances(this.balances, 'anc')[0]
    },

    data: () => ({
      header,
      source: []
    }),

    computed: mapGetters(['balances']),

    components: { tableContainer }
  }
</script>

<style lang="css">


</style>
