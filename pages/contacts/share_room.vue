<!--
 * @Descripttion: 分享到群--展示群列表
 * @Author: SUI
 * @Company: chorustek
 * @Date: 2020-10-22 11:28:02
 * @Version: 1.0.0
 * @LastEditors: SUI
 * @LastEditTime: 2021-10-08 15:43:27
 * @FilePath: \things\pages\contacts\share_room.vue
-->
<template>
  <view class="body" v-if="pageLoad">
    <!-- 群聊列表 -->
    <view class="contacts-list" v-if="contactsList.length != 0">
      <view v-for="(item, index) in contactsList" :key="index">
        <view class="contacts-list-letter" :class="'contacts-letter' + item.letter">
          {{ item.letter }}
        </view>
        <view class="contacts-list-box uni-flex-jus" v-for="(key, i) in item.list" :key="i" @click="bindClick(key)" hover-class="bg-light">
          <view class="content uni-flex-ali">
            <!-- 拼群聊头像 -->
            <view class="img_wrap" :class="key.member.length == 2 ? 'uni-flex-ali' : key.member.length > 2 ? 'img_wrap2' : ''">
              <block v-if="key.member.length == 1">
                <image v-for="(keys, ind) in key.member" :key="ind" class="avatarImg" mode="aspectFill" :src="keys.image" @error="imageError(keys)"></image>
              </block>
              <block v-for="(keys, ind) in key.member" :key="ind" v-else-if="key.member.length == 2">
                <image class="avatarImg2" mode="aspectFill" v-if="keys.delete == false" :src="keys.image" @error="imageError(keys)"></image>
              </block>
              <block v-for="(keys, ind) in key.member" :key="ind" v-else-if="key.member.length == 3">
                <image class="avatarImg3" mode="aspectFill" v-if="keys.delete == false" :src="keys.image" @error="imageError(keys)"></image>
              </block>
              <block v-for="(keys, ind) in key.member" :key="ind" v-else>
                <image class="avatarImg3" mode="aspectFill" v-if="keys.delete == false" :src="keys.image" @error="imageError(keys)"></image>
              </block>
            </view>
            <!-- 群聊名称 -->
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
          <view class="title">分别发送给:</view>
          <view class="select-wrap uni-flex">
            <view class="uni-column uni-flex-ali select-box" v-for="(item, index) in showSelect" :key="index">
              <view class="img">
                <image class="img" :src="item.member[0].image" mode="" @error="imageError(key)"></image>
              </view>
              <view class="text">{{ item.name }}</view>
            </view>
          </view>
          <view class="content">[名片]{{ shareObj.shareName }}</view>
          <input class="input" type="text" placeholder="给朋友留言" v-model="inputValue" />
        </view>
        <!-- 操作按钮 -->
        <view class="operation uni-flex">
          <view class="uni-flex-item uni-flex-center" @click="mask = false">取消</view>
          <view class="uni-flex-item uni-flex-center" @click="confirm">发送</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
// 引入接口
let app = require('@/common/common.js')
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
      contactsList: [],
      // 选择的成员
      selectarr: [],
      showSelect: [],

      // 分享弹框
      mask: false,
      // 输入框值
      inputValue: ''
    }
  },
  onLoad({ roomid, id, name, image, type }) {
    app.showLoading()
    this.roomid = roomid
    this.shareObj['shareName'] = name
    this.shareObj['shareId'] = id
    this.shareObj['image'] = image
    this.shareObj['type'] = type
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
    // 获取联系人
    async getData() {
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
          let room = res.data.room
          room.map((item) => {
            item.list.map((key) => {
              key.checked = false
            })
          })
          // console.log('数据',res.data.room);
          this.contactsList = res.data.room
          this.pageLoad = true
          setTimeout(() => {
            app.hideLoading()
          }, 10)
        }
        // else if (res.code == 'skulk away') {
        //   console.log('读取本地', tableData)
        //   let room = tableData.room
        //   room.map((item) => {
        //     item.list.map((key) => {
        //       key.checked = false
        //     })
        //   })
        //   this.contactsList = tableData.room
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
      this.$set(item, 'member[0].image', '/static/img/user.png')
    },

    // 选择联系人
    bindClick(item) {
      var checked = !item.checked
      this.$set(item, 'checked', checked)
      let select = []
      let room = this.contactsList
      room.map((item) => {
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
      app.contactShare(data, (res) => {
        if (res.code == 0) {
          uni.showToast({
            title: '转发成功',
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
  }
}
</script>

<style scoped lang="scss">
.body {
  position: relative;
  height: 100vh;
  background: #f6f7fb;

  /* 联系人列表 */
  .contacts-list {
    margin-top: 22rpx;
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
      padding: 0 40rpx;
      box-sizing: border-box;
      height: 120rpx;

      .content {
        // 拼头像
        .img_wrap {
          width: 90rpx;
          height: 90rpx;
          margin-right: 30rpx;
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

        .title {
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
          margin-bottom: 26rpx;
          color: #a4a4a4;
          font-size: 28rpx;
        }

        .input {
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
