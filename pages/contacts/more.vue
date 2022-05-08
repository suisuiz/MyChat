<!--
 * @Descripttion: 更多，共享、转发、删除
 * @Author: SUI
 * @Company: chorustek
 * @Date: 2021-05-25 10:47:15
 * @Version: 1.0.0
 * @LastEditors: SUI
 * @LastEditTime: 2021-08-30 10:54:59
 * @FilePath: \things\pages\contacts\more.vue
-->
<template>
  <view class="wrap">
    <view class="top_wrap">
      <!-- 内容 -->
      <view class="center-wrap">
        <view class="center-box uni-flex-jus" v-if="type != '1'" @click="shareList">
          <text>共享名单</text>
          <uni-icons type="forward" color="#9E9C9E" size="16" />
        </view>
        <view class="center-box uni-flex-jus" @click="shareBtn">
          <text>转发{{ type == '1' ? '好友' : '设备' }}名片</text>
          <uni-icons type="forward" color="#9E9C9E" size="16" />
        </view>
      </view>
      <!-- 删除联系人 -->
      <view class="send-btn" @click="delMember">删除{{ type == '1' ? '联系人' : '设备' }}</view>
    </view>

    <!-- 设备转发模块 -->
    <view class="relay-mark uni-flex-center" v-if="isRelay" @click="isRelay = false">
      <!-- <view class="relay-mark uni-flex-center" @click="isRelay = false"> -->
      <view class="uni-flex-jus">
        <view class="relay-wrap uni-column-center" @click="relayEvent(1)">
          <image class="relay-img" src="/static/img/device/device_share1.png" mode=""></image>
          <text>共享数据</text>
        </view>
        <view class="relay-wrap wrap2 uni-column-center" @click="relayEvent(2)">
          <image class="relay-img" src="/static/img/device/device_share2.png" mode=""></image>
          <text>共享权限</text>
        </view>
      </view>
    </view>

    <!-- 删除弹框 -->
    <uni-popup id="deldialog" ref="deldialog" type="dialog">
      <uni-popup-dialog mode="base" type="other" title=" " :content="content" @confirm="deldialog"> </uni-popup-dialog>
    </uni-popup>
  </view>
</template>

<script>
// 引入接口
let app = require('@/common/common.js')
// 引入封装的 sqlite
import DB from '@/common/sqlite.js'
// 提示框
import uniPopup from '@/components/uni-popup/uni-popup.vue'
import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
export default {
  components: {
    uniPopup,
    uniPopupDialog
  },
  data() {
    return {
      // 名片ID/联系人ID
      id: '',
      // 联系人名字
      name: '',
      image: '',
      // roomid
      roomid: '',
      // 弹框内容
      content: '',
      type: '',

      // 转发蒙版、要转发设备ID
      isRelay: false
    }
  },

  onLoad({ peopleId, name, image, roomid, type }) {
    this.id = peopleId
    this.name = name
    this.image = image
    this.roomid = roomid
    this.type = type
    if (type == '1') {
      this.content = `删除联系人${name}，将同时删除与该联系人的聊天记录?`
    } else {
      this.content = `删除设备${name}，将同时删除与该设备的聊天记录?`
    }
  },

  methods: {
    // 共享名单
    shareList() {
      if (this.id) {
        uni.navigateTo({
          url: `/pages/contacts/device_sharelist?deviceid=${this.id}`
        })
      }
    },

    // 转发名片 --- 弹出蒙版
    shareBtn() {
      if (this.id != '' && this.name != '' && this.roomid != '') {
        this.isRelay = true

        // uni.navigateTo({
        // 	url: `/pages/contacts/share?roomid=${this.roomid}&id=${this.id}&name=${this.name}&image=${this.image}&type=${this.type}`
        // });
      }
    },

    // 转发按钮
    relayEvent(type) {
      uni.navigateTo({
        url: `/pages/contacts/share?roomid=${this.roomid}&id=${this.id}&name=${this.name}&image=${this.image}&from=share&shareType=${type}`
      })
    },

    delMember() {
      this.$refs.deldialog.open()
    },

    // 删除联系人
    deldialog(done, name) {
      app.showLoading()
      let data = {
        userid: this.id
      }
      app.contactDel(data, (res) => {
        if (res.code == 0) {
          // 清除本地 历史记录 和 列表
          DB.deleteTableData('chatlist', 'roomid', this.roomid)
            .then((res) => {
              // console.log("列表删除")
            })
            .catch((error) => {
              console.log('删除失败', error)
            })
          DB.deleteTableData('history', 'roomid', this.roomid)
            .then((res) => {
              // console.log("历史记录删除")
            })
            .catch((error) => {
              console.log('删除失败', error)
            })
          setTimeout(() => {
            uni.showToast({
              title: '删除成功',
              mask: true,
              success() {
                setTimeout(() => {
                  uni.navigateBack({
                    delta: 2
                  })
                  app.hideLoading()
                }, 1000)
              }
            })
          }, 1000)
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

    .center-wrap {
      padding: 0 40rpx;
      box-sizing: border-box;
      border-radius: 20rpx;
      background: #ffffff;

      .center-box {
        height: 98rpx;
        color: #1e1e1e;
        font-size: 32rpx;
        border-bottom: #f3f4f8 2rpx solid;

        &:last-child {
          border: none;
        }
      }
    }

    // 发送消息
    .send-btn {
      margin-top: 20rpx;
      height: 90rpx;
      line-height: 90rpx;
      color: #ef495a;
      font-size: 32rpx;
      text-align: center;
      border-radius: 20rpx;
      background: #ffffff;
    }
  }

  // 转发模块
  .relay-mark {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    z-index: 98;
    background: rgba(76, 76, 76, 0.1);

    .relay-wrap {
      color: #ffffff;
      font-size: 24rpx;
      width: 166rpx;
      height: 166rpx;
      background: #4c4c4c;
      border-radius: 20rpx;

      .relay-img {
        width: 48rpx;
        height: 48rpx;
        margin-bottom: 6rpx;
      }
    }

    .wrap2 {
      margin-left: 30rpx;
    }
  }
}
</style>
