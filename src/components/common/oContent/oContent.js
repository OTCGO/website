export default {
  data () {
    return {
      firstButton: ['oContent__tab', 'btn', { 'oContent__tab--active': true }],
      secondButton: ['oContent__on-tab', 'btn', { 'oContent__on-tab--active': false }],
      contentOne: true,
      contentTwo: false,
      anccnyResult: {
        price: 0,
        volumnOfLast24Hours: 0,
        rate: 0
      },
      anscnyResult: {
        price: 0,
        volumnOfLast24Hours: 0,
        rate: 0
      },
      kacansResult: {
        price: 0,
        volumnOfLast24Hours: 0,
        rate: 0
      }
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

    /**
     * getData
     *
     */
    async getData () {
      this.anccnyResult = (await this.$http.get(`markets/anccny`)).body
      this.anscnyResult = (await this.$http.get(`markets/anscny`)).body
      this.kacansResult = (await this.$http.get(`markets/kacans`)).body
    },

    toMarkets () {
      this.$router.push({path: '/markets', query: { class: 'kacans' }})
    }
  },
  mounted () {
    this.priceTimer = setInterval(() => this.getData(), 2000)
  },
  destroyed () {
    clearInterval(this.priceTimer)
  }

}
