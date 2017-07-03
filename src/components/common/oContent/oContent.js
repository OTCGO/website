export default {
  data () {
    return {
      firstButton: ['oContent__tab', 'btn', { 'oContent__tab--active': true }],
      secondButton: ['oContent__on-tab', 'btn', { 'oContent__on-tab--active': false }],
      contentOne: true,
      contentTwo: false,
      // price
      anccny: 0,
      anscny: 0,
      kacans: 0,

      // Rate
      anccnyRate: 0,
      anscnyRate: 0,
      kacansRate: 0,

      // Volumn
      anccnyVolumn: 0,
      anscnyVolumn: 0,
      kacansVolumn: 0
    }
  },
  methods: {
    switchOne (e) {
      e.target.classList.add('oContent__tab--active')
      if (e.target.previousSibling) {
        e.target.previousSibling.classList.remove('oContent__tab--active')
      }
      if (e.target.nextSibling) {
        e.target.nextSibling.classList.remove('oContent__on-tab--active')
      }
      this.contentOne = true
      this.contentTwo = false
    },
    switchTwo (e) {
      e.target.classList.add('oContent__on-tab--active')
      if (e.target.previousSibling) {
        e.target.previousSibling.classList.remove('oContent__tab--active')
      }
      if (e.target.nextSibling) {
        e.target.nextSibling.classList.remove('oContent__on-tab--active')
      }
      this.contentOne = false
      this.contentTwo = true
    },

    getData() {
      this.getPrice()
      this.getRateAndVolumn()
    },

    async getPrice () {
      this.kacans = (await this.$http.get(`price/kacans`)).body
      this.anccny = ((await this.$http.get(`price/anccny`)).body) || 0
      this.anscny = ((await this.$http.get(`price/anscny`)).body) || 0
    },

    // 24H涨跌幅 && 成交量
    async getRateAndVolumn () {
      let anccnyResult = (await this.$http.get(`markets/anccny`)).body
      this.anccnyRate = anccnyResult.rate + '%'
      this.anccnyVolumn = anccnyResult.volumnOfLast24Hours

      let anscnyResult = (await this.$http.get(`markets/anscny`)).body
      this.anscnyRate = anscnyResult.rate + '%'
      this.anscnyVolumn = anscnyResult.volumnOfLast24Hours

      let kacansResult = (await this.$http.get(`markets/kacans`)).body
      this.kacansRate = kacansResult.rate + '%'
      this.kacansVolumn = kacansResult.volumnOfLast24Hours
    },

    toMarkets () {
      this.$router.push({path: '/markets', query: { class: 'kacans' }})
    }
  },
  mounted () {
    this.getData()

    this.priceTimer = setInterval(() => this.getData(), 2000)
  },
  destroyed() {
    clearInterval(this.priceTimer)
  }

}
