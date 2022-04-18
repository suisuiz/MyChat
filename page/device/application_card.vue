<!--
 * @Descripttion: 应用信息
 * @Author: SUI
 * @Company: chorustek
 * @Date: 2021-06-29 16:25:21
 * @Version: 1.0.0
 * @LastEditors: SUI
 * @LastEditTime: 2021-08-31 18:24:36
 * @FilePath: \things\pages\device\application_card.vue
-->
<template>
  <view class="page" v-if="pageLoad">
    <view class="body_wrap" :class="!pageData.installed ? 'change_height' : ''">
      <view class="info-wrap uni-column-center">
        <image class="icons" :src="pageData.image" mode=""></image>
        <text>{{ pageData.name }}</text>
      </view>

      <view class="content-wrap">
        <view class="title">应用介绍</view>
        <view class="little">{{ pageData.date }} 更新 {{ pageData.version }}版本</view>
        <view class="little">开发者：{{ pageData.author }}</view>
        <view class="content">{{ pageData.introduce }}</view>
      </view>
    </view>

    <!-- 添加 -->
    <view class="bottom-wrap uni-flex-center" v-if="!pageData.installed">
      <view class="btn uni-flex-center" @click="download">添加</view>
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
      // 页面信息
      pageData: {},
      // ID
      appid: ''
    }
  },
  onLoad({ appid }) {
    if (appid) {
      this.appid = appid
      this.getPage()
    }
  },
  methods: {
    // 展示页面
    getPage() {
      app.showLoading()
      let data = { appid: this.appid }
      app.view_app(data, (res) => {
        if (res.code == 0) {
          this.pageData = res.data
          this.pageLoad = true
          app.hideLoading()
        } else {
          app.showToast(res.message)
        }
      })
    },

    // 下载/安装应用
    download(item) {
      let that = this
      app.showLoading()
      let data = { appid: that.appid }
      app.install_app(data, (res) => {
        if (res.code == 0) {
          uni.showToast({
            title: '下载成功',
            mask: true,
            success() {
              setTimeout(() => {
                app.hideLoading()
                that.getPage()
              }, 1000)
            }
          })
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
  height: 100vh;
  padding: 22rpx 40rpx 0;
  box-sizing: border-box;

  .body_wrap {
    height: 100%;
    overflow: scroll;

    // 信息
    .info-wrap {
      margin-bottom: 40rpx;
      color: #1e1e1e;
      font-size: 36rpx;

      image {
        margin-bottom: 10rpx;
        width: 132rpx;
        height: 132rpx;
        border-radius: 10rpx;
      }
    }

    // 内容
    .content-wrap {
      .title {
        margin-bottom: 20rpx;
        color: #1e1e1e;
        font-size: 32rpx;
      }

      .little {
        color: #9e9c9e;
        font-size: 28rpx;
      }

      .content {
        margin-top: 20rpx;
        color: #1e1e1e;
        font-size: 32rpx;
      }
    }
  }

  .change_height {
    height: calc(100% - 176rpx);
  }

  // 底部按钮
  .bottom-wrap {
    position: fixed;
    left: 0;
    bottom: 60rpx;
    width: 100%;
    z-index: 99;

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
