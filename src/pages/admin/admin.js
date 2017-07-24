import { mapGetters } from 'vuex'
import { findBalances } from '~utils/util'

export default {
  data: () => ({
    onHistory: false,
    onOrder: false,
    onBonus: false,
    loading: false,
    disabled: false
  }),

  beforeRouteEnter (to, from, next) {
    next(vm => vm.$store.getters.loggedIn ? next() : next('/login'))
  },

  computed: {
    ...mapGetters(['loggedIn', 'balances', 'wa', 'blockHeight'])
  },

  watch: {
    loggedIn (val) {
      if (!val) this.$router.push('/login')
    }
  },

  methods: {
    handleNav (str) {
      if (str === 'bonus') this.onBonus = true
      else if (typeof str === 'string') {
        const arrStr = str.split('')
        const capitalizeStr = arrStr[0].toUpperCase() + str.substr(str.indexOf(arrStr[0]) + 1)
        this['on' + capitalizeStr] = !this['on' + capitalizeStr]
      } else {
        this.loading = this.onBonus = this.onHistory = this.onOrder = false
      }
    },
    claimTransfer () {
      this.loading = true
      const [{ assetId, valid }] = findBalances(this.balances, 'ans')
      const dest = this.wa('address')
      this.$store.dispatch('TRANSFER', { assetId, dest, amount: valid })
          .then(() => {
            this.loading = false
            this.disabled = true
            this.$message.success('转账成功！')
          })
          .catch(e => {
            this.$message.error(e.body.error)
            this.disabled = true
          })
    }
  },

  mounted () {
    if (!this.loggedIn) {
      this.$router.push('/login')
    } else {
      this.$store.watch(
          ({ blockHeight }) => blockHeight,
          () => { this.disabled = false }
      )
    }
  }
}
