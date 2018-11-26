<template>
  <div>
    <hr class="user-line"/>      
    <div class="user-info">

           
    <div style="width:150px;height:150px;float:right ">
      <qrcode :value="address" :options="{ size: 150 }"></qrcode>
    </div>

      <p><b>你的钱包地址: </b>{{ address }}</p>
       <p><b>你的公钥字符: </b>{{ publicKey }}
       </p>
      <p><b>你的UID: </b>{{ uid }}</p>
      <p><b>你的NEP2字符:  </b>

        <span @click="openNep2()" class="btn ljbutton">{{nep2Open? '关闭':'打开'}}</span>

        <span v-if="nep2Open" >{{ this.nep2}}</span><br>

      </p>
      <p><b>你的WIF私钥: </b>
        <span @click="openWif()" class="btn ljbutton">{{open? '关闭':'打开'}}</span>
        <span v-if="open">{{w_wif}}</span><br>
      </p>

      <p>
        <b>json文件:</b>

      <span class="btn ljbutton" @click="download">导出</span>
      </p>

      
    </div>

    <el-dialog v-model="nep2Modal">
       <div class="row" >
        <span class="col-xs-3" >输入密码：</span>
        <div class="col-xs-6">
            <input type="password" v-model="pwd" @keyup.enter="enterNep2"  class="form-control" style="width:100% !important;" placeholder="请输入密码">
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
      <el-dialog v-model="wifModal">
       <div class="row" >
        <span class="col-xs-3" >输入密码：</span>
        <div class="col-xs-6">
            <input type="password" v-model="pwd"  @keyup.enter="enterWif"   class="form-control" style="width:100% !important;" placeholder="请输入密码">
        </div>
      </div>

        <div class="row" style="margin-top:20px;">
          <div class="col-xs-3"></div>
          <div class="col-xs-6">
            <el-button type="primary" @click="geneWif()" class="btn btn-block ljbutton" :loading="loading" :disabled="disabled">{{loading ? '执行中' : '确认'}}
            </el-button>
      </div>
    </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { wallet } from "@cityofzion/neon-js";
import { decrypt } from "~utils/ljsign";
import transferModalVue from "../../../components/admin/transferModal.vue";

export default {
  data: () => ({
    open: false,
    nep2: undefined,
    w_wif: undefined,
    nep2Open: false,
    wifOpen: false,
    number: 0,
    animatedNumber: 0,
    nep2Modal: false,
    wifModal: false,
    pwd: "",
    loading: false,
    disabled: false,
    privateKeyEncrypted: undefined,
    publicKey: undefined
  }),

  methods: {
    openNep2() {
      if (!this.nep2) {
        this.nep2Modal = true;
      }

      this.nep2Open = !this.nep2Open;
    },
    openWif() {
      console.log("this.w_wif", this.w_wif);
      console.log("this.wifModal", this.wifModal);
      if (!this.w_wif) {
        this.wifModal = true;
      }
      this.open = !this.open;
      this.wifOpen = !this.wifOpen;
    },

    enterWif() {
      // console.log('enterWif')
      this.geneWif();
    },

    enterNep2() {
      this.geneNep2();
    },

    geneWif() {
      try {
        const privateKey = decrypt(this.privateKeyEncrypted, this.pwd);

        if (privateKey !== this.wa("privateKey")) {
          this.wifModal = true;
          this.loading = false;
          this.disabled = false;
          this.$message.error("验证失败，请重试!");
          return;
        }

        this.open = true;

        this.w_wif = this.wif;
        this.loading = false;
        this.disabled = false;

        this.wifModal = false;
        this.wifOpen = true;
        this.pwd = "";
      } catch (error) {
        this.$message.error("验证失败，请重试!");
        this.open = false;
        this.loading = false;
        this.disabled = false;
        this.wifModal = false;
        this.wifOpen = true;
        this.pwd = "";
      }
    },

    geneNep2() {
      //  console.log('geneNep2')

      try {
        this.loading = true;
        this.disabled = true;

        if (!this.pwd) {
          this.nep2Modal = true;
          this.loading = false;
          this.disabled = false;
          this.$message.error("验证失败，请重试!");
          return;
        }

        // console.log('privateKeyEncrypted',this.privateKeyEncrypted)
        const privateKey = decrypt(this.privateKeyEncrypted, this.pwd);

        if (privateKey !== this.wa("privateKey")) {
          this.nep2Modal = true;
          this.loading = false;
          this.disabled = false;
          this.$message.error("验证失败，请重试!");
          return;
        }

        const prikey = ThinNeo.Helper.GetPrivateKeyFromWIF(this.wa("wif"));
        const n = 16384;
        const r = 8;
        const p = 8;

        // console.log('prikey',prikey)
        ThinNeo.Helper.GetNep2FromPrivateKey(
          prikey,
          this.pwd,
          n,
          r,
          p,
          (info, result) => {
            try {
              // console.log("info=" + info);
              // console.log("result=" + result);
              this.nep2 = result;

              this.loading = false;
              this.disabled = false;
              this.nep2Modal = false;
              this.nep2Open = true;
              this.pwd = "";
            } catch (error) {
              this.loading = false;
              this.disabled = false;
              this.nep2Modal = false;
              this.nep2Open = true;
              this.pwd = "";
            }
          }
        );

        // this.nep2 = wallet.encrypt(this.wa('wif'),this.pwd)

        // this.loading = false
        // this.disabled = false
        // this.nep2Modal = false
        // this.nep2Open = true
      } catch (error) {
        this.$message.error("验证失败，请重试!");
        this.loading = false;
        this.disabled = false;
        this.nep2Modal = false;
        this.nep2Open = true;
        this.pwd = "";
      }
      // console.log('geneNep2',this.nep2)
    },

    download() {
      const text = JSON.stringify({
        address: this.wa("address"),
        publicKey: this.wa("publicKey"),
        publicKeyCompressed: this.wa("publicKeyCompressed"),
        privateKeyEncrypted: this.wa("privateKeyEncrypted")
      });

      console.log("download", text);
      const file = new window.Blob([text], { type: "text/plan" });

      const aLink = document.createElement("a");
      aLink.href = window.URL.createObjectURL(file);
      aLink.download = `${this.wa("uid")}.json`;
      aLink.click();

      window.URL.revokeObjectURL(aLink.href);
    }
  },

  computed: {
    ...mapGetters(["wa", "uid"]),
    address() {
      this.privateKeyEncrypted = this.wa("privateKeyEncrypted");
      this.publicKey = this.wa("publicKeyCompressed");
      //this.w_wif = this.wa('wif')
      // console.log('this.privateKeyEncrypted',this.privateKeyEncrypted)
      return this.wa("address");
    },
    wif() {
      return this.wa("wif");
    }
  }
};
</script>

<style lang="css">
.user-line {
  margin: 0;
}

.user-info {
  margin-top: 10px;
}
</style>
