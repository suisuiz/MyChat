<!--
 * @Descripttion: 登录页面
 * @Author: SUI
 * @LastEditors: SUI
 * @LastEditTime: 2021-08-30 11:00:19
 * @FilePath: \MyChat\pages\user\login.vue
-->
<template>
  <view class="page" v-if="pageLoad">
    <view class="login-wrap">
      <!-- 标题 -->
      <view class="login-title">账号登录</view>
      <!-- 登录表单 -->
      <view>
        <!-- 手机号 -->
        <view class="input-flex">
          <view class="input-flex-text">用户</view>
          <input type="tel" maxlength="11" v-model="account" placeholder="请填写手机号" />
        </view>

        <!-- 密码 -->
        <view class="input-flex" v-if="state == 1">
          <view class="input-flex-text">密码</view>
          <input placeholder="请填写密码" type="password" v-model="password" />
        </view>

        <!-- 按钮 -->
        <button type="primary" class="login-button" :class="account.length == 11 && password.length > 5 ? '' : 'opacity'" @tap="bindPwdLogin">登录</button>
        <view class="register-button" @tap="register">注册</view>

        <!-- 其他 -->
        <view class="login-other">
          <!-- <view @tap="state = 1" v-if="state==0">用户名登录</view>
					<view @tap="state = 0" v-if="state==1">手机号登录</view> -->
          <!-- <view @click="wxLogin">微信登录</view> -->
        </view>
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
      // 状态
      state: 1,
      // 账号、密码
      account: '',
      password: ''
    }
  },

  onLoad(option) {
    this.pageLoad = true
  },

  onHide() {},

  onUnload() {},

  methods: {
    // 登录
    bindPwdLogin() {
      if (!this.account || this.account.length < 11) {
        // app.showToast('请填写手机号码');
        return false
      }
      if (!/^1[3-8]\d{9}$/.test(this.account)) {
        app.showToast('请填写正确格式的手机号')
        return
      }
      if (this.state == 1) {
        if (!this.password) {
          // app.showToast('请填写密码');
          return false
        }
        if (this.password.length < 6) {
          // app.showToast('密码不正确');
          return
        }
      }

      app.showLoading()
      let data = {
        phone: this.account,
        password: this.password
      }
      // 个推、推送标识符
      //#ifdef APP-PLUS
      let inf = plus.push.getClientInfo()
      console.log(inf)
      data.clientid = inf.clientid
      //#endif
      app.login(data, (res) => {
        console.log(res)
        if (res.code == 0) {
          // 设置缓存token
          let tokenObj = {
            token: res.AccessToken,
            refresh_token: res.RefreshToken
          }
          app.setToken(tokenObj)
          // 昵称、头像、自己userId、蓝牙地址、运行位置
          uni.setStorageSync('nickname', res.UserInfo.Name)
          uni.setStorageSync('headimgurl', res.UserInfo.Image)
          uni.setStorageSync('userId', res.UserInfo.UserId)
          uni.setStorageSync('localAddress', res.UserInfo.LocalAddress)
          uni.setStorageSync('btAddress', res.UserInfo.BTAddress)
          uni.setStorageSync('site', res.UserInfo.Site)
          uni.setStorageSync('gatewayId', res.UserInfo.GatewayId)
          // update sqlite dbPath
          require('@/common/sqlite.js').updatePath(res.UserInfo.UserId)

          setTimeout(() => {
            getApp().begin()
          }, 500)
          setTimeout(() => {
            app.hideLoading()
            // 跳转
            uni.redirectTo({
              url: '/pages/index/index'
            })
          }, 1500)
        } else {
          app.showToast(res.message)
        }
      })
    },

    // 注册
    register() {
      uni.navigateTo({
        url: `/pages/user/register`
      })
    },

    // 微信登录
    wxLogin() {
      // 仅 APP-PLUS 编译
      // #ifdef APP-PLUS
      plus.oauth.getServices(
        (services) => {
          for (var i in services) {
            let service = services[i]
            if (service.id == 'weixin') {
              service.authorize((e) => {
                console.log('获取code!' + JSON.stringify(e.code))
                let data = {
                  code: e.code
                }
                app.wx_login(data, (res) => {
                  if (res.code == 0) {
                    // 正常登录
                    // 设置缓存token
                    let tokenObj = {
                      token: res.AccessToken,
                      refresh_token: res.RefreshToken
                    }
                    app.setToken(tokenObj)
                    // 跳转
                    uni.switchTab({
                      url: '/pages/chat/list'
                    })

                    // that.WEBSOCKET();
                  } else if (res.code == 254) {
                    // 当前微信未关联/绑定手机号
                    uni.reLaunch({
                      url: `/pages/user/register?token=${res.token}`
                    })
                  } else {
                    app.showToast(res.message)
                  }
                })
              })
            }
          }
        },
        (e) => {
          plus.nativeUI.alert('获取登录授权服务列表失败：' + JSON.stringify(e))
        }
      )
      // #endif
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

  .login-wrap {
    width: 500rpx;
    margin: auto;
    background: rgba($color: lightgray, $alpha: 0.02);

    // 标题
    .login-title {
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
        margin-left: 20rpx;
        font-size: 30rpx;
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

    .login-button {
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

    .register-button {
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

    .login-other {
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
}
</style>
