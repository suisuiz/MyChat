<!--
 * @Descripttion: 
 * @Author: SUI
 * @Company: chorustek
 * @Date: 2020-10-22 15:09:05
 * @Version: 1.0.0
 * @LastEditors: SUI
 * @LastEditTime: 2021-08-30 10:59:02
 * @FilePath: \things\pages\other\introduce.vue
-->
<template>
  <view class="page">
    <view class="introduce_wrap">
      <view class="introduce_item" v-for="(item, index) in pagedata" :key="index">
        <image class="introduce_item_img" :src="item.img" mode=""></image>
        <view class="introduce_item_right">
          <view class="title">{{ item.title }}</view>
          <view class="size">{{ item.size }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
/*
 *	页面因改版暂未使用.
 */
export default {
  data() {
    return {
      pagedata: [
        {
          img: 'http://p4.music.126.net/QBfrSBp2thjC_WYwmzlhVA==/109951165382857188.jpg?param=30y30',
          title: '什么是弹性云服务器？',
          size: '3M'
        },
        {
          img: 'http://p4.music.126.net/QBfrSBp2thjC_WYwmzlhVA==/109951165382857188.jpg?param=30y30',
          title: '弹性云服务器使用场景？',
          size: '3M'
        },
        {
          img: 'http://p4.music.126.net/QBfrSBp2thjC_WYwmzlhVA==/109951165382857188.jpg?param=30y30',
          title: '弹性云服务器使用须知？',
          size: '3M'
        }
      ]
    }
  },
  onLoad() {
    uni.setNavigationBarTitle({
      title: '产品介绍'
    })
  },
  methods: {}
}
</script>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  background: #f5f5f5;
}

.introduce_wrap {
  padding: 20rpx 0;
  box-sizing: border-box;
}

.introduce_item {
  width: 710rpx;
  height: 158rpx;
  padding: 0 26rpx;
  box-sizing: border-box;
  margin: 0 auto 20rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  border-radius: 16rpx;
}

.introduce_item_img {
  width: 98rpx;
  height: 118rpx;
}

.introduce_item_right {
  flex: 1;
  margin-left: 22rpx;
}

.introduce_item_right .title {
  color: #1e1e1e;
  font-size: 32rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.introduce_item_right .size {
  color: #8f8f8f;
  font-size: 28rpx;
}
</style>
