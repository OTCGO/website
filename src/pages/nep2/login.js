import { img } from '~utils/config'
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
import { decrypt, doValidatePwd ,getWif, } from '~utils/ljsign'
import { genKeyPairHex, encryptPrivateKey, getCompressedPubHex } from '~utils/ljsign'
import { wallet } from '@cityofzion/neon-js'
import { ljWifkeyToPubkey, ljWifkeyToHexkey,isWIF } from '~libs/LJSign'

export default {
  data () {
    return {
      img,
      nep2: '',
      password: '',
      filenameError: '',
      wallet: {},
      success: false,
      loading: false
    }
  },

  validations: {
    password: {
      required,
      minLength: minLength(4),
      maxLength: maxLength(16)
    }
  },

  methods: {
    async login () {
      console.log('nep2 login')
      
      this.loading = true
      try {
     
        const wif = await getWif(this.nep2, this.password)


        console.log('wif',wif)

        const privateKey =  wallet.getPrivateKeyFromWIF(wif)

        console.log('privateKey',privateKey)
        if (isWIF(wif)) {
          // this.wallet['privateKey'] = wallet.getPrivateKeyFromWIF(wif)

          this.wallet.publicKey = ljWifkeyToPubkey(wif)
          this.wallet.privateKey = ljWifkeyToHexkey(wif)
          this.wallet.privateKeyEncrypted = encryptPrivateKey(this.wallet.privateKey, this.password)
          this.wallet.publicKeyCompressed = getCompressedPubHex(this.wallet.publicKey)
          this.wallet.address = wallet.getAddressFromScriptHash(wallet.getScriptHashFromPublicKey(this.wallet.publicKey))

          // console.log('this.wallet',this.wallet)


          this.loading = false
          this.$message.success('验证成功!')
          this.$router.push({ path: '/admin/balances' })
          this.$store.dispatch('LOGIN', this.wallet)
              .then(() => {
                delete this.wallet
                // this.loading = false
                // this.$message.success('验证成功!')
                // this.$router.push({ path: '/admin/balances' })
              }, () => {
                this.$message.error('验证失败，请检查nep2字符与密码重试!')
                this.loading = false
              })
        } else {
          this.loading = false
          this.$message.error('验证失败，请检查nep2字符与密码重试!')
        }
      } catch (e) {
        console.log('e',e)
        this.loading = false
        this.$message.error('验证失败，请检查nep2字符与密码重试!')
      }
      
    },
    readFile (file) {
      // const reader = new window.FileReader()
      // let vm = this

      // reader.onload = function (e) {
      //   try {
      //     const data = JSON.parse(e.target.result)
      //     if (!vm.checkFile(data, file.name)) throw new Error('钱包文件错误！')
      //     vm.wallet = data
      //   } catch (err) {
      //     vm.filenameError = err.message
      //     vm.filename = ''
      //   }
      // }
      // reader.readAsText(file)
    },
    checkFile (file, filename) {
      // if (!file.hasOwnProperty('publicKey') || !file.hasOwnProperty('publicKeyCompressed') ||
      //     !file.hasOwnProperty('privateKeyEncrypted') || !file.hasOwnProperty('address')) return false
      // this.filename = filename
      // this.filenameError = ''
      // return true
    },
    selectAll (e) {
     //  setTimeout(() => e.target.select(), 0)
    }
  },

  computed: {
    loggedIn () {
      return this.$store.getters['loggedIn']
    }
  },

  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.loggedIn ? next('/admin/balances') : next('/nep2')
    })
  }
}
