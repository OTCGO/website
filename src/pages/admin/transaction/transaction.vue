<template>
  <div class="transferModal">
    <div class="row">
      <div class="col-xs-3">
        <b>资产类型：{{ deliver.name }}</b>
      </div>
      <div class="col-xs-6">
        <b>可用数量：{{ deliver.valid }}</b>
      </div>
    </div>

    <!-- 转账数量 -->
    <div class="row" style="margin-top:20px">
      <span class="col-xs-3" style="margin-top:8px">转账数量：</span>
      <div class="col-xs-6">
        <input
            type="text" class="form-control" style="width:100%!important"
            v-model.trim="amount.value"
            @keyup="checkAmount" @focus="selectAll" @blur="checkAmount">
      </div>
      <div class="col-xs-3">
        <span v-if="amount.wrong"
              class="error-text"> 数量错误 </span>
        <span v-else-if="amount.empty"
              class="error-text"> 数量不能为空 </span>
        <span v-else-if="amount.invalid"
              class="error-text"> 可用数量不足 </span>
        <span v-else-if="amount.lenErr"
              class="error-text"> 小数点后不能超过8位 </span>
        <span v-else-if="amount.success"> <img :src="yes"/> </span>
      </div>
    </div>

    <!-- 转账地址 -->
    <div class="row" style="margin-top:20px">
      <span class="col-xs-3" style="margin-top:8px">转账地址：</span>
      <div class="col-xs-6">
        <input type="text" class="form-control" style="width:100% !important;"
               v-model.trim="address.value"
               placeholder="NEO地址或NEO域名"
               @focus="selectAll" @blur="checkAddress" @keyup="checkAddress">
      </div>
      <div class="col-xs-3">
        <span v-if="address.wrong"
              class="error-text"> 地址格式错误 </span>
        <span v-else-if="address.empty"
              class="error-text"> 地址不能为空 </span>
        <span v-else-if="address.lenErr"
              class="error-text"> 地址必须是34位 </span>
        <span v-else-if="address.success"> <img :src="yes"/> </span>
      </div>
    </div>

    <div class="row" style="margin-top:20px">
      <span class="col-xs-3" style="margin-top:8px"></span>
      <span class="col-xs-6" style="">{{ nncaddress }}</span>
    </div>

    <div class="row" style="margin-top:20px">
      <span class="col-xs-3" style="margin-top:8px">手续费({{feeTitle}}) ：</span>
      <span class="col-xs-6" style="">
        <el-slider v-model="fee"  show-input=""  :max="maxFee" :min="0" :step="0.001" :disabled="feeDisabled"></el-slider>
      </span>
     
      
    </div>

    <!-- 确认 -->
    <div class="row" style="margin-top:20px;">
      <div class="col-xs-3"></div>
      <div class="col-xs-6">
        <el-button type="primary" class="btn btn-block ljbutton" @click="transfer"
                   :loading="loading" :disabled="disabled">{{loading ? '执行中' : '确认'}}
        </el-button>
      </div>
    </div>

 
  <div v-if="deliver.chain === 'ONT'">
    <br>
    注意：转账ONG或ONT需向本体主网支付0.01ONG。会自动从用户余额中扣除；余额不足时，转账失败。<br>
  </div>
    <div v-else>
    <br>
    注意：当手续费低于0.001时，会出现延时到账或者无法到账的情况，请选择合适的手续费。<br>
  </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import yes from "~images/yes.png";
import { ONT_ASSETID, ONG_ASSETID } from "~constants";
import { findBalances } from "~utils/util";
import { wallet } from "@cityofzion/neon-js";
import service from "~api";

