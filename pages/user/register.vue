<!--
 * @Descripttion: 注册页面
 * @Author: SUI
 * @Company: chorustek
 * @Date: 2021-03-02 15:45:39
 * @Version: 1.0.0
 * @LastEditors: SUI
 * @LastEditTime: 2021-10-20 09:48:36
 * @FilePath: \things\pages\user\register.vue
-->
<template>
  <view class="page" v-if="pageLoad">
    <view class="register-wrap">
      <view class="register-title">{{ token == null ? '账号注册' : '绑定手机号' }}</view>

      <!-- 注册表单 -->
      <view>
        <!-- 手机号 -->
        <view class="input-flex">
          <input type="tel" maxlength="11" v-model="telephone" placeholder="请填写手机号" />
        </view>

        <!-- 验证码 -->
        <view class="input-flex">
          <input type="number" maxlength="6" v-model="code" placeholder="请填写验证码" />
          <view class="input-flex-btn" :class="telephone.length == 11 ? '' : 'opacity'" @tap="getCode">{{ btnText }} </view>
        </view>

        <!-- 密码 -->
        <view class="input-flex" v-if="state == 1">
          <input placeholder="请填写密码（至少6位）" v-model="password" :password="showPassword" />
          <view class="uni-icon uni-icon-eye" :class="[!showPassword ? 'uni-active' : '']" @click="changePassword"></view>
        </view>
        <view class="input-flex" v-if="state == 1">
          <input placeholder="请确认密码" v-model="password2" :password="showPassword2" />
          <view class="uni-icon uni-icon-eye" :class="[!showPassword2 ? 'uni-active' : '']" @click="changePassword2"></view>
        </view>

        <!-- 按钮 -->
        <button class="register-button" :class="telephone.length == 11 && code.length > 3 && password.length > 5 && password2.length > 5 ? '' : 'opacity'" @tap="bindPwdRegister">
          {{ token == null ? '注册' : '绑定手机' }}
        </button>
        <view class="login-button" @tap="login">登录</view>

        <!-- 其他 -->
        <view class="register-other">
          <!-- <view @tap="state = 1" v-if="state==0">用户名注册</view>
					<view @tap="state = 0" v-if="state==1">手机号注册</view> -->
        </view>
      </view>

      <view class="login-bottom">
        <view class="little">注册即代表同意<text>《用户服务协议》</text>和<text>《隐私协议》</text></view>
      </view>
    </view>
  </view>
</template>

