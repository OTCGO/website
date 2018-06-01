<template>
  <div>
    <hr class="user-line"/>
    <div class="user-info">
      <p><b>你的钱包地址: </b>{{ address }}</p>
      <p><b>你的UID: </b>{{ uid }}</p>
      <p><b>你的NEP2字符:  </b>

        <span @click="openNep2()" class="btn ljbutton">{{nep2Open? '关闭':'打开'}}</span>

        <span v-if="nep2Open" >{{ this.nep2}}</span><br>

      </p>
      <p><b>你的WIF私钥: </b>
        <span @click="open = !open" class="btn ljbutton">{{open? '关闭':'打开'}}</span>
        <span v-if="open">{{wif}}</span><br>
      </p>
    </div>

    <el-dialog v-model="nep2Modal">
       <div class="row" >
        <span class="col-xs-3" >输入密码：</span>
        <div class="col-xs-6">
            <input type="password" v-model="pwd"  class="form-control" style="width:100% !important;" placeholder="请输入密码">
        </div>
      </div>

        <div class="row" style="margin-top:20px;">
          <div class="col-xs-3"></div>
          <div class="col-xs-6">
            <el-button type="primary" @click="geneNep2()" class="btn btn-block ljbutton" :loading="loading" :disabled="disabled">{{loading ? '执行中' : '确认'}}
            </el-button>
      </div>
    </div>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { wallet } from '@cityofzion/neon-js'
  import { decrypt } from '~utils/ljsign'
import transferModalVue from '../../../components/admin/transferModal.vue';


  export default {
    data: () => ({
      open: false,
      nep2:undefined,
      nep2Open:false,
      number: 0,
      animatedNumber: 0,
      nep2Modal:false,
      pwd:"",
      loading:false,
      disabled:false,
      privateKeyEncrypted:undefined
    }),

    methods:{
      openNep2(){
        
        if(!this.nep2){
            this.nep2Modal = true
        }

        this.nep2Open = !this.nep2Open

      },
      geneNep2(){
      //  console.log('geneNep2')

      try {
        this.loading = true
        this.disabled = true

       if(!this.pwd){
          this.nep2Modal = true
          this.loading = false
          this.disabled = false
         this.$message.error('验证失败，请重试!')
         return
       }



      // console.log('privateKeyEncrypted',this.privateKeyEncrypted)
      const privateKey = decrypt(this.privateKeyEncrypted, this.pwd)

      if(privateKey !== this.wa('privateKey')){
         this.nep2Modal = true
        this.loading = false
        this.disabled = false
        this.$message.error('验证失败，请重试!')
        return
      }



      this.nep2 = wallet.encrypt(this.wa('wif'),this.pwd)

      this.loading = false
      this.disabled = false
      this.nep2Modal = false
      this.nep2Open = true

      } catch (error) {
         this.loading = false
        this.disabled = false
        this.nep2Modal = false
        this.nep2Open = true
      }
       // console.log('geneNep2',this.nep2)
      }
    },

    computed: {
      ...mapGetters(['wa', 'uid']),
      address() { 
        this.privateKeyEncrypted = this.wa('privateKeyEncrypted')
        // console.log('this.privateKeyEncrypted',this.privateKeyEncrypted)
        return this.wa('address')
      },
      wif() { 
        return this.wa('wif') 
      }
    }

  }
</script>

<style lang="css">
  .user-line {
    margin: 0;
  }

  .user-info {
    margin-top: 66px;
  }
</style>
