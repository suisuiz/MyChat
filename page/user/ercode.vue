<!--
 * @Descripttion: 二维码名片
 * @Author: SUI
 * @Company: chorustek
 * @Date: 2021-06-18 17:36:51
 * @Version: 1.0.0
 * @LastEditors: SUI
 * @LastEditTime: 2021-08-30 10:59:51
 * @FilePath: \things\pages\user\ercode.vue
-->
<template>
  <view v-if="pageLoad" class="page uni-flex-center">
    <view class="code_wrap">
      <view class="title">{{ name }}</view>
      <view class="box"><image class="code" :src="codeSrc" mode=""></image></view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      pageLoad: false,
      name: '',
      codeSrc: ''
    }
  },
  onLoad({ type, name, groupid }) {
    this.name = name
    if (type === 'me') {
      this.codeSrc = `https://wechat.club077.com/qrcode/01${uni.getStorageSync('userId')}`
    } else {
      this.codeSrc = `https://wechat.club077.com/qrcode/02${groupid}`
    }
    // console.log('二维码', this.codeSrc)
    this.pageLoad = true
  },
  methods: {}
}
</script>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  background: #f3f4f8;

  .code_wrap {
    width: 670rpx;
    border-radius: 20rpx;
    box-shadow: 0px 0px 10rpx 0px rgba(206, 206, 206, 0.5);
    background: #ffffff;

    .title {
      margin: 30rpx 0;
      color: #252525;
      font-size: 44rpx;
      text-align: center;
    }

    .box {
      margin-bottom: 30rpx;
      text-align: center;
      .code {
        width: 528rpx;
        height: 542rpx;
      }
    }
  }
}
</style>
