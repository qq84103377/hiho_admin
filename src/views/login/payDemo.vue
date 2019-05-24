<template>
  <div class="login-container">
    <el-form class="login-form" autoComplete="on" :model="loginForm"  ref="loginForm" label-position="left">
      <el-form-item>
        <el-input  type="text" v-model.trim="finPaymentId"  placeholder="finPaymentId" />
      </el-form-item>
      <el-form-item>
        <el-input  type="text" v-model.trim="totalAmount"  placeholder="totalAmount" />
      </el-form-item>
      <el-form-item>
        <el-button class="login-btn" type="primary" :loading="loading" @click.native.prevent="goPay">
          微信支付
        </el-button>
      </el-form-item>
      <div style="position: absolute; top:35px;right: -300px;width: 300px;">
        <el-form-item>
          <el-input  type="text" v-model.trim="alipay.out_trade_no"  placeholder="out_trade_no" />
        </el-form-item>
        <el-form-item>
          <el-input  type="text" v-model.trim="alipay.total_amount"  placeholder="total_amount" />
        </el-form-item>
        <el-form-item>
          <el-input  type="text" v-model.trim="alipay.subject"  placeholder="subject" />
        </el-form-item>
        <el-form-item>
          <el-input  type="text" v-model.trim="alipay.product_code"  placeholder="product_code" />
        </el-form-item>
        <el-form-item>
          <el-button class="login-btn" type="primary" :loading="loading" @click.native.prevent="aliPay">
            支付宝支付
          </el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
  import { isvalidUsername } from '@/utils/validate'
  import { pay, alipay } from "@/api/login"

  export default {
    name: 'login',
    data() {
      const validateUsername = (rule, value, callback) => {
        if (!isvalidUsername(value)) {
          callback(new Error('请输入正确的用户名'))
        } else {
          callback()
        }
      }
      const validatePass = (rule, value, callback) => {
        if (value.length < 5) {
          callback(new Error('密码不能小于5位'))
        } else {
          callback()
        }
      }
      return {
        loginForm: {
          phone: '12345678900',
          password: '123'
        },
        loginRules: {
          phone: [{ required: true, trigger: 'blur', validator: validateUsername }],
          password: [{ required: true, trigger: 'blur', validator: validatePass }]
        },
        loading: false,
        pwdType: 'password',
        finPaymentId: '',
        totalAmount: '',
        alipay: {
          out_trade_no: '',
          total_amount: '',
          subject: '',
          product_code: ''
        }
      }
    },
    methods: {
      showPwd() {
        if (this.pwdType === 'password') {
          this.pwdType = ''
        } else {
          this.pwdType = 'password'
        }
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true
            this.$store.dispatch('Login', this.loginForm).then(() => {
              this.loading = false
              this.$router.push({ path: '/goods' })
            }).catch(() => {
              this.loading = false
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      goPay() {
        const params = {
          userId: 'u1',
          finPaymentId: this.finPaymentId,
          totalAmount: this.totalAmount
        }
        pay(params).then(res => {
          console.log(res)
          if (res.return_code === 'SUCCESS') {
            location.href = res.mweb_url
          }
        })
      },
      aliPay() {
        console.log(this.alipay)
        alipay(this.alipay).then(res => {
          console.log(res)
          if (res.code === 0) {
            location.href = res.data
          }
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  @import 'src/styles/variables.scss';
  /* reset element-ui css */
  .login-container {
    .el-input {
      color: $sysGolden;
      display: inline-block;
      height: 47px;
      width: 85%;
      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $sysGolden;
        height: 47px;
        &:-webkit-autofill {
          -webkit-box-shadow: 0 0 0px 1000px $sysBlack inset !important;
          -webkit-text-fill-color: $sysGolden !important;
        }
      }
    }
    .el-form-item {
      border: 1px solid rgba(243, 209, 152, 0.5);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 0;
      color: #454545;
    }
  }

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import 'src/styles/variables.scss';
  .login-container {
    position: fixed;
    height: 100%;
    width: 100%;
    background-color: $sysBlack;
    .login-form {
      position: absolute;
      left: 0;
      right: 0;
      /*width: 520px;*/
      width: 320px;
      padding: 35px 35px 15px 35px;
      /*margin: 120px auto;*/
      margin: 0;
    }
    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;
      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }
    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $sysGolden;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
      &_login {
        font-size: 20px;
      }
    }
    .title {
      font-size: 26px;
      font-weight: 400;
      color: $sysGolden;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $sysGolden;
      cursor: pointer;
      user-select: none;
    }
    .login-btn{
      line-height: 28px;
      font-size: 18px;
      color: $sysBlack;
      background-color: $sysGolden;
      width: 100%;
      border-color: $sysGolden;
    }
  }
</style>