export default {
  data: () => ({
    disabled: true,
    amount: {
      value: "",
      empty: false,
      lenErr: false,
      wrong: false,
      invalid: false,
      success: false
    },
    address: {
      value: "",
      empty: false,
      lenErr: false,
      wrong: false,
      success: false
    },
    nncaddress: "",
    success: false,
    loading: false,
    errors: {
      amountWrong: false,
      amountEmpty: false,
      amountInvalid: false,
      addWrong: false,
      addLenErr: false,
      addEmpty: false
    },
    yes,
    
    fee: 0.001, // 手续费
    maxFee:0,
    feeDisabled:false,
    feeTitle:'gas'
  }),
  // computed: {
  //    ...mapGetters(["balances"])
  // },
  methods: {
    async transfer() {
      console.log("dest1", this.nncaddress);
      
      if (!await this.checkAddress() || !this.checkAmount()) {
        this.$message.error("请仔细检查输入数量与地址！");
        return;
      }
      if (Number(this.deliver.valid) < Number(this.amount)) {
        this.$message("余额不足！");
        return;
      }

      // ont ong
      if (
        this.deliver.chain === 'ONT' 
      ) {
        // console.log('this.balances',this.balances)
        const [{ total }] = findBalances(
          this.$store.getters.balances,
          "0000000000000000000000000000000000000002"
        );
        console.log("this.balances", total);
        
        if (parseFloat(total) < 0.01) {
          this.$message.error("ontology-ONG 余额不足");
          return;
        }
      }

      this.loading = true;
      
      console.log("this.fee", this.fee);
      this.$store
        .dispatch("TRANSFER", {
          dest: this.nncaddress,
          amount: this.amount.value.toString(),
          assetId: this.deliver.assetId,
          fee: this.fee 
        })
        .then(i => {
          // this.$message.success('转账成功！')
          // nep5
          if (this.deliver.assetId.length === 40) {
            this.$message.success(
              "转账已发起，请于1-2个高度后确认余额，期间请勿重复转账!"
            );
          } else {
            this.$message.success("转账成功！");
          }

          // this.getMaxFee();
          
          this.$set(this.amount, "value", "");
          this.$set(this.address, "value", "");
          this.loading = false;
          
          for (const i in this.address) {
            if (this.address.hasOwnProperty(i) && i !== "value") {
              this.address[i] = false;
            }
          }
          for (const i in this.amount) {
            if (this.amount.hasOwnProperty(i) && i !== "value") {
              this.amount[i] = false;
            }
          }
          this.disabled = true;
        })
        .catch(e => {
          this.$message.error("转账失败，请稍后再试,请勿连接转账，造成资产损失。");
          this.loading = false;
        });
    },

    async checkAddress() {
      try {
        this.nncaddress = "";
        for (const i in this.address) {
          if (this.address.hasOwnProperty(i) && i !== "value")
            this.address[i] = false;
          this.address.success = false;
        }

        if (this.address.value === "") this.address.empty = true;

        if (
          wallet.isAddress(this.address.value) ||
          /.neo/i.test(this.address.value)
        ) {
          this.address.wrong = false;
        } else {
          this.address.wrong = true;
        }
        // if (!/.neo/i.test(this.address.value)) this.address.wrong = true

        // if (this.address.value.length !== 34) this.address.lenErr = true

        for (const i in this.address) {
          if (this.address.hasOwnProperty(i) && this.address[i] === true)
            return false;
        }
        this.address.success = true;
        if (this.amount.success && this.address.success) this.disabled = false;

        


        console.log("this.address.value", this.address.value);
        if (/\.neo$/.test(this.address.value)) {
          const result = await service.getNnAddress(this.address.value);
          console.log("checkAddress", result);
          if (result["error"]) {
            this.$message.error("无效的NNC域名");
          }

          this.nncaddress = result["address"];
        }else{
            this.nncaddress = this.address.value
            console.log("this.nncaddress2222", this.nncaddress);
        }

        console.log("this.nncaddress", this.nncaddress);
        return true;
      } catch (error) {
         this.$message.error("无效的NNC域名");
      }
    },

    checkAmount() {
      console.log("ONT_ASSETID", ONT_ASSETID);
      console.log("this.deliver.valid", this.deliver.valid);

      for (const i in this.amount) {
        if (this.amount.hasOwnProperty(i) && i !== "value")
          this.amount[i] = false;
        this.amount.success = false;
      }

      const amountStr = String(this.amount.value);

      console.log("amountStr", amountStr);
      console.log("Number", !Number(amountStr));
      if (!Number(amountStr)){
         this.amount.wrong = true;
      }

      // handle ong ont
      if (this.deliver.assetId === ONG_ASSETID) {
        if (Number(this.deliver.valid) < Number(this.amount.value) + 0.01)
          this.amount.invalid = true;
      } else {
        if (Number(this.deliver.valid) < Number(this.amount.value))
          this.amount.invalid = true;
      }

      // ong 整数
      if (this.deliver.assetId === ONT_ASSETID) {
        const reg = /^[1-9]\d*$/;
        if (!reg.test(this.amount.value)) {
          this.$message.error("请输入整数转账数量");
          return;
        }
      }

      if (amountStr.slice(amountStr.indexOf(".")).length > 9)
        this.amount.lenErr = true;
      if (amountStr === "" || this.amount.value === 0) this.amount.empty = true;

      


      for (const i in this.amount) {
        if (
          this.amount.hasOwnProperty(i) &&
          this.amount[i] === true &&
          i !== "value"
        )
          return false;
      }
      this.amount.success = true;
      if (this.amount.success && this.address.success) this.disabled = false;
      return true;
    },

    selectAll(e) {
      setTimeout(function() {
        e.target.select();
      }, 0);
    },

    getMaxFee(){

      console.log("getMaxFee", this.maxFee);
      const [{total}] = findBalances(
            this.$store.getters.balances,
            "602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7"
        );

      this.maxFee = total > 1 ? 1 : Math.floor(total * 1000) / 1000  
      console.log("created", this.maxFee);
    }
  },

  computed: {
    ...mapGetters(["deliver"])


  },
   beforeDestroy() {
    console.log('Mounted destroyed')
  },

  created(){

    if (
       this.deliver.chain === 'ONT' 
      ){
        console.log("created", this.maxFee);
        this.maxFee = 0.01
        this.fee =  0.01
        this.feeDisabled = true
        return
    }

    this.getMaxFee()

   

  },
  mounted() {
    // console.log('mounted')
    console.log("mounted", this.$store.getters.balances);
    this.nncaddress = "";

    
    console.log("feeTitle", this.feeTitle);
    this.feeTitle = (this.deliver.chain === 'ONT' ) ? 'ong' : 'gas'
    
    // console.log("mounted", this.transferType);
    // console.log("balances", this.$store.getters.balances);
  }
};
</script>

<style lang="css">
.transferModal {
  margin-top: 20px;
  padding-left: 10px;
  padding-right: 20px;
}

.error-text {
}
</style>
