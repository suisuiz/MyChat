<!--
 * @Descripttion: 聊天详情--操作
 * @Author: SUI
 * @Company: chorustek
 * @Date: 2020-11-05 15:20:18
 * @Version: 1.0.0
 * @LastEditors: SUI
 * @LastEditTime: 2021-08-30 10:47:58
 * @FilePath: \things\pages\chat\chat_detail.vue
-->
<template>
  <view class="page" v-if="pageLoad">
    <view class="wrap">
      <!-- 对话人展示 -->
      <view class="people-wrap">
        <!-- 对话成员展示 -->
        <view class="people-item" v-for="(item, index) in pageData.members" :key="index" @click="goCard(item)">
          <image class="people-item-img" :src="item.image" @error="imageError(item)"></image>
          <view class="people-item-text">{{ item.name }}</view>
        </view>
        <!-- 类型是群 -->
        <block v-if="(chatType == '5') & (pageData.owner == userId)">
          <view class="people-item">
            <image class="people-item-img" src="/static/img/me/plusx.png" mode="" @click="room_add('group')"> </image>
            <view class="people-item-text"> </view>
          </view>
          <view class="people-item">
            <image class="people-item-img" src="/static/img/me/reduce.png" mode="" @click="room_del"></image>
            <view class="people-item-text"> </view>
          </view>
        </block>
        <!-- 单聊转群聊 -->
        <block v-if="chatType != '5'">
          <view class="people-item">
            <image class="people-item-img" src="/static/img/me/plusx.png" mode="" @click="room_add('people')"> </image>
            <view class="people-item-text"> </view>
          </view>
        </block>
      </view>

      <!-- 中间内容 -->
      <view class="center-wrap">
        <view class="center-box uni-flex-jus" v-if="chatType == '5'" @click="changeName">
          <text>名称</text>
          <view>
            <text>{{ pageData.name }}</text>
            <uni-icons type="forward" color="#9E9C9E" size="16" v-if="pageData.owner == userId" />
          </view>
        </view>
        <view class="center-box uni-flex-jus" v-if="(chatType == '5') & (pageData.owner == userId)" @click="ercode">
          <text>群二维码</text>
          <view class="uni-flex-ali">
            <image class="img" src="/static/img/me/ercode.png" mode=""></image>
            <uni-icons type="forward" color="#9E9C9E" size="16" />
          </view>
        </view>
        <view class="center-box uni-flex-jus">
          <text>消息免打扰</text>
          <view class="right-switch">
            <switch class="switch" @change="switchChange" :checked="pageData.levelBol" color="#42DA60" style="transform: scale(0.5)" />
          </view>
        </view>
        <view class="center-box uni-flex-jus" @click="clear">
          <text>清空聊天记录</text>
          <uni-icons type="forward" color="#9E9C9E" size="16" />
        </view>
        <view class="center-box uni-flex-jus" @click="runBtn" v-if="(chatType == '5') & (pageData.owner == userId)">
          <text>运行位置</text>
          <view>
            <text>{{ pageData.site }}</text>
            <uni-icons type="forward" color="#9E9C9E" size="16" />
          </view>
        </view>
      </view>

      <!-- 底下按钮 -->
      <view class="btn-wrap" v-if="chatType == '5'">
        <view class="btn" @click="dismiss">{{ pageData.owner == userId ? '解散群聊' : '退出群聊' }}</view>
      </view>
    </view>

    <!-- 改名弹框 -->
    <view class="mask_wrap uni-flex-center" v-if="maskBol">
      <view class="close" @click="maskBol = false"></view>
      <view class="mask_top">
        <view class="mask_title">群聊名称</view>
        <input type="text" placeholder="请填写群聊名称" v-model="inputName" />
        <view class="mask_bottom uni-flex-ali">
          <!-- <text class="cancels">取消</text> -->
          <text class="confirm" @click.stop="rename">确定</text>
        </view>
      </view>
    </view>

    <!-- 弹出框 -->
    <uni-popup id="dialogInput" ref="dialogInput" type="dialog">
      <uni-popup-dialog mode="base" type="other" title=" " :content="content" @confirm="dialogInputConfirm"> </uni-popup-dialog>
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
      // 对话 ID 和 类型
      roomid: '',
      chatType: '',

      // 详情数据
      pageData: {},
      // 自己的ID
      userId: '',
      // 文字
      btnText: '',

      // 弹出框类型
      dialogType: '1',
      content: '',
      bol: false,
      detailId: '',

      // 改名弹框
      maskBol: false,
      inputName: ''
    }
  },
  onLoad({ roomid, chatType, detailId }) {
    let that = this
    if (typeof roomid != 'undefined') {
      that.roomid = roomid
      that.chatType = chatType
      that.userId = uni.getStorageSync('userId')
      // 聊天类型--群聊
      if (chatType == '5') {
        that.bol = true
        that.getInfo()
        uni.setNavigationBarTitle({
          title: '群聊信息'
        })
      } else {
        // 单聊
        that.detailId = detailId
        that.getData()
        uni.setNavigationBarTitle({
          title: '聊天信息'
        })
      }
    }
  },

  onShow() {
    let that = this
    // chatType 聊天类型 1 人 4 设备 5 群
    if (!that.bol && that.chatType == '5') {
      // 获取群聊详情
      that.getInfo()
    }
  },

  onHide() {
    this.bol = false
  },

  onUnload() {
    this.bol = false
  },
  methods: {
    // 获取群聊详情
    getInfo() {
      app.showLoading()
      let that = this
      let data = {
        roomid: that.roomid
      }
      // 聊天室-详情
      app.groupInfo(data, (res) => {
        if (res.code == 0) {
          // console.log(res.data);
          if (res.data.level == 0) {
            res.data.levelBol = false
          } else {
            res.data.levelBol = true
          }
          that.inputName = res.data.name
          that.pageData = res.data
          that.pageLoad = true
          setTimeout(() => {
            app.hideLoading()
          }, 10)
        } else {
          app.showToast(res.message)
        }
      })
    },

    // 单聊详情
    getData() {
      app.showLoading()
      let that = this
      let data = {
        detailid: that.detailId,
        type: parseInt(that.chatType)
      }
      app.contactInfo(data, (res) => {
        // console.log(res);
        if (res.code == 0) {
          // 成员详情
          that.pageData.members = [
            {
              name: res.info.Name,
              image: res.info.Image,
              userid: res.info.Userid,
              chatType: res.info.Type,
              type: res.info.Type
            }
          ]
          // 免打扰状态
          if (res.info.Level == 0) {
            that.pageData.levelBol = false
          } else {
            that.pageData.levelBol = true
          }
          that.pageLoad = true
          app.hideLoading()
        } else {
          app.showToast(res.message)
        }
      })
    },

    goCard(e) {
      // console.log(e)
      // 工作流不跳转
      if (e.type === 6) return

      uni.navigateTo({
        url: `/pages/contacts/card?peopleId=${e.userid}&chattype=${e.type}`
      })
    },

    imageError(item, index) {
      this.$set(item, 'image', '/static/img/user.png')
    },

    // 解散群
    dismiss() {
      let that = this
      that.dialogType = '1'
      that.$refs.dialogInput.open()
      if (that.pageData.owner == that.userId) {
        that.content = '解散群聊后，将不再接受此群聊信息'
      } else {
        that.content = '退出群聊后，将不再接受此群聊信息'
      }
    },

    // 清聊天记录
    clear() {
      this.dialogType = '2'
      this.$refs.dialogInput.open()
      this.content = '清空聊天记录?'
    },

    // 群二维码
    ercode() {
      uni.navigateTo({
        url: `/pages/user/ercode?type=group&name=${this.pageData.name}&groupid=${this.roomid}`
      })
    },

    // 弹框
    dialogInputConfirm(done, name) {
      if (this.dialogType == '1') {
        app.showLoading()
        let data = {
          roomid: this.roomid
        }
        if (this.pageData.owner == this.userId) {
          // 解散群
          app.dismiss_group(data, (res) => {
            if (res.code == 0) {
              // 清本地历史
              this.delTableData()
              uni.showToast({
                title: '解散群成功',
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
            } else {
              app.showToast(res.message)
            }
          })
        } else {
          // 退出群
          app.quit_member(data, (res) => {
            if (res.code == 0) {
              // 清本地历史
              this.delTableData()
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
            } else {
              app.showToast(res.message)
            }
          })
        }
      } else {
        // 清本地历史
        this.delTableData()
        setTimeout(() => {
          uni.showToast({
            title: '记录已清空',
            mask: true,
            success() {
              done()
            }
          })
        }, 50)
      }
    },

    // 清除本地 历史记录 和 列表
    async delTableData() {
      try {
        await DB.deleteTableData('chatlist', 'roomid', this.roomid)
        // console.log("列表删除")
        // 刷新联系人列表
        getApp().getContactList('update')
      } catch (error) {
        console.log('删除失败', error)
      }

      try {
        await DB.deleteTableData('history', 'roomid', this.roomid)
        // console.log("历史记录删除")
        let pages = getCurrentPages()
        let page = pages[pages.length - 2]
        // 修改数据
        page.$vm.msgList = []
      } catch (error) {
        console.log('删除失败', error)
      }
    },

    // 群加人
    room_add(e) {
      if (e == 'people') {
        let member = JSON.stringify(this.pageData.members)
        uni.navigateTo({
          url: `creat?id=${this.roomid}&type=change&member=${member}`
        })
      } else {
        uni.navigateTo({
          url: `creat?id=${this.roomid}&type=add`
        })
      }
    },

    // 群删人
    room_del() {
      uni.navigateTo({
        url: `creat?id=${this.roomid}&type=del`
      })
    },

    // 更改消息免打扰
    switchChange(e) {
      let data = {}
      if (this.chatType == '5') {
        data.detailid = this.roomid
      } else {
        data.detailid = this.detailId
      }
      data.type = parseInt(this.chatType)
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

    // 运行位置
    runBtn() {
      uni.navigateTo({
        url: `/pages/chat/run_position?id=${this.roomid}&site=${this.pageData.site}`
      })
    },

    // 显示改名弹框
    changeName() {
      if (this.pageData.owner == this.userId) {
        this.maskBol = true
      }
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
        roomid: that.roomid,
        name: that.inputName
      }
      // console.log(data);
      app.set_group_name(data, (res) => {
        if (res.code == 0) {
          // 刷新联系人列表
          getApp().getContactList('update')
          uni.showToast({
            title: '改名成功',
            mask: true,
            success() {
              setTimeout(() => {
                that.maskBol = false
                that.getInfo()
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
  min-height: 100vh;
  background: #f3f4f8;

  // 外层
  .wrap {
    padding: 22rpx 40rpx;
    box-sizing: border-box;

    // 对话人展示
    .people-wrap {
      display: flex;
      flex-wrap: wrap;
      padding: 30rpx 0;
      box-sizing: border-box;
      box-shadow: 0px 2rpx 10rpx 0px rgba(241, 241, 241, 0.5);
      border-radius: 20rpx;
      background: #ffffff;

      .people-item {
        width: 25%;
        text-align: center;
        overflow: hidden;
        margin-top: 40rpx;

        &:nth-of-type(-n + 4) {
          margin-top: 0;
        }

        &-img {
          width: 100rpx;
          height: 100rpx;
          border-radius: 100%;
        }

        &-text {
          color: #676767;
          font-size: 24rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
      }
    }

    // 中间内容
    .center-wrap {
      padding: 0 40rpx;
      box-sizing: border-box;
      margin-top: 20rpx;
      border-radius: 20rpx;
      box-shadow: 0px 2rpx 10rpx 0px rgba(241, 241, 241, 0.5);
      background: #ffffff;

      .center-box {
        height: 98rpx;
        color: #252525;
        font-size: 32rpx;
        border-bottom: 2rpx solid #f3f4f8;

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

        .img {
          width: 40rpx;
          height: 40rpx;
        }
      }
    }

    // 底部按钮
    .btn-wrap {
      position: fixed;
      right: 0;
      bottom: 40rpx;
      padding: 0 40rpx;
      box-sizing: border-box;
      width: 100%;

      .btn {
        color: #fb5151;
        height: 80rpx;
        line-height: 80rpx;
        font-size: 32rpx;
        text-align: center;
        border-radius: 20rpx;
        box-shadow: 0px 2rpx 10rpx 0px rgba(241, 241, 241, 0.5);
        background: #ffffff;
      }
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
}
</style>
