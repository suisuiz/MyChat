<!--
 * @Descripttion: 设备分享-联系人列表
 * @Author: SUI
 * @Company: chorustek
 * @Date: 2020-10-22 11:28:02
 * @Version: 1.0.0
 * @LastEditors: SUI
 * @LastEditTime: 2021-08-30 10:55:21
 * @FilePath: \things\pages\contacts\share.vue
-->
<template>
  <view class="body" v-if="pageLoad">
    <!-- 选择一个群 -->
    <view class="title" @click="choose" v-if="from != 'share'">选择一个群</view>
    <!-- 联系人列表 -->
    <view class="contacts-list" v-if="contactsList.length != 0">
      <view v-for="(item, index) in contactsList" :key="index">
        <view class="contacts-list-letter" :class="'contacts-letter' + item.letter">{{ item.letter }}</view>
        <view class="contacts-list-box" v-for="(key, i) in item.list" :key="i" @click="bindClick(key)" hover-class="bg-light">
          <view class="contacts-list-box-box">
            <image class="img" :src="key.image" mode="" @error="imageError(key)"></image>
            <view class="name">{{ key.name }}</view>
          </view>
          <uni-icons v-if="key.checked" type="checkbox-filled" color="#EF4B5B" size="18" />
          <uni-icons v-if="!key.checked" type="checkbox-filled" color="#E2E2E2" size="18" />
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

    <!-- 右下角按钮 -->
    <view class="complete_wrap">
      <view v-if="contactsList.length > 0" :class="changeStyle ? 'complete1' : 'complete'" @click="open">完成</view>
    </view>
    <!-- 分享弹框 -->
    <view class="mask-wrap uni-flex-center" v-if="mask">
      <view class="mask-ba" @click="mask = false"></view>
      <view class="mask-box">
        <view class="top-box">
          <view class="titles">分别发送给:</view>
          <view class="select-wrap uni-flex">
            <view class="uni-column uni-flex-ali select-box" v-for="(item, index) in showSelect" :key="index">
              <view class="img">
                <image class="img" :src="item.image" mode="" @error="imageError(key)"></image>
              </view>
              <view class="text">{{ item.name }}</view>
            </view>
          </view>
          <view class="content">[名片]{{ shareObj.shareName }}</view>
          <input class="input" type="text" placeholder="给朋友留言" v-model="inputValue" v-if="from != 'share'" />
        </view>
        <!-- 操作按钮 -->
        <view class="operation uni-flex">
          <view class="uni-flex-item uni-flex-center" @click="mask = false">取消</view>
          <block>
            <view class="uni-flex-item uni-flex-center" v-if="from != 'share'" @click="confirm">发送</view>
            <view class="uni-flex-item uni-flex-center" v-else @click="shareBtn">发送</view>
          </block>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
