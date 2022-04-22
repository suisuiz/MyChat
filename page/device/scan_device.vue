<!--
 * @Descripttion: 扫描设备
 * @Author: SUI
 * @Company: chorustek
 * @Date: 2021-06-21 18:32:38
 * @Version: 1.0.0
 * @LastEditors: SUI
 * @LastEditTime: 2021-11-12 14:38:26
 * @FilePath: \things\pages\device\scan_device.vue
-->
<template>
  <view class="page" v-if="pageLoad">
    <!-- 上方扫描状态 -->
    <view class="top-wrap uni-column-center">
      <image class="img" src="/static/img/device/scan.gif" v-if="!result"></image>
      <image class="img" src="/static/img/device/scan_complete.png" v-if="result"></image>
      <view class="text">
        <view class="state" v-if="!result">正在扫描…</view>
        <view class="state" v-if="result">扫描完成</view>
        <view class="small">请确保智能设备已连接电源，且位于手机附近</view>
      </view>
    </view>

    <!-- 扫描结果---列表展示 -->
    <view class="result-item uni-flex-jus" v-for="(item, index) in contactNew" :key="index">
      <view class="left uni-flex-ali">
        <image class="img" :src="item.image" mode="" @error="imageError(item)"></image>
        <view>
          <view class="name">{{ item.name }}</view>
        </view>
      </view>
      <!-- <view :class="item.status == '添加' ? 'status-new uni-flex-center' : 'status-old'" @click="agree(item)"> {{ item.status }}</view> -->
      <view class="status-new uni-flex-center" @click="agree(item.deviceid)"> 添加</view>
    </view>
  </view>
</template>

<script>
// 引入接口
let app = require('@/common/common.js')
export default {
  data() {
    return {
      pageLoad: true,
      contactNew: [],
      // 扫描状态   false 正在扫描   true 扫描完成
      result: false
    }
  },

  onLoad() {
    this.getList()

    // // 变状态
    // setTimeout(() => {
    //   this.result = true
    // }, 5000)
    // setTimeout(() => {
    //   this.contactNew = []
    // }, 4000)
  },

  methods: {
    imageError(item, index) {
      this.$set(item, 'image', '/static/img/user.png')
    },

    getList() {
      let id = uni.getStorageSync('gatewayId')
      if (id) {
        app.find_device(id, (res) => {
          if (res.code == 0) {
            console.log(res.data)
            this.result = true
            this.contactNew = res.data
            app.hideLoading()
          } else {
            app.showToast(res.message)
          }
        })
      }
    },

    // 添加
    agree(id) {
      let data = {
        deviceid: id
      }
      // 收藏（添加联系人）
      app.deviceContactAdd(data, (res) => {
        if (res.code == 0) {
          app.showToast('已发送')
          // 刷新联系人列表
          getApp().getContactList('update')
          uni.redirectTo({
            url: `/pages/contacts/card?peopleId=${id}&chattype=4`
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
  padding: 22rpx 40rpx 0;
  box-sizing: border-box;

  // 扫描状态
  .top-wrap {
    .img {
      width: 598rpx;
      height: 598rpx;
    }

    .text {
      margin: 40rpx 0;
      text-align: center;

      .state {
        margin-bottom: 20rpx;
        color: #1e1e1e;
        font-size: 32rpx;
      }

      .small {
        color: #a4a4a4;
        font-size: 24rpx;
      }
    }
  }

  // 扫描结果
  .result-item {
    margin-bottom: 40rpx;

    .left {
      flex: 1;
      margin-right: 20rpx;

      .img {
        width: 100rpx;
        height: 100rpx;
        border-radius: 100%;
      }

      .name {
        margin-left: 30rpx;
        color: #2f2f2e;
        font-size: 32rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }
    }

    .status-old {
      color: #a4a4a4;
      font-size: 32rpx;
    }

    .status-new {
      width: 120rpx;
      height: 60rpx;
      color: #ef4b5b;
      font-size: 28rpx;
      border-radius: 8rpx;
      background: #f3f4f8;
    }
  }
}
</style>
