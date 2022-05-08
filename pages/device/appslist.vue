<!--
 * @Descripttion: 所有应用
 * @Author: SUI
 * @LastEditors: SUI
 * @LastEditTime: 2022-05-08 12:01:13
 * @FilePath: \MyChat\pages\device\appslist.vue
-->
<template>
  <view class="page" v-if="pageLoad">
    <view class="padding">
      <view v-for="(item, index) in appsData" :key="index" class="item-box uni-flex-jus" @tap.stop="info(item.appid)">
        <view class="left uni-flex-ali">
          <image class="img" :src="item.image" mode="" @error="imageError(item)"></image>
          <view>
            <view class="name">{{ item.name }}</view>
            <view class="content">{{ item.desc }}</view>
          </view>
        </view>
        <view class="uni-flex-center" :class="!item.installed ? 'status-new' : 'status-old'" @tap.stop="download(item)">{{ item.installed ? '已下载' : '下载' }}</view>
      </view>
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
      appsData: []
    }
  },

  onShow() {
    this.getPage()
  },

  methods: {
    // 获取页面数据
    getPage() {
      app.showLoading()
      let data = { apptype: 0 }
      app.list_all_appstore(data, (res) => {
        if (res.code == 0) {
          this.appsData = res.data.app
          this.pageLoad = true
          app.hideLoading()
        } else {
          app.showToast(res.message)
        }
      })
    },

    // 详情
    info(appid) {
      uni.navigateTo({
        url: `/pages/device/application_card?appid=${appid}`
      })
    },

    // 下载/安装应用
    download(item) {
      let that = this
      if (item.installed) {
        return
      }
      app.showLoading()
      let data = { appid: item.appid }
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

<style lang="scss" scoped>
.page {
  position: relative;
  height: 100vh;

  .padding {
    padding: 0 40rpx;
    box-sizing: border-box;
  }

  // 应用
  .item-box {
    margin-top: 40rpx;
    height: 120rpx;

    &:nth-of-type(1) {
      margin-top: 0;
    }

    .left {
      flex: 1;
      margin-right: 20rpx;

      .img {
        width: 120rpx;
        height: 120rpx;
      }

      .name {
        margin-left: 30rpx;
        margin-bottom: 10rpx;
        color: #2f2f2e;
        font-size: 32rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }

      .content {
        margin-left: 30rpx;
        color: #a4a4a4;
        font-size: 28rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }
    }
  }

  .status-old {
    margin: auto;
    width: 120rpx;
    height: 60rpx;
    color: #a4a4a4;
    font-size: 28rpx;
  }

  .status-new {
    margin: auto;
    width: 120rpx;
    height: 60rpx;
    color: #ef4b5b;
    font-size: 28rpx;
    border-radius: 8rpx;
    background: #f3f4f8;
  }
}
</style>
