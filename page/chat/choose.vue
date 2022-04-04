<!--
 * @Descripttion: 选择提醒的人 @功能
 * @Author: SUI
 * @Company: chorustek
 * @Date: 2021-06-25 10:36:56
 * @Version: 1.0.0
 * @LastEditors: SUI
 * @LastEditTime: 2021-09-29 11:22:54
 * @FilePath: \things\pages\chat\choose.vue
-->
<template>
  <view v-if="pageLoad">
    <view class="contacts-box uni-flex-ali" v-for="(item, index) in contactsList" :key="index" @click="contactsClick(item)">
      <!-- 联系人、设备头像 -->
      <image class="img" :src="item.image" mode="" @error="imageError(item)"></image>
      <view class="name">
        <rich-text :nodes="item.name"></rich-text>
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
      roomid: '',
      contactsList: []
    }
  },
  onLoad({ roomid }) {
    if (roomid) {
      this.roomid = roomid
      this.getData()
    }
  },
  methods: {
    // 获取数据
    getData() {
      app.showLoading()
      let that = this
      let data = {
        roomid: that.roomid
      }
      // 聊天室-详情
      app.groupInfo(data, (res) => {
        if (res.code == 0) {
          that.contactsList = res.data.members
          // console.log(res.data);
          that.pageLoad = true
          setTimeout(() => {
            app.hideLoading()
          }, 10)
        } else {
          app.showToast(res.message)
        }
      })
    },

    imageError(item, index) {
      this.$set(item, 'image', '/static/img/user.png')
    },

    // 选择人
    contactsClick(item) {
      // 获取上一页数据
      let pages = getCurrentPages()
      let page = pages[pages.length - 2]
      // 拼接选择人的名字
      page.$vm.inputVal += `${item.name} `
      page.$vm.receiveList.push(item.userid)
      uni.navigateBack({})
    }
  }
}
</script>

<style scoped lang="scss">
// 结果
.contacts-box {
  position: relative;
  padding: 0 40rpx;
  box-sizing: border-box;
  height: 120rpx;

  // 联系人、设备头像
  .img {
    width: 90rpx;
    height: 90rpx;
    margin-right: 30rpx;
    border-radius: 100%;
  }

  .name {
    flex: 1;
    margin-right: 40rpx;
    height: 120rpx;
    line-height: 120rpx;
    color: #252525;
    font-size: 32rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }
}
</style>
