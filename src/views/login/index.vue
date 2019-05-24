<template>
  <div class="login-container">
    <el-form class="login-form" autoComplete="on" :model="loginForm"  ref="loginForm" label-position="left">
      <h3 class="title">嗨货</h3>
      <el-form-item prop="phone">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input name="phone" type="text" v-model="loginForm.phone" autoComplete="on" placeholder="用户名" />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"></svg-icon>
        </span>
        <el-input name="password" :type="pwdType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on"
          placeholder="密码"></el-input>
          <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye" /></span>
      </el-form-item>
      <el-form-item>
        <el-button class="login-btn" type="primary" :loading="loading" @click.native.prevent="handleLogin">
          登录
        </el-button>
      </el-form-item>
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
        password: '123456'
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
      console.log(process.env.NODE_ENV,'========');
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
    width: 520px;
    /*width: 320px;*/
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
    /*margin: 0;*/
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
