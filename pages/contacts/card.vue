<!--
 * @Descripttion: 联系人卡片
 * @Author: SUI
 * @LastEditors: SUI
 * @LastEditTime: 2022-05-08 12:01:45
 * @FilePath: \MyChat\pages\contacts\card.vue
-->
<template>
  <view class="wrap" v-if="pageLoad">
    <view class="top_wrap">
      <!-- 信息 -->
      <view class="top_box uni-flex-ali">
        <image :src="image" mode="" @tap="showImg" @error="imageError"></image>
        <view class="nick-wrap">
          <view class="nick-name">{{ name }}</view>
          <view class="nick-content">{{ wuChatId }}</view>
        </view>
      </view>

      <!-- 操作 -->
      <block v-if="pageType == 'send'">
        <!-- 中间内容 -->
        <!-- chattype  1 联系人  4 设备 -->
        <view class="center-wrap">
          <view class="center-box uni-flex-jus" v-if="chattype == '4'" @click="changeName">
            <text>设备名称</text>
            <view>
              <text>{{ name }}</text>
              <uni-icons type="forward" color="#9E9C9E" size="16" />
            </view>
          </view>
          <view class="center-box uni-flex-jus" v-if="chattype == '1'">
            <text>亲密联系人</text>
            <view class="right-switch">
              <switch class="switch" @change="dearChange" :checked="dearBol" color="#42DA60" style="transform: scale(0.5)" />
            </view>
          </view>
          <view class="center-box uni-flex-jus" v-if="chattype == '4'">
            <text>公开设备</text>
            <view class="right-switch">
              <switch class="switch" @change="deviceChange" :checked="deviceBol" color="#42DA60" style="transform: scale(0.5)" />
            </view>
          </view>
          <view class="center-box uni-flex-jus" v-if="chattype != '1'" @click="shareList">
            <text>共享名单</text>
            <view class="right-switch">
              <uni-icons type="forward" color="#9E9C9E" size="16" />
            </view>
          </view>
          <view class="center-box uni-flex-jus" @click="shareBtn">
            <text>转发名片</text>
            <view class="right-switch">
              <uni-icons type="forward" color="#9E9C9E" size="16" />
            </view>
          </view>
          <view class="center-box uni-flex-jus" v-if="chattype == '4'" @click="isRelay = true">
            <text>分享权限</text>
            <view class="right-switch">
              <uni-icons type="forward" color="#9E9C9E" size="16" />
            </view>
          </view>
          <!-- <view class="center-box uni-flex-jus">
            <text>消息免打扰</text>
            <view class="right-switch">
              <switch
                class="switch"
                @change="levelChange"
                :checked="levelBol"
                color="#42DA60"
                style="transform: scale(0.5)"
              />
            </view>
          </view> -->
        </view>
        <!-- 发消息 -->
        <view class="send-btn" @click="send"> <uni-icons type="chat" color="#5D6B92" size="17" /><text>发消息</text> </view>
        <!-- 删除 -->
        <view class="send-btn del-btn" @click="delMember">
          <text>删除{{ chattype == '1' ? '联系人' : '设备' }}</text>
        </view>
      </block>

      <!-- 添加好友 -->
      <block v-if="pageType == 'add'">
        <!-- 联系人 -->
        <view class="send-btn" @click="addMember" v-if="chattype == '1'">添加联系人</view>
        <!-- 设备 -->
        <view class="send-btn" @click="addDevice" v-else>添加设备</view>
      </block>
    </view>

    <!-- 改名弹框 -->
    <view class="mask_wrap uni-flex-center" v-if="maskBol">
      <view class="close" @click="maskBol = false"></view>
      <view class="mask_top">
        <view class="mask_title">设备名称</view>
        <input type="text" placeholder="请填写设备名称" v-model="inputName" />
        <view class="mask_bottom uni-flex-ali">
          <!-- <text class="cancels">取消</text> -->
          <text class="confirm" @click.stop="rename">确定</text>
        </view>
      </view>
    </view>

    <!-- 设备转发模块 -->
    <view class="relay-mark uni-flex-center" v-if="isRelay" @click="isRelay = false">
      <view class="wraps">
        <view class="relay-wrap uni-column-center" @click="relayEvent(1)">
          <text>共享数据</text>
        </view>
        <view class="relay-wrap wrap2 uni-column-center" @click="relayEvent(2)">
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
      // 控制页面展示
      pageLoad: false,
      pageType: 'send',
      // 联系人ID
      id: '',
      // room ID
      roomid: '',
      // 联系人类别
      chattype: '1',
      // 联系人姓名、头像、电话
      name: '',
      image: '',
      wuChatId: '',
      // 改名弹框
      maskBol: false,
      inputName: '',
      // 消息免打扰
      levelBol: false,
      // 是否亲密联系人
      dearBol: false,
      // 是否公开设备
      deviceBol: false,
      // 弹框内容
      content: '',
      // 转发蒙版
      isRelay: false,

      appid: '',
      siteid: ''
    }
  },

  onLoad({ peopleId, chattype }) {
    let that = this
    app.showLoading()
    // 入口：联系人列表
    if (typeof peopleId != 'undefined' && typeof chattype != 'undefined') {
      that.id = peopleId
      that.chattype = chattype
      that.getData()
    } else {
      // 入口：添加好友
      this.id = peopleId
      that.getData()
    }
  },

  onShow() {},

  // 点击右上角三个点
  onNavigationBarButtonTap() {
    // if (this.pageType == 'send' && this.id != '' && this.name != '') {
    //   uni.navigateTo({
    //     url: `/pages/contacts/more?peopleId=${this.id}&name=${this.name}&image=${this.image}&roomid=${this.roomid}&type=${this.chattype}`
    //   })
    // }
  },

  methods: {
    // 获取卡片详情
    getData() {
      let that = this
      let data = {
        detailid: that.id,
        type: parseInt(that.chattype)
      }
      app.contactInfo(data, (res) => {
        // console.log(res)
        if (res.code == 0) {
          that.id = res.detail_id
          that.roomid = res.room_id
          that.name = res.info.Name
          that.inputName = res.info.Name
          that.image = res.info.Image
          that.wuChatId = res.info.Wuchatid
          that.appid = res.info.appid
          that.siteid = res.info.siteid

          // 是好友
          if (res.info.Friend) {
            if (that.chattype == '1') {
              that.content = `删除联系人${that.name}，将同时删除与该联系人的聊天记录?`
            } else {
              that.content = `删除设备${that.name}，将同时删除与该设备的聊天记录?`
            }
            // 免打扰
            if (res.info.Level == 0) {
              that.levelBol = false
            } else {
              that.levelBol = true
            }
            // 亲密联系人
            that.dearBol = res.info.Dear
            // 公开设备
            that.deviceBol = res.info.Open
            that.pageType = 'send'
            that.pageLoad = true
            app.hideLoading()
          } else {
            // 不是好友
            that.pageType = 'add'
            that.pageLoad = true
            app.hideLoading()
          }
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

    // 显示改名弹框
    changeName() {
      this.maskBol = true
    },

    // 设备改名
    rename() {
      let that = this
      if (this.inputName == '') {
        app.showToast('请填写名称')
        return
      }
      app.showLoading()
      let data = {
        name: that.inputName,
        deviceid: that.id
      }
      // console.log(data);
      app.set_device_name(data, (res) => {
        if (res.code == 0) {
          // 刷新联系人列表
          getApp().getContactList('update')
          uni.showToast({
            title: '改名成功',
            mask: true,
            success() {
              setTimeout(() => {
                that.maskBol = false
                that.getData()
              }, 1000)
            }
          })
        } else {
          app.showToast(res.message)
        }
      })
    },

    // 更改消息免打扰
    levelChange(e) {
      let data = {}
      data.detailid = this.id
      data.type = parseInt(this.chattype)
      if (e.target.value) {
        data.level = 1
      } else {
        data.level = 0
      }
      app.set_message_level(data, (res) => {
        if (res.code == 0) {
        } else {
          app.showToast(res.message)
        }
      })
    },

    // 更改亲密联系人
    dearChange(e) {
      let data = {
        friendid: this.id
      }
      if (e.target.value) {
        // 设置为亲密联系人
        app.set_dear_contact(data, (res) => {
          if (res.code == 0) {
          } else {
            app.showToast(res.message)
          }
        })
      } else {
        // 取消亲密联系人
        app.del_dear_contact(data, (res) => {
          if (res.code == 0) {
          } else {
            app.showToast(res.message)
          }
        })
      }
    },

    // 更改是否公开设备
    deviceChange(e) {
      let data = {
        deviceid: this.id,
        status: e.target.value
      }
      app.set_device_open(data, (res) => {
        if (res.code == 0) {
        } else {
          app.showToast(res.message)
        }
      })
    },

    // 发消息
    send() {
      // 校验数据库是否建表 没有就创建
      getApp().checkSqlite('nolog')

      if (this.roomid) {
        uni.redirectTo({
          url: `/pages/chat/room/chat?roomid=${this.roomid}&title=${this.name}&chattype=${this.chattype}&receiveid=${this.id}&appid=${this.appid}&siteid=${this.siteid}`
        })
      }
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

    // 添加设备
    addDevice() {
      let data = {
        deviceid: this.id
      }
      app.deviceContactAdd(data, (res) => {
        if (res.code == 0) {
          app.showToast('已发送')
          // 刷新联系人列表
          getApp().getContactList('update')
        } else {
          app.showToast(res.message)
        }
      })
    },

    // 共享名单
    shareList() {
      if (this.id) {
        uni.navigateTo({
          url: `/pages/contacts/device_sharelist?deviceid=${this.id}`
        })
      }
    },

    // 删除
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

          // 刷新联系人列表
          getApp().getContactList('update')

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
    },

    // 转发名片 --- 弹出蒙版
    shareBtn() {
      if (this.id != '' && this.name != '' && this.roomid != '') {
        uni.navigateTo({
          url: `/pages/contacts/share?roomid=${this.roomid}&id=${this.id}&name=${this.name}&image=${this.image}&type=${this.chattype}`
        })
      }
    },

    // 分享权限
    relayEvent(type) {
      uni.navigateTo({
        url: `/pages/contacts/share?roomid=${this.roomid}&id=${this.id}&name=${this.name}&image=${this.image}&from=share&shareType=${type}`
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

      image {
        width: 100rpx;
        height: 100rpx;
        border-radius: 100%;
      }

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

    // 中间内容
    .center-wrap {
      padding: 0 40rpx;
      box-sizing: border-box;
      margin-top: 20rpx;
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

        .right-switch {
          position: relative;

          .switch {
            position: absolute;
            right: -30rpx;
            top: -30rpx;
          }
        }
      }
    }

    // 发送消息
    .send-btn {
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

    .del-btn {
      color: #ef495a;
    }
  }

  // 命名弹窗
  .mask_wrap {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background: rgba(88, 88, 88, 0.3);
    z-index: 99;

    .close {
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
    }

    .mask_top {
      width: 620rpx;
      height: 330rpx;
      text-align: center;
      color: #3b3f4a;
      font-size: 32rpx;
      border-radius: 42rpx;
      background: #ffffff;
      z-index: 100;

      .mask_title {
        height: 100rpx;
        line-height: 100rpx;
      }

      input {
        margin: 0 auto 24rpx;
        width: 98%;
        height: 92rpx;
        color: #1e1e1e;
        font-size: 30rpx;
      }

      .mask_bottom {
        height: 114rpx;
        font-size: 32rpx;
        font-weight: 500;
        border-top: solid 1px rgba(216, 216, 216, 0.4);

        .cancels {
          flex: 1;
          height: 80rpx;
          line-height: 80rpx;
          border-right: solid 1px rgba(216, 216, 216, 0.4);
        }

        .confirm {
          flex: 1;
          color: #1e1e1e;
          height: 90rpx;
          line-height: 90rpx;
        }
      }
    }
  }

  // 转发模块
  .relay-mark {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background: rgba(88, 88, 88, 0.3);
    z-index: 98;

    .wraps {
      background: #ffffff;
      border-radius: 20rpx;

      .relay-wrap {
        color: #2f2f2e;
        font-size: 24rpx;
        width: 576rpx;
        height: 100rpx;
      }

      .wrap2 {
        border-top: solid 1px #f6f6f6;
      }
    }
  }
}
</style>
