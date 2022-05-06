<!--
 * @Descripttion: 场所列表
 * @Author: SUI
 * @Company: chorustek
 * @Date: 2021-06-15 11:58:04
 * @Version: 1.0.0
 * @LastEditors: SUI
 * @LastEditTime: 2021-08-30 10:59:34
 * @FilePath: \things\pages\place\list.vue
-->
<template>
  <view v-if="pageLoad" class="page">
    <!-- 场所列表 -->
    <view class="contacts-list" v-if="placeList.length != 0">
      <view class="wrap uni-flex-jus" v-for="(item, index) in placeList" :key="index" @click="bindClick(item)">
        <view class="wrap-box">
          <image class="img" :src="item.image" mode="" @error="imageError(item)"></image>
          <view class="right">
            <view class="name uni-flex-ali">
              <text>{{ item.name }}</text>
            </view>
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
      placeList: []
    }
  },
  onLoad() {},

  onShow() {
    this.getData()
  },

  methods: {
    // 获取场所列表
    getData() {
      app.showLoading()
      app.list_site_contact({}, (res) => {
        if (res.code == 0) {
          console.log('场所列表', res.data)
          this.placeList = res.data
          this.pageLoad = true
          app.hideLoading()
        } else {
          app.showToast(res.message)
        }
      })
    },

    imageError(item, index) {
      this.$set(item, 'image', '/static/img/user.png')
    },

    // 点击到场所卡片
    bindClick(item) {
      uni.navigateTo({
        url: `card?id=${item.siteid}`
      })
    }
  }
}
</script>

<style scoped lang="scss">
.page {
  min-height: 100vh;

  // 场所列表
  .contacts-list {
    padding: 22rpx 40rpx 0;
    box-sizing: border-box;

    .wrap {
      position: relative;
      margin-bottom: 40rpx;

      &-box {
        display: flex;
        align-items: center;

        .img {
          width: 90rpx;
          height: 90rpx;
          margin-right: 30rpx;
          border-radius: 100%;
        }

        .right {
          flex: 1;

          .name {
            margin-right: 20rpx;
            color: #2f2f2e;
            font-size: 32rpx;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
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
