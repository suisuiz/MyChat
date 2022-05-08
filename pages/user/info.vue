<!--
 * @Descripttion: 个人信息
 * @Author: SUI
 * @Company: chorustek
 * @Date: 2021-06-07 09:40:51
 * @Version: 1.0.0
 * @LastEditors: SUI
 * @LastEditTime: 2021-08-30 10:59:55
 * @FilePath: \things\pages\user\info.vue
-->
<template>
  <view v-if="pageLoad" class="page">
    <view class="form">
      <view class="item uni-flex-jus">
        <text>头像</text>
        <view class="uni-flex-ali">
          <image class="img1" :src="headimgurl" mode="" @tap="changeImg"></image>
          <uni-icons type="forward" color="#9E9C9E" size="16" />
        </view>
      </view>
      <view class="item uni-flex-jus">
        <text>昵称</text>
        <view class="uni-flex-ali">
          <input class="inputs" type="text" placeholder="请填写昵称" placeholder-class="place-class" v-model="nickname" />
          <uni-icons type="forward" color="#9E9C9E" size="16" />
        </view>
      </view>
      <view class="item uni-flex-jus" @tap="ercode">
        <text>二维码名片</text>
        <view class="uni-flex-ali">
          <image class="img2" src="/static/img/me/ercode.png" mode=""></image>
          <uni-icons type="forward" color="#9E9C9E" size="16" />
        </view>
      </view>
      <!-- <view class="item uni-flex-jus">
        <text>蓝牙地址</text>
        <view class="uni-flex-ali">
          <input
            class="inputs"
            type="text"
            placeholder="请填写蓝牙地址"
            placeholder-class="place-class"
            v-model="btAddress"
          />
          <uni-icons type="forward" color="#9E9C9E" size="16" />
        </view>
      </view> -->
    </view>
    <view class="save-btn uni-flex-center">
      <view class="btn uni-flex-center" @click="save">保存</view>
    </view>
  </view>
</template>

<script>
// 引入接口
let app = require('@/common/common.js')
export default {
  data() {
    return {
      pageLoad: false,
      // 昵称、头像、蓝牙地址
      headimgurl: '/static/img/user.png',
      nickname: '',
      btAddress: '蓝牙'
    }
  },
  onShow() {
    // 昵称、头像、蓝牙地址
    this.nickname = uni.getStorageSync('nickname')
    this.headimgurl = uni.getStorageSync('headimgurl')
    // this.btAddress = uni.getStorageSync('btAddress')
    this.pageLoad = true
  },

  methods: {
    // 上传头像
    changeImg() {
      let that = this
      uni.chooseImage({
        count: 1,
        success: (res) => {
          app.showLoading()
          app.upload_file({}, res.tempFilePaths[0], (res) => {
            if (res.code == 0) {
              that.headimgurl = res.data
              app.hideLoading()
            } else {
              uni.showToast({
                title: res.message,
                image: '/images/icon/alert.png',
                mask: true
              })
            }
          })
        }
      })
    },

    // 二维码名片
    ercode() {
      uni.navigateTo({
        url: `ercode?type=me&name=${this.nickname}`
      })
    },

    save() {
      if (this.nickname == '') {
        app.showToast('请填写昵称')
        return
      }
      if (this.btAddress == '') {
        app.showToast('请填写蓝牙地址')
        return
      }
      let data = {
        nickname: this.nickname,
        headimgurl: this.headimgurl,
        btAddress: this.btAddress
      }
      // console.log(data)
      app.set_userinfo(data, (res) => {
        if (res.code == 0) {
          uni.setStorageSync('nickname', this.nickname)
          uni.setStorageSync('headimgurl', this.headimgurl)
          uni.setStorageSync('btAddress', this.btAddress)
          uni.navigateBack({})
        } else {
          app.showToast(res.message)
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  background: #f3f4f8;

  .form {
    background: #ffffff;

    .item {
      padding: 0 40rpx;
      box-sizing: border-box;
      height: 124rpx;
      color: #1e1e1e;
      font-size: 32rpx;

      .img1 {
        margin-right: 30rpx;
        height: 80rpx;
        width: 80rpx;
        border-radius: 100%;
      }

      .img2 {
        margin-right: 30rpx;
        width: 40rpx;
        height: 40rpx;
      }

      .inputs {
        margin-right: 30rpx;
        color: #1e1e1e;
        height: 100rpx;
        font-size: 32rpx;
        text-align: right;
      }

      .place-class {
        color: #9e9c9e;
      }
    }
  }

  .save-btn {
    position: absolute;
    bottom: 68rpx;
    width: 100%;

    .btn {
      width: 500rpx;
      height: 80rpx;
      color: #ffffff;
      font-size: 32rpx;
      border-radius: 8rpx;
      background: #ef4b5b;
    }
  }
}
</style>
