<template lang="pug">
  table.table.data-table.table-bordered.table-striped
    thead
      th 资产名称
      th 买入单价ANS
      th 总计ANS
      th(style={ width: '260px' })
    tbody
      tr(v-for="item in orders")
        td {{ item.name }}
        td {{ item.price }}
        td {{ item.amount }}
        td.td-btn
          el-button.btn.ljbutton(:loading="item.loading", v-if="!item.redeem", @click="redeem(item)")  取回
</template>

<script>
  export default {

    data: () => ({ orders: [] }),

    methods: {
      getOrders() {
        return this.$store.dispatch('GET_HISTORY', { name: 'ico' })
                   .then(orders => this.orders = orders['data'].map(i => { i.loading = false; return i }))
                   .catch(e => this.$message.error('获取订单失败！请稍后再试！'))
      },

      async redeem(item) {
        await this.stopFetch()
        this.$set(item, 'loading', true)
        try {
          const res = await this.$store.dispatch('REDEEM', item)
          if (res) {
            this.startFetch()
            this.$message.success('取回成功！')
          }
          this.$set(item, 'loading', false)
        } catch(err) {
          this.startFetch()
          this.$message.error(JSON.parse(err.bodyText).error)
        }
      },

      startFetch() {
        this.getOrders()
        this.orderTimer = window.setInterval(() => this.getOrders(), 1000 * 2)
      },

      stopFetch() {
        clearInterval(this.orderTimer)
      }
    },

    mounted() {
      this.startFetch()
    },

    destroyed() {
      this.stopFetch()
    }

  }
</script>
