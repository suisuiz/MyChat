<!--
 * @Descripttion: 共享名单
 * @Author: SUI
 * @LastEditors: SUI
 * @LastEditTime: 2022-05-08 12:01:52
 * @FilePath: \MyChat\pages\contacts\device_sharelist.vue
-->
<template>
  <view v-if="pageLoad" class="page">
    <!-- 联系人列表 -->
    <view class="contacts-list" v-if="dataList.length != 0">
      <view class="wrap uni-flex-jus" v-for="(item, index) in dataList" :key="index">
        <view class="wrap-box uni-flex-ali">
          <image class="img" :src="item.image" mode="" @error="imageError(item)"></image>
          <view class="right uni-flex-ali">
            <text>{{ item.name }}</text>
            <block>
              <image class="img" v-if="item.type == 1" src="/static/img/device/devicelist_share1.png" mode=""> </image>
              <image class="img" v-else src="/static/img/device/devicelist_share2.png" mode=""></image>
            </block>
          </view>
        </view>
      </view>
    </view>

    <!-- 空空如也 -->
    <view class="not-wrap uni-flex-center" v-else>
      <view class="not-box uni-column-center">
        <image class="img" src="/static/img/kong.png" mode=""></image>
        <text>暂无内容</text>
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
      // 共享名单
      dataList: []
    }
  },
  onLoad({ deviceid }) {
    this.deviceid = deviceid
    this.getData()
  },

  methods: {
    // 获取列表
    getData() {
      app.showLoading()
      let data = {
        deviceid: this.deviceid
      }
      app.list_device_share(data, (res) => {
        if (res.code == 0) {
          console.log(res.data)
          this.dataList = res.data
          this.pageLoad = true
          app.hideLoading()
        } else {
          app.showToast(res.message)
        }
      })
    },

    imageError(item, index) {
      this.$set(item, 'image', '/static/img/user.png')
    }
  }
}
</script>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  background: #ffffff;

  /* 列表 */
  .contacts-list {
    padding-top: 22rpx;
    box-sizing: border-box;

    .wrap {
      position: relative;
      padding: 0 40rpx;
      box-sizing: border-box;
      margin-bottom: 40rpx;

      &-box {
        .img {
          width: 90rpx;
          height: 90rpx;
          margin-right: 30rpx;
          border-radius: 100%;
        }

        .right {
          height: 80rpx;
          flex: 1;
          color: #2f2f2e;
          font-size: 32rpx;

          .img {
            margin-left: 10rpx;
            width: 32rpx;
            height: 32rpx;
          }
        }
      }
    }
  }

  // 空空如也
  .not-wrap {
    width: 480rpx;
    height: 380rpx;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;

    .not-box {
      color: #a4a4a4;
      font-size: 28rpx;

      .img {
        margin-bottom: 44rpx;
        width: 480rpx;
        height: 278rpx;
      }
    }
  }
}
</style>