<script>
let app = require('@/common/common.js')
export default {
  data() {
    return {
      pageLoad: false,
      token: null,
      // 状态
      state: 1,
      // 账号、密码
      code: '',
      telephone: '',
      password: '',
      password2: '',
      sended: false,
      waitSecond: {},
      showPassword: true,
      showPassword2: true
    }
  },

  computed: {
    isWaiting() {
      return this.waitSecond > 0
    },
    btnText() {
      return this.isWaiting > 0 ? `（${this.waitSecond}秒）` : !this.sended ? '获取验证码' : '重新发送'
    }
  },

  onLoad({ token }) {
    if (token) {
      this.token = token
    }
    this.pageLoad = true
  },

  onUnload() {
    // 清除倒计时验证码
    clearInterval(this.interval)
  },

  methods: {
    // 获取验证码
    getCode() {
      let that = this
      if (that.isWaiting) {
        return false
      }
      if (!that.telephone || that.telephone.length < 11) {
        return false
      }
      if (!/^1[3-8]\d{9}$/.test(that.telephone)) {
        app.showToast('请输入正确格式的手机号')
        return
      }
      app.showLoading()
      let data = {
        phone: that.telephone
      }
      app.sendsms(data, (res) => {
        if (res.code == 0) {
          app.hideLoading()
          that.cd(60)
        } else {
          app.showToast(res.message)
        }
      })

      return false
    },
    // 获取验证码倒计时
    cd(second) {
      if (this.isWaiting) {
        return
      }
      this.waitSecond = second
      this.interval = setInterval(() => {
        this.waitSecond--
        if (this.waitSecond === 0) {
          clearInterval(this.interval)
        }
      }, 1000)
      this.sended = true
    },

    // 显示密码
    changePassword() {
      this.showPassword = !this.showPassword
    },
    // 显示密码
    changePassword2() {
      this.showPassword2 = !this.showPassword2
    },

    // 注册
    bindPwdRegister() {
      if (!this.telephone || this.telephone.length < 11) {
        return false
      }
      if (!/^1[3-8]\d{9}$/.test(this.telephone)) {
        app.showToast('请填写正确格式的手机号')
        return
      }
      if (this.code.length < 4) {
        // app.showToast("验证码无效");
        return
      }
      if (this.state == 1) {
        if (!this.password) {
          // app.showToast("请填写密码");
          return false
        }
        if (this.password.length < 6 && this.password2.length < 6) {
          // app.showToast("密码最短为 6 个字符");
          return
        }
        if (this.password != this.password2) {
          app.showToast('两次密码不一致')
          return
        }
      }

      // 注册用户
      if (this.token == null) {
        app.showLoading()
        let data = {
          phone: this.telephone,
          password: this.password,
          code: this.code
        }
        app.register(data, (res) => {
          if (res.code == 0) {
            app.hideLoading()
            app.showToast('注册成功')
            uni.navigateTo({
              url: `/pages/user/login`
            })
          } else {
            app.showToast(res.message)
          }
        })
      } else {
        app.showLoading()
        // 微信绑定手机号
        let data = {
          phone: this.telephone,
          password: this.password,
          code: this.code,
          token: this.token
        }
        // app.wx_bdphone(data, res => {
        // 	if (res.code == 0) {
        // 		// 正常登录
        // 		// 设置缓存token
        // 		let tokenObj = {
        // 			token: res.AccessToken,
        // 			refresh_token: res.RefreshToken
        // 		}
        // 		app.setToken(tokenObj);
        // 		app.hideLoading();
        // 		getApp().begin();
        // 		// 跳转
        // 		uni.switchTab({
        // 			url: "/pages/chat/list"
        // 		});
        // 	} else {
        // 		app.showToast(res.message);
        // 	}
        // });
      }
    },

    // 登录
    login() {
      if (this.token == null) {
        uni.navigateBack({})
      } else {
        uni.navigateTo({
          url: `/pages/user/login`
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.page {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-image: url(http://39.99.139.115/wuchat/loginbk.png);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;

  .register-wrap {
    width: 500rpx;
    margin: auto;
    background: rgba($color: lightgray, $alpha: 0.05);

    // 标题
    .register-title {
      color: #ffffff;
      font-size: 40rpx;
      text-align: center;
      font-weight: 500;
      margin-bottom: 80rpx;
    }

    // 表单
    .input-flex {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      height: 70rpx;
      padding: 0 30rpx;
      margin-bottom: 40rpx;
      box-sizing: border-box;
      background: #ffffff;
      border-radius: 10rpx;
      animation: animations 1s forwards;

      &-text {
        font-size: 32rpx;
      }

      input {
        flex: 1;
        font-size: 30rpx;
      }

      &-btn {
        height: 70rpx;
        line-height: 70rpx;
        text-align: center;
        color: #f9718c;
        font-size: 24rpx;
      }
    }

    @keyframes animations {
      from {
        opacity: 0;
      }

      to {
        opacity: 1;
      }
    }

    .register-button {
      width: 500rpx;
      height: 80rpx;
      color: #ffffff;
      font-size: 32rpx;
      margin-top: 30rpx;
      text-align: center;
      line-height: 80rpx;
      background: #ef4b5b;
      border-radius: 10rpx;
    }

    .login-button {
      width: 500rpx;
      height: 80rpx;
      color: #ffffff;
      font-size: 32rpx;
      margin-top: 40rpx;
      text-align: center;
      line-height: 80rpx;
      border-radius: 10rpx;
      border: 1px solid #eceeee;
    }

    .register-other {
      margin-top: 24rpx;
      display: flex;
      justify-content: space-between;
      color: #f9f9f9;
      font-size: 26rpx;
    }

    .opacity {
      opacity: 0.4;
    }
  }

  .login-bottom {
    position: absolute;
    bottom: 74rpx;
    left: 0;
    width: 100%;

    .little {
      font-size: 26rpx;
      font-weight: 400;
      color: #ffffff;
      text-align: center;

      text {
        color: #f9718c;
      }
    }
  }
}
</style>
