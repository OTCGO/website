<template src="./markets.html"></template>
<style lang="stylus" src="./markets.styl" scoped></style>

<script>
  import { mapGetters } from 'vuex'
  import { findBalances, fillArray, mul } from '../../utils/util'
  import Table from '../../components/common/Table'

  const tableHeader = [{
    label: '类型',
    width: '25%'
  }, {
    label: '委托价格',
    width: '25%'
  }, {
    label: '委托数量',
    width: '25%'
  }, {
    label: '操作',
    width: '25%'
  }]
  const mytradeHeader = [{
    label: '类型'
  }, {
    label: '成交价格'
  }, {
    label: '成交数量'
  }, {
    label: '总价'
  }, {
    label: '成交时间'
  }]

  const fillObj = {
    id: '--',
    amount: '--',
    price: '--',
    isEmpty: true
  }
  export default {
    components: {
      'table-container': Table
    },
    data() {
      return {
        mytradeHeader: mytradeHeader,
        tableHeader: tableHeader,
        tradeHeader: [],
        totalTrade: '0.00', // 24小时成交量
        currentPrice: '0.00', // 当前价
        mytradeDataSource: [], // 我的交易记录
        tradeDataSource: [], // 最新交易
        actionDataSource: [], // 用户操作列表
        bills: [],  // 买单列表
        orders: [],  // 卖单列表
        amountMax: 0,
        name: '',
        receiveName: '',
        currency: '',
        type: this.$route.query.class,
        total: 0,
        rate: 0,
        currentPage: 1,
        pageLength: 7,
        ownAsset: {},
        assetId: '',
        sellPlaceHolder: '',
        buyPlaceHolder: '',
        valueId: '',
        buyButtonStatus: true,
        sellButtonStatus: true,
        payNum: '', // 买入的数量
        payAnsPrice: '', // 买入的单价
        sellNum: '', // 卖出的数量
        sellAnsPrice: '', // 卖出的价格
        bidLoading: false,
        askLoading: false,
        cancelStatus: true,
        cancelDisplay: true
      }
    },

    watch: {
      '$route' (to, from) {
        if (to.path === '/markets')
          this.watchChange(to)
        else this.$destroy()
      },
      'blockHeight' (val) {
        if (val) {
          this.buyButtonStatus = true
          this.sellButtonStatus = true
        }
      }
    },

    computed: {
      ...mapGetters(['loggedIn', 'deliver', 'receive', 'balances', 'blockHeight']),
      deliverCurrency() {
        switch (this.$route.query.class) {
          case 'kacneo':
            this.tradeHeader = [{
              label: '卖／买'
            }, {
              label: '数量KAC'
            }, {
              label: '单价ANS'
            }, {
              label: '总价NEO'
            }, {
              label: ''
            }]
            return 'KAC'
          case 'lzglzj':
            this.tradeHeader = [{
              label: '卖／买'
            }, {
              label: '数量LZG'
            }, {
              label: '单价LZJ'
            }, {
              label: '总价LZJ'
            }, {
              label: ''
            }]
            return 'LZG'
          case 'neocny':
            this.tradeHeader = [{
              label: '卖／买'
            }, {
              label: '数量NEO'
            }, {
              label: '单价CNY'
            }, {
              label: '总价CNY'
            }, {
              label: ''
            }]
            return 'NEO'
          case 'neocny':
            this.tradeHeader = [{
              label: '卖／买'
            }, {
              label: '数量GAS'
            }, {
              label: '单价CNY'
            }, {
              label: '总价CNY'
            }, {
              label: ''
            }]
            return 'GAS'
          default:
            return 'KAC'
        }
      },
      totoalMoney () {
        return mul(this.payNum, this.payAnsPrice)
      },
      totoalSellMoney () {
        return mul(this.sellNum, this.sellAnsPrice)
      },
      receiveCurrency() {
        switch (this.$route.query.class) {
          case 'kacneo':
            this.sellPlaceHolder = '请输入卖出单价NEO'
            this.buyPlaceHolder = '请输入买入单价NEO'
            return 'NEO'
          case 'lzglzj':
            this.sellPlaceHolder = '请输入卖出单价LZJ'
            this.buyPlaceHolder = '请输入买入单价LZJ'
            return 'LZJ'
          default:
            this.sellPlaceHolder = '请输入卖出单价CNY'
            this.buyPlaceHolder = '请输入买入单价CNY'
            return 'CNY'
        }
      },
      officialSite() {
        switch (this.deliverCurrency) {
          case 'NEO' || 'GAS':
            return '//www.antshares.org/'
          case 'LZG' || 'LZJ':
            return '//www.jieshu.ren/'
          case 'KAC':
            return '//www.kaipaicollege.com/kpxy-pc/index.html'
          default:
            return '//www.antshares.org/'
        }
      },
      tokenDetails() {
        switch (this.deliverCurrency) {
          case 'ANS' || 'ANC':
            return '#/about'
          case 'LZG' || 'LZJ':
            return '//www.jieshu.ren/'
          case 'KAC':
            return '//www.kaipaicollege.com/kpxy-pc/index.html'
          default:
            return '//www.antshares.org/'
        }
      }
    },

    methods: {
      success (type) {
        const success = data => {
          this.tradeDataSource = data.data.reduce(
            (acc, item) => acc.concat({
              type: {
                render: true,
                value: item.way ? '卖出' : '买入',
                class: item.way ? 'green-span' : 'red-span'
              },
              price: {
                render: true,
                value: item.price
              },
              amount: {
                render: true,
                value: item.amount
              },
              total: {
                render: true,
                value: mul(
                    Number(item.price.match(/\d+(\.\d+)?/)[0]),
                    Number(item.amount.match(/\d+(\.\d+)?/)[0])
                ) + this.receiveCurrency
              },
              time: {
                render: true,
                value: item.time
              }
            }),
            []
          ) || []
        }
        this.$store.dispatch(type, {
          marketId: this.$route.query.class,
          active: 1,
          length: 20
        }).then(data => {
          success(data)
        })
        .catch(err => this.$message.error(JSON.parse(err.bodyText).error))
      },
      // 挂买单
      bidAction () {
        if (this.loggedIn) {
          if (!this.payAnsPrice || !this.payNum) return

          this.bidLoading = true
          this.$store.dispatch('SEND_BID', {
            price: this.payAnsPrice,
            amount: this.payNum,
            assetId: this.ownAsset[0].assetId,
            valueId: this.ownAsset[1].assetId
          }).then(data => {
            if (data.hasOwnProperty('result') && data.result) this.$message.success('挂买单成功')
            if (data.error) this.$message.warning(data.error)
            this.bidLoading = false
            this.payAnsPrice = this.payNum = ''
          }).catch(err => {
            this.$message.error(JSON.parse(err.bodyText).error)
            this.bidLoading = false
          })
        }
        else window.$router.push('login')
      },

      // 挂卖单
      askAction () {
        if (this.loggedIn) {
          if (!this.sellAnsPrice || !this.sellNum) return

          this.askLoading = true
          this.$store.dispatch('SEND_ASK', {
            price: this.sellAnsPrice,
            amount: this.sellNum,
            assetId: this.ownAsset[0].assetId,
            valueId: this.ownAsset[1].assetId
          })
              .then(data => {
                if (data.hasOwnProperty('result') && data.result) this.$message.success('挂卖单成功')
                if (data.error) this.$message.warning(data.error)
                this.askLoading = false
                this.sellAnsPrice = this.sellNum = ''
              })
              .catch(err => {
                this.$message.error(JSON.parse(err.bodyText).error)
                this.askLoading = false
              })
        }
        else window.$router.push('login')
      },

      buyOrder ({ id, amount, price }, eventCallBack) {
        if (this.loggedIn) {
          if (!this.buyButtonStatus) return
          this.$store.commit('SET_DELIVER', this.deliverCurrency)
          this.$store.commit('SET_RECEIVE', this.receiveCurrency)
          const total = mul(amount, price)
          this.$msgbox({
            title: '提示',
            message: `您将要购买总价${total}${this.receiveCurrency}的${this.name}，当前${this.receiveCurrency}可用余额为${this.receive.valid}是否确认下单？`,
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            beforeClose: async (action, instance, done) => {
              instance.confirmButtonLoading = false
              if (action === 'confirm') {
                if (this.receive.valid < total) {
                  this.$message.warning(`${this.receive.name}余额不足，请进行充值！`)
                  eventCallBack(false)
                  done()
                  return
                }
                instance.confirmButtonLoading = true
                instance.confirmButtonText = '执行中...'
                try {
                  let res = await this.$store.dispatch('SEND_FREE_BID', { id })
                  if (res.hasOwnProperty('result') && res.result) {
                    this.$message.success('交易发起成功，请等待验收！')
                    eventCallBack(false)
                    done()
                    this.buyButtonStatus = false
                    instance.confirmButtonLoading = false
                  }
                } catch(e) {
                  this.$message.error('交易失败，请稍候再试。')
                  eventCallBack(false)
                  instance.confirmButtonLoading = false
                  done()
                }
              } else {
                eventCallBack(false)
                done()
              }
            }
          }).catch(() => { eventCallBack(true);this.buyButtonStatus = true })
        } else {
          window.$router.push({
            name: 'login'
          })
        }
      },

      sellOrder ({ id, price, amount }, eventCallBack) {
        if (this.loggedIn) {
          if (!this.sellButtonStatus) return
          this.$store.commit('SET_DELIVER', this.deliverCurrency)
          this.$store.commit('SET_RECEIVE', this.receiveCurrency)
          const total = mul(amount, price)
          this.$msgbox({
            title: '提示',
            message: `您将要卖出价值${total}${this.receiveCurrency}的${this.name}，当前${this.receiveCurrency}余额为${this.receive.valid}是否确认下单？`,
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            beforeClose: async (action, instance, done) => {
              instance.confirmButtonLoading = false
              if (action === 'confirm') {
                if (this.receive.valid < total) {
                  this.$message.warning(`${this.receive.name}余额不足，请进行充值！`)
                  eventCallBack(false)
                  done()
                  return
                }
                instance.confirmButtonLoading = true
                instance.confirmButtonText = '执行中...'
                try {
                  let res = await this.$store.dispatch('SEND_FREE_ASK', { id })
                  if (res.hasOwnProperty('result') && res.result) {
                    this.$message.success('交易发起成功，请等待验收！')
                    eventCallBack(false)
                    done()
                    this.sellButtonStatus = false
                    instance.confirmButtonLoading = false
                  }
                } catch(e) {
                  this.$message.error('交易失败，请稍候再试。')
                  eventCallBack(false)
                  instance.confirmButtonLoading = false
                  done()
                }
              } else {
                eventCallBack(false)
                done()
              }
            }
          }).catch(() => { eventCallBack(true);this.sellButtonStatus = true })
        } else {
          window.$router.push({
            name: 'login'
          })
        }
      },

      // 撤销买卖单
      cancel (item) {
        this.cancelStatus = false

        if (this.loggedIn) {

          this.$store.dispatch('CANCEL', {
            id: item.id.value
          })
              .then(data => {
                this.$message.success('撤销成功')
                this.cancelStatus = true
              })
              .catch(err => {
                this.$message.error(JSON.parse(err.bodyText).error)
                this.cancelStatus = true
              })
        }
        else window.$router.push({ name: 'login' })
      },

      watchChange (to) {
        switch (to.query.class) {
          case 'neocny':
            this.name = '小蚁股'
            this.receiveName = '人民币'
            break
          case 'neocny':
            this.name = '小蚁币'
            this.receiveName = '人民币'
            break
          case 'kacneo':
            this.name = '开拍学园币（KAC）'
            this.receiveName = '小蚁股'
            break
          case 'lzglzj':
            this.name = '量子股份'
            this.receiveName = '量子积分'
            break
        }
        this.type = to.query.class

        if (to.path === '/markets') this.getOrderBook(this.type)
      },

      getOrderBook(name) {
        const params = {
          active: this.currentPage,
          length: this.pageLength
        }

        this.$store.dispatch('GET_ASSET').then(() => {
          this.ownAsset = [
            findBalances(this.balances, this.deliverCurrency.toLocaleLowerCase())[0],
            findBalances(this.balances, this.receiveCurrency.toLocaleLowerCase())[0]
          ]
        })


        // 委托单
        this.loggedIn ? this.$store.dispatch('GET_ORDER_BY_ADDRESS', { marketId: this.type }).then(data => {
          const ask = data['asks'].reduce(
              (acc, item) => acc.concat({
                id: {
                  render: false,
                  value: item.id,
                  width: '25%'
                },
                type: {
                  render: true,
                  value: '卖出',
                  class: 'green-span',
                  width: '25%'
                },
                price: {
                  render: true,
                  value: item.price,
                  width: '25%'
                },
                amount: {
                  render: true,
                  value: item.amount,
                  width: '25%'
                }
              }),
              []
          )
          const bids = data['bids'].reduce(
              (acc, item) => acc.concat({
                id: {
                  render: false,
                  value: item.id
                },
                type: {
                  render: true,
                  value: '买入',
                  class: 'red-span'
                },
                price: {
                  render: true,
                  value: item.price
                },
                amount: {
                  render: true,
                  value: item.amount
                }
              }),
              []
          )
          this.actionDataSource = ask.concat(bids)
        })
        .catch(err => this.$message.error(JSON.parse(err.bodyText).error)) : []

        // 获取单一市场详情
        this.$store.dispatch('GET_MARKETSBYID', this.$route.query.class).then(data => {
          this.currentPrice = data.price || '0.00'
          this.totalTrade = data.volumnOfLast24Hours || '0.00'
          this.rate = Number(data.rate).toFixed(4) * 100
        })
        .catch(err => this.$message.error(JSON.parse(err.bodyText).error))


        // 获取最新交易
        this.success('GET_HISTORY_BY_ID', false)

        return this.$store.dispatch('GET_MARKETS', { name, params })
            .then(d => {
              this.total = d['item_num']
              this.orders = fillArray(d.data['asks'], 7, fillObj).reduce(
                  (acc, item, index) => acc.concat({
                    level: {
                      render: true,
                      class: 'green-span',
                      value: `卖${index + 1}`
                    },
                    id: {
                      render: false,
                      value: item.id
                    },
                    amount: {
                      render: true,
                      value: item.amount
                    },
                    price: {
                      render: true,
                      value: item.price
                    },
                    total: {
                      render: true,
                      value: isNaN(item.price * item.amount) ? '--' : mul(item.price, item.amount)
                    },
                    button: {
                      btnClass: 'btn-red',
                      value: '买入',
                      render: true,
                      hide: item.isEmpty,
                      event: (eventCallBack) => {
                        this.buyOrder(item, eventCallBack)
                      }
                    }
                  }),
                  []
              ).reverse()
              this.bills = fillArray(d.data['bids'], 7, fillObj).reduce(
                (acc, item, index) => acc.concat({
                  level: {
                    render: true,
                    class: 'red-span',
                    value: `买${index + 1}`
                  },
                  id: {
                    render: false,
                    value: item.id
                  },
                  amount: {
                    render: true,
                    value: item.amount
                  },
                  price: {
                    render: true,
                    value: item.price
                  },
                  total: {
                    render: true,
                    value: isNaN(item.price * item.amount) ? '--' : mul(item.price, item.amount)
                  },
                  button: {
                    btnClass: 'btn-blue',
                    value: '卖出',
                    render: true,
                    hide: item.isEmpty,
                    event: (eventCallBack) => {
                      this.sellOrder(item, eventCallBack)
                    }
                  }
                }),
                []
              )
              return d
            })
            .catch(err => this.$message.error(JSON.parse(err.bodyText).error))
      }
    },

    mounted() {
      this.watchChange(this.$route)
      this.marketsTimer = window.setInterval(() => this.getOrderBook(this.type), 1000 * 2)
    },

    destroyed() {
      window.clearInterval(this.marketsTimer)
    }
  }
</script>
