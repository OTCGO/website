import {
  mapGetters
} from 'vuex'
import {
  findBalances
} from '~utils/util'

export default {
  data: () => ({
    onHistory: false,
    onOrder: false,
    onBonus: false,
    loading: false,
    disabled: false,
    onOng: false
  }),

  beforeRouteEnter(to, from, next) {
    next(vm => vm.$store.getters.loggedIn ? next() : next('/login'))
  },

  computed: {
    ...mapGetters(['loggedIn', 'balances', 'wa', 'blockHeight'])
  },

  watch: {
    loggedIn(val) {
      if (!val) this.$router.push('/login')
    }
  },

  methods: {
    handleNav(str) {
      console.log('handleNav', str)

      if (str === 'bonus') {
        this.onBonus = true
        this.onOng = false
      } else if (typeof str === 'string') {
        const arrStr = str.split('')
        const capitalizeStr = arrStr[0].toUpperCase() + str.substr(str.indexOf(arrStr[0]) + 1)
        this['on' + capitalizeStr] = !this['on' + capitalizeStr]
      } else {
        this.loading = this.onBonus = this.onOng = this.onHistory = this.onOrder = false
      }


      if (str === 'ong') {
        this.onOng = true
        this.onBonus = false
      }

      // console.log('this.onBonus ', this.onBonus)
      // console.log('this.onOng ', this.onOng)
    },
    claimTransfer() {

      console.log('claimTransfer')
      
      this.loading = true
      const [{
        assetId,
        valid
      }] = findBalances(this.balances, 'neo')
      const dest = this.wa('address')
      if (!valid) {
        this.loading = false
        return
      }
      this.$store.dispatch('TRANSFER', {
          assetId,
          dest,
          amount: valid
        })
        .then(() => {
          this.loading = false
          this.disabled = true
          this.$message.success('转账成功！请等待区块确认完毕后领取GAS！')
        })
        .catch(e => {
          this.$message.error(e.body.error)
          this.disabled = true
        })

      this.loading = false 
    },

    // ont Transfer
    claimOngTransfer() {

      const [{
        total
      }] = findBalances(this.balances, 'ontology-ONG')

      console.log('total', total)
      if (parseFloat(total) < 0.01) {
        this.$message.error('ontology-ONG 余额不足')
        return
      }

      this.loading = true


      const [{
        assetId,
        valid
      }] = findBalances(this.balances, 'ontology-ONT')
      const dest = this.wa('address')

      if (!valid) {
        return
      }
      this.$store.dispatch('TRANSFER', {
          assetId,
          dest,
          amount: valid
        })
        .then(() => {
          this.loading = false
          this.disabled = true
          this.$message.success('转账成功！请等待区块确认完毕后领取ontology-ONT！')
        })
        .catch(e => {
          this.$message.error(e.body.error)
          this.disabled = true
        })

      this.loading = false
    }


  },

  mounted() {
    if (!this.loggedIn) {
      this.$router.push('/login')
    } else {
      this.$store.watch(
        ({
          blockHeight
        }) => blockHeight,
        () => {
          this.disabled = false
        }
      )
    }
  }
}