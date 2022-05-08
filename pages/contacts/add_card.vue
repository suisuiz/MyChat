<!--
 * @Descripttion: 名片添加
 * @Author: SUI
 * @Date: 2021-08-04 10:56:54
 * @LastEditors: SUI
 * @LastEditTime: 2021-09-22 10:38:05
 * @FilePath: \things\pages\contacts\add_card.vue
-->
<template>
  <view class="wrap" v-if="pageLoad">
    <view class="top_wrap">
      <!-- 信息 -->
      <view class="top_box uni-flex-ali">
        <!-- 联系人头像 -->
        <image class="image" v-if="type !== '5'" :src="image" @tap="showImg" @error="imageError"></image>
        <!-- 群聊头像 -->
        <!-- 拼群聊头像 -->
        <view class="img_wrap" :class="imageList.length == 2 ? 'uni-flex-ali' : imageList.length > 2 ? 'img_wrap2' : ''" v-else>
          <block v-if="imageList.length == 1">
            <image v-for="(item, index) in imageList" :key="index" class="avatarImg" mode="aspectFill" :src="item.image"></image>
          </block>
          <block v-else-if="imageList.length == 2">
            <image v-for="(item, index) in imageList" :key="index" class="avatarImg2" mode="aspectFill" :src="item.image"></image>
          </block>
          <block v-else-if="imageList.length == 3">
            <image v-for="(item, index) in imageList" :key="index" class="avatarImg3" mode="aspectFill" :src="item.image"></image>
          </block>
          <block v-else-if="imageList.length > 3">
            <image v-for="(item, index) in imageList" :key="index" class="avatarImg3" mode="aspectFill" :src="item.image"></image>
          </block>
        </view>

        <!-- 信息 -->
        <view class="nick-wrap">
          <view class="nick-name">{{ name }}</view>
          <view class="nick-content">{{ wuChatId }}</view>
        </view>
      </view>

      <!-- 添加联系人 -->
      <view class="send" @click="addMember" v-if="type == '1'">添加联系人</view>
      <!-- 收藏（添加联系人） -->
      <view class="send" @click="collect" v-else-if="type == '4'">添加联系人</view>
      <!-- 添加群 -->
      <view class="send" @click="addGroup" v-else>添加群</view>
    </view>
  </view>
</template>

<script>
// 引入接口
let app = require('@/common/common.js')
export default {
  data() {
    return {
      // 控制页面展示
      pageLoad: false,
      // 联系人ID
      id: '',
      // room ID
      roomid: '',
      // 联系人类别
      type: '1',
      // 联系人姓名、头像、电话
      name: '',
      image: '',
      wuChatId: '',
      imageList: []
    }
  },
  onLoad({ peopleId, type }) {
    let that = this
    if (typeof peopleId != 'undefined' && typeof type != 'undefined') {
      that.id = peopleId
      that.type = type
      if (type !== '5') {
        that.getData()
      } else {
        that.getGroup()
      }
    }
  },
  methods: {
    // 人卡片详情
    getData() {
      app.showLoading()
      let that = this
      let data = {
        detailid: that.id,
        type: that.type * 1
      }
      // console.log(data)
      app.contactInfo(data, (res) => {
        // console.log(res)
        if (res.code == 0) {
          that.roomid = res.room_id
          that.name = res.info.Name
          that.image = res.info.Image
          that.wuChatId = res.info.Wuchatid
          that.pageLoad = true
          app.hideLoading()
        } else {
          app.showToast(res.message)
        }
      })
    },

    // 群卡片详情
    getGroup() {
      app.showLoading()
      let that = this
      let data = {
        roomid: that.id
      }
      // 聊天室-详情
      app.groupInfo(data, (res) => {
        if (res.code == 0) {
          that.name = res.data.name
          that.imageList = res.data.members
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
      this.image = '/static/img/user.png'
    },

    // 预览头像
    showImg() {
      uni.previewImage({
        indicator: 'none',
        urls: [this.image]
      })
    },

    // 添加联系人
    addMember() {
      if (this.id == uni.getStorageSync('userId')) {
        app.showToast('不能添加自己')
      } else {
        let data = {
          userid: this.id
        }
        // 添加好友
        app.contactAdd(data, (res) => {
          if (res.code == 0) {
            app.showToast('已发送')
          } else {
            app.showToast(res.message)
          }
        })
      }
    },

    // 收藏（添加联系人）
    collect() {
      let data = {
        deviceid: this.id
      }
      // 收藏（添加联系人）
      app.deviceContactAdd(data, (res) => {
        if (res.code == 0) {
          app.showToast('已发送')
          // 刷新联系人列表
          getApp().getContactList('update')
          uni.redirectTo({
            url: `/pages/contacts/card?peopleId=${this.id}&chattype=${this.type}`
          })
        } else {
          app.showToast(res.message)
        }
      })
    },

    // 添加群聊
    addGroup() {
      let data = {
        roomid: this.id
      }
      app.groupContactAdd(data, (res) => {
        if (res.code == 0) {
          app.showToast('已发送')
        } else {
          app.showToast(res.message)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.wrap {
  height: 100vh;
  background: #f3f4f8;

  .top_wrap {
    padding: 22rpx 40rpx 0;
    box-sizing: border-box;

    .top_box {
      padding: 0 40rpx;
      box-sizing: border-box;
      height: 160rpx;
      border-radius: 20rpx;
      background: #ffffff;

      // 联系人头像
      .image {
        width: 100rpx;
        height: 100rpx;
        border-radius: 100%;
      }

      // 拼头像
      .img_wrap {
        width: 100rpx;
        height: 100rpx;
        border-radius: 100%;
        overflow: hidden;
        background: #f6f7fb;

        .avatarImg {
          width: 100%;
          height: 100%;
        }

        .avatarImg2 {
          width: 50%;
          height: 100%;
        }

        .avatarImg3 {
          width: 50%;
          height: 50%;
        }
      }
      .img_wrap2 {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
      }

      // 信息
      .nick-wrap {
        margin-left: 20rpx;

        .nick-name {
          margin-bottom: 18rpx;
          color: #1e1e1e;
          font-size: 32rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }

        .nick-content {
          line-height: 1;
          color: #a4a4a4;
          font-size: 24rpx;
        }
      }
    }

    // 发送消息
    .send {
      margin-top: 20rpx;
      height: 90rpx;
      line-height: 90rpx;
      color: #5d6b92;
      font-size: 32rpx;
      text-align: center;
      border-radius: 20rpx;
      background: #ffffff;

      text {
        margin-left: 10rpx;
      }
    }
  }
}
</style>
