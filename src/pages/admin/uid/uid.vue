<template>
  <div>
    <hr class="user-line">
    <div class="user-info">
      <div style="width:150px;height:150px;float:right ">
        <qrcode :value="address" :options="{ size: 150 }"></qrcode>
        <span style="text-align:center;display: inherit">钱包地址</span>
      </div>

      <p>
        <b>你的钱包地址:</b>
        {{ address }}
        <span @click="copyToClipboard(address)" class="btn ljbutton">复制</span>
      </p>
      <p>
        <b>你的公钥字符:</b>
        {{ publicKey }}
      </p>
      <p>
        <b>你的UID:</b>
        {{ uid }}
      </p>
      <p>
        <b>你的NEP2字符:</b>

        <span @click="openNep2('nep2')" class="btn ljbutton">{{nep2Open? '关闭':'打开'}}</span>

        <span v-if="nep2Open">{{ this.nep2}}</span>
        <br>
      </p>
      <p>
        <b>你的WIF私钥:</b>
        <span @click="openWif()" class="btn ljbutton">{{open? '关闭':'打开'}}</span>
        <span v-if="open">{{w_wif}}</span>
        <br>
      </p>

      <p>
        <b>json文件:</b>

        <span class="btn ljbutton" @click="download">导出</span>
      </p>
      <p>
        <b>NEP6 文件:</b>

        <span class="btn ljbutton" @click="openNep2('nep6')">导出</span>
      </p>
    </div>

    <el-dialog v-model="nep2Modal">
      <div class="row">
        <span class="col-xs-3">输入密码：</span>
        <div class="col-xs-6">
          <input
            type="password"
            v-model="pwd"
            @keyup.enter="enterNep2"
            class="form-control"
            style="width:100% !important;"
            placeholder="请输入密码"
          >
        </div>
      </div>

      <div class="row" style="margin-top:20px;">
        <div class="col-xs-3"></div>
        <div class="col-xs-6">
          <el-button
            type="primary"
            @click="geneNep2()"
            class="btn btn-block ljbutton"
            :loading="loading"
            :disabled="disabled"
          >{{loading ? '执行中' : '确认'}}</el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog v-model="wifModal">
      <div class="row">
        <span class="col-xs-3">输入密码：</span>
        <div class="col-xs-6">
          <input
            type="password"
            v-model="pwd"
            @keyup.enter="enterWif"
            class="form-control"
            style="width:100% !important;"
            placeholder="请输入密码"
          >
        </div>
      </div>

      <div class="row" style="margin-top:20px;">
        <div class="col-xs-3"></div>
        <div class="col-xs-6">
          <el-button
            type="primary"
            @click="geneWif()"
            class="btn btn-block ljbutton"
            :loading="loading"
            :disabled="disabled"
          >{{loading ? '执行中' : '确认'}}</el-button>
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
    publicKey: undefined,
    nepType: ""
  }),

  methods: {
    copyToClipboard(address) {
      const el = document.createElement("textarea"); // Create a <textarea> element
      el.value = address; // Set its value to the string that you want copied
      el.setAttribute("readonly", ""); // Make it readonly to be tamper-proof
      el.style.position = "absolute";
      el.style.left = "-9999px"; // Move outside the screen to make it invisible
      document.body.appendChild(el); // Append the <textarea> element to the HTML document
      const selected =
        document.getSelection().rangeCount > 0 // Check if there is any content selected previously
          ? document.getSelection().getRangeAt(0) // Store selection if found
          : false; // Mark as false to know no selection existed before
      el.select(); // Select the <textarea> content
      document.execCommand("copy"); // Copy - only works as a result of a user action (e.g. click events)
      document.body.removeChild(el); // Remove the <textarea> element
      if (selected) {
        // If a selection existed before copying
        document.getSelection().removeAllRanges(); // Unselect everything on the HTML document
        document.getSelection().addRange(selected); // Restore the original selection
      }

      this.$message.success("复制成功");
    },
    openNep2(str) {
      console.log("openNep2", str);
      // this.nep2 = null;

      this.nepType = str;

      if (str === "nep2") {
        if (!this.nep2) {
          this.nep2Modal = true;
        }

        this.nep2Open = !this.nep2Open;

        return;
      }

      if (str === "nep6") {
        this.nep2Modal = true;
        return;
      }
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
              if (this.nepType === "nep2") {
                this.nep2 = result;
              }
              if (this.nepType === "nep6") {
                const acc = new wallet.Account(this.wa("wif"));
                console.log("acc", acc);

                acc.encrypt(this.pwd);

                const text = JSON.stringify(acc.export());

                console.log("download", text);
                const file = new window.Blob([text], { type: "text/plan" });

                const aLink = document.createElement("a");
                aLink.href = window.URL.createObjectURL(file);
                aLink.download = `${this.wa("address")}.json`;
                aLink.click();
              }

              this.loading = false;
              this.disabled = false;
              this.nep2Modal = false;
              this.nep2Open = true;
              this.pwd = "";
            } catch (error) {
              console.log("error", error);
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