// 引入接口
let app = require('@/common/common.js')
// 引入方法
let { sendId, formatDate } = require('@/common/util.js')
// 引入封装的 sqlite
import DB from '@/common/sqlite.js'
export default {
  data() {
    return {
      // 控制页面展示
      pageLoad: false,
      // 分享的内容
      shareObj: {
        shareName: '',
        shareId: ''
      },

      // 控制按钮样式
      changeStyle: false,
      // 联系人列表
      allData: {
        contact: [],
        device: []
      },
      contactsList: [],
      // 选择的成员
      selectarr: [],
      showSelect: [],

      // 分享弹框
      mask: false,
      // 输入框值
      inputValue: '',
      from: '',
      shareType: ''
    }
  },
  onLoad({ roomid, id, name, image, type, from, shareType }) {
    app.showLoading()
    this.roomid = roomid
    this.shareObj['shareName'] = name
    this.shareObj['shareId'] = id
    this.shareObj['image'] = image
    this.shareObj['type'] = type
    // console.log(this.shareObj);
    // 分享设备用到  from  shareType
    this.from = from
    this.shareType = shareType
    // 建群 仅 APP-PLUS 编译
    // #ifdef APP-PLUS
    this.getData()
    // #endif

    // 直接获取数据 除了 APP-PLUS 都编译
    // #ifndef APP-PLUS
    this.pageData()
    // #endif
  },
  methods: {
    // 选择一个群
    choose() {
      uni.navigateTo({
        url: `/pages/contacts/share_room?roomid=${this.roomid}&id=${this.shareObj.shareId}&name=${this.shareObj.shareName}&image=${this.shareObj.image}&type=${this.shareObj.type}`
      })
    },

    // 获取联系人
    async getData() {
      // 查询数据库数据
      try {
        this.pageData(await DB.selectTableData('contact'))
      } catch (error) {
        console.log('查询失败', error)
      }
    },

    // 获取联系人 APP端不主动执行
    pageData(dbdata) {
      // let tableData = {}
      // if (dbdata.length != 0) {
      //   tableData = JSON.parse(dbdata[0].contact)
      // }
      app.contactList({}, (res) => {
        if (res.code == 0) {
          // 返回数据格式:
          // res.data = {
          // 	contact: [],	// 人
          // 	device: [],	// 设备
          // 	room: []	// 群
          // }

          let contact = res.data.contact
          contact.map((item, index) => {
            item.list.map((key, i) => {
              // 分享名片排除自己
              if (key.id == this.shareObj.shareId) {
                item.list.splice(i, 1)
              }
              key.checked = false
            })
            if (item.list.length == 0) {
              contact.splice(index, 1)
            }
          })

          this.allData = res.data
          this.contactsList = res.data.contact
          this.pageLoad = true
          setTimeout(() => {
            app.hideLoading()
          }, 10)
        }
        // else if (res.code == 'skulk away') {
        //   console.log('读取本地', tableData)
        //   let contact = tableData.contact
        //   contact.map((item) => {
        //     item.list.map((key) => {
        //       key.checked = false
        //     })
        //   })
        //   this.allData = tableData
        //   this.contactsList = tableData.contact
        //   this.pageLoad = true
        //   setTimeout(() => {
        //     app.hideLoading()
        //   }, 10)
        // }
        else {
          app.showToast(res.message)
        }
      })
    },

    imageError(item, index) {
      this.$set(item, 'image', '/static/img/user.png')
    },

    // 选择联系人
    bindClick(item) {
      var checked = !item.checked
      this.$set(item, 'checked', checked)
      let select = []
      let contact = this.contactsList
      contact.map((item) => {
        item.list.map((key) => {
          if (key.checked) {
            select.push(key)
          }
        })
      })
      if (select.length > 0) {
        this.changeStyle = true
      } else {
        this.changeStyle = false
      }
      this.selectarr = select
      this.showSelect = select.slice(0, 4)
    },

    open() {
      if (this.selectarr.length > 0) {
        this.mask = true
      }
    },

    // 分享 联系人、设备 名片
    confirm() {
      let that = this
      app.showLoading()
      let arr = this.selectarr.map((item) => item.id)
      let data = {
        friendid: this.shareObj.shareId,
        receivers: arr,
        comment: this.inputValue
      }
      data.type = parseInt(this.shareObj.type)
      // console.log(data);
      app.contactShare(data, (res) => {
        if (res.code == 0) {
          uni.showToast({
            title: '转发成功',
            mask: true,
            success() {
              setTimeout(() => {
                uni.navigateBack({
                  delta: 1
                })
                app.hideLoading()
              }, 1000)
            }
          })
        } else {
          app.showToast(res.message)
        }
      })
    },

    // 聊天-分享设备
    shareBtn() {
      let that = this
      app.showLoading()
      let arr = this.selectarr.map((item) => item.id)
      let data = {
        deviceid: this.shareObj.shareId,
        receivers: arr,
        type: parseInt(this.shareType)
      }
      console.log(data)
      app.share_device(data, (res) => {
        if (res.code == 0) {
          uni.showToast({
            title: '共享成功',
            mask: true,
            success() {
              setTimeout(() => {
                uni.navigateBack({
                  delta: 1
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
  }
}
</script>

<style scoped lang="scss">
.body {
  position: relative;
  height: 100vh;
  background: #f6f7fb;

  .title {
    padding-left: 40rpx;
    margin-top: 22rpx;
    margin-bottom: 20rpx;
    height: 100rpx;
    line-height: 100rpx;
    box-shadow: 0px 0px 4rpx 0px rgba(220, 220, 220, 0.5);
    background: #ffffff;
  }

  /* 联系人列表 */
  .contacts-list {
    background: #ffffff;

    &-letter {
      padding: 0 40rpx;
      height: 70rpx;
      line-height: 70rpx;
      font-size: 28rpx;
      color: #232323;
      font-weight: 400;
      box-sizing: border-box;
    }

    &-box {
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 40rpx;
      box-sizing: border-box;
      height: 120rpx;

      &-box {
        display: flex;
        align-items: center;

        .img {
          width: 90rpx;
          height: 90rpx;
          margin-right: 30rpx;
          border-radius: 100%;
        }

        .name {
          flex: 1;
          margin-right: 10rpx;
          height: 120rpx;
          line-height: 120rpx;
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

    &-name_last {
      border: none;
    }

    .bg-light {
      background: $but-click-bg;
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

  // 右下角按钮
  .complete_wrap {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 88rpx;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 0 16rpx;
    box-sizing: border-box;
    z-index: 99;

    .complete {
      color: #fff;
      width: 118rpx;
      height: 50rpx;
      line-height: 50rpx;
      text-align: center;
      background: #ef4b5b;
      border-radius: 8rpx;
      opacity: 0.4;
    }

    .complete1 {
      color: #fff;
      width: 118rpx;
      height: 50rpx;
      line-height: 50rpx;
      text-align: center;
      background: #ef4b5b;
      border-radius: 8rpx;
      opacity: 1;
    }
  }

  // 分享蒙版
  .mask-wrap {
    position: fixed;
    top: 0;
    height: 100vh;
    width: 100%;
    z-index: 100;

    .mask-ba {
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      background: rgba(88, 88, 88, 0.3);
    }

    .mask-box {
      width: 576rpx;
      // height: 504rpx;
      border-radius: 20rpx;
      background: #ffffff;
      z-index: 400;

      .top-box {
        padding: 40rpx;
        box-sizing: border-box;

        .titles {
          margin-bottom: 20rpx;
          color: #2f2f2e;
          font-size: 32rpx;
        }

        .select-wrap {
          margin-bottom: 26rpx;

          .select-box {
            width: 86rpx;
            margin-right: 36rpx;
            overflow: hidden;

            .img {
              width: 80rpx;
              height: 80rpx;
              border-radius: 100%;
            }

            .text {
              margin-top: 16rpx;
              color: #2f2f2e;
              font-size: 26rpx;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 1;
              -webkit-box-orient: vertical;
            }
          }
        }

        .content {
          color: #a4a4a4;
          font-size: 28rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }

        .input {
          margin-top: 26rpx;
          padding-left: 12rpx;
          height: 52rpx;
          // line-height: 52rpx;
          color: #b3b3b3;
          font-size: 28rpx;
          border-radius: 8rpx;
          background: #f7f7f7;
        }
      }

      .operation {
        border-top: solid 1px #f6f6f6;
        color: #252525;
        font-size: 28rpx;

        view:nth-of-type(1) {
          height: 82rpx;
          border-right: solid 1px #f6f6f6;
        }
      }
    }
  }
}
</style>
