<!--
 * @Descripttion: 共享设备、公开设备
 * @Author: SUI
 * @Company: chorustek
 * @Date: 2021-06-07 09:42:00
 * @Version: 1.0.0
 * @LastEditors: SUI
 * @LastEditTime: 2021-08-30 10:54:50
 * @FilePath: \things\pages\contacts\device.vue
-->
<template>
  <view v-if="pageLoad" class="page">
    <!-- 设备列表 -->
    <view class="contacts-list" v-if="deviceList.length != 0">
      <view class="wrap uni-flex-jus" v-for="(item, index) in deviceList" :key="index" @click="bindClick(item)">
        <view class="wrap-box" :class="titleNViewBol && !item.status ? 'change' : ''">
          <image class="img" :src="item.image" mode="" @error="imageError(item)"></image>
          <view class="right">
            <view class="name" :class="type == 'share' ? 'uni-flex-ali' : ''">
              <text>{{ item.name }}</text>
              <block v-if="type == 'share'">
                <image class="img" v-if="item.type == 1" src="/static/img/device/devicelist_share1.png" mode=""></image>
                <image class="img" v-else src="/static/img/device/devicelist_share2.png" mode=""></image>
              </block>
            </view>
            <block v-if="type == 'share'">
              <view class="little" v-if="item.status">设备共享给：{{ item.to_name }}</view>
              <view class="little" v-else>设备来源：{{ item.from_name }}</view>
            </block>
            <view class="little" v-else>设备来源：{{ item.from }}</view>
          </view>
        </view>
        <!-- 点击右上角显示 -->
        <block v-if="titleNViewBol && item.status">
          <uni-icons v-if="!item.checked" type="checkbox-filled" color="#E2E2E2" size="18" />
          <uni-icons v-else type="checkbox-filled" color="#EF4B5B" size="18" />
        </block>
      </view>
    </view>

    <!-- 空空如也 -->
    <view class="not-wrap uni-flex-center" v-else>
      <view class="not-box uni-column-center">
        <image class="img" src="/static/img/kong.png" mode=""></image>
        <text>暂无内容</text>
      </view>
    </view>

    <!-- 确认取消 -->
    <view class="save-btn uni-flex-center" v-if="titleNViewBol">
      <view class="btn uni-flex-center" :class="selectarr.length == 0 ? 'opacity' : ''" @click="confirm">确认取消</view>
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
      // 设别列表
      deviceList: [],
      type: '',
      // 区分右上角状态
      titleNViewBol: false,
      // 选择的设备
      selectarr: []
    }
  },
  onLoad({ type }) {
    let title = ''
    if (type == 'share') {
      title = '共享设备'
    } else {
      title = '公开设备'
    }
    this.type = type
    uni.setNavigationBarTitle({
      title: title
    })
    this.getData()
  },

  // 点击右上角三个点
  onNavigationBarButtonTap() {
    if (this.deviceList.length > 0) {
      if (!this.titleNViewBol) {
        // #ifdef APP-PLUS
        this.titleNViewBol = true
        var currentWebview = this.$mp.page.$getAppWebview()
        var tn = currentWebview.getStyle().titleNView
        tn.buttons[0].text = '全选'
        tn.buttons[0].width = '65px'
        currentWebview.setStyle({
          titleNView: tn
        })
        // #endif
      } else {
        // 全选
        this.chooseDevice()
      }
    }
  },

  methods: {
    // 全选设备
    chooseDevice() {
      let select = []
      this.deviceList.map((item) => {
        item.checked = true
        if (item.checked && item.status) {
          select.push(item)
        }
      })
      this.selectarr = select
    },

    // 获取设备列表
    getData() {
      app.showLoading()
      // #ifdef APP-PLUS
      var currentWebview = this.$mp.page.$getAppWebview()
      var tn = currentWebview.getStyle().titleNView
      // #endif
      if (this.type == 'share') {
        // #ifdef APP-PLUS
        tn.buttons[0].text = '取消共享'
        // #endif
        app.shared_device({}, (res) => {
          if (res.code == 0) {
            console.log('共享', res.data)
            if (res.data && res.data.length > 0) {
              res.data.map((item) => {
                item.checked = false
              })
            } else {
              // #ifdef APP-PLUS
              tn.buttons[0].text = ''
              // #endif
            }
            currentWebview.setStyle({
              titleNView: tn
            })
            this.deviceList = res.data
            this.titleNViewBol = false
            this.pageLoad = true
            app.hideLoading()
          } else {
            app.showToast(res.message)
          }
        })
      } else {
        // #ifdef APP-PLUS
        tn.buttons[0].text = '取消公开'
        // #endif
        app.sharing_device({}, (res) => {
          if (res.code == 0) {
            console.log('公开', res.data)
            if (res.data && res.data.length > 0) {
              res.data.map((item) => {
                item.checked = false
              })
            } else {
              // #ifdef APP-PLUS
              tn.buttons[0].text = ''
              // #endif
            }
            currentWebview.setStyle({
              titleNView: tn
            })
            this.deviceList = res.data
            this.titleNViewBol = false
            this.pageLoad = true
            app.hideLoading()
          } else {
            app.showToast(res.message)
          }
        })
      }
    },

    imageError(item, index) {
      this.$set(item, 'image', '/static/img/user.png')
    },

    // 点击设备
    bindClick(item) {
      if (!this.titleNViewBol) {
        uni.redirectTo({
          url: `/pages/chat/room/chat?roomid=${item.roomid}&title=${item.name}&chattype=4&receiveid=${item.deviceid}`
        })
      } else {
        this.selectDevice(item)
      }
    },

    // 选择设备
    selectDevice(item) {
      if (item.status) {
        var checked = !item.checked
        this.$set(item, 'checked', checked)
      }

      let select = []
      this.deviceList.map((item) => {
        if (item.checked && item.status) {
          select.push(item)
        }
      })
      this.selectarr = select
    },

    // 确认取消
    confirm() {
      // console.log(this.selectarr);
      if (this.selectarr.length == 0) {
        return
      }
      if (this.type == 'open') {
        this.cancel_open()
      } else {
        this.cancel_share()
      }
    },

    // 取消公开设备
    cancel_open() {
      app.showLoading()
      let arr = this.selectarr.map((item) => item.deviceid)
      let data = {
        device_list: arr
      }
      app.cancel_device_open(data, (res) => {
        if (res.code == 0) {
          this.selectarr = []
          this.getData()
          app.hideLoading()
        } else {
          app.showToast(res.message)
        }
      })
    },

    // 取消共享设备
    cancel_share() {
      app.showLoading()
      let arr = []
      this.selectarr.map((item) => {
        let obj = {
          deviceid: item.deviceid,
          friendid: item.to_userid
        }
        arr.push(obj)
      })
      let data = {
        device_list: arr
      }
      console.log(data)
      app.cancel_device_share(data, (res) => {
        if (res.code == 0) {
          this.selectarr = []
          this.getData()
          app.hideLoading()
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
  background: #ffffff;

  /* 设备列表 */
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
          height: 80rpx;
          // background: #EF4B5B;

          .name {
            color: #2f2f2e;
            font-size: 32rpx;
            // overflow: hidden;
            // text-overflow: ellipsis;
            // display: -webkit-box;
            // -webkit-line-clamp: 1;
            // -webkit-box-orient: vertical;

            .img {
              margin-left: 10rpx;
              width: 32rpx;
              height: 32rpx;
            }
          }

          .little {
            color: #a4a4a4;
            font-size: 24rpx;
          }
        }
      }

      .change {
        opacity: 0.56;
      }
    }
  }

  // 取消按钮
  .save-btn {
    position: fixed;
    bottom: 68rpx;
    width: 100%;

    .btn {
      width: 500rpx;
      height: 80rpx;
      color: #ffffff;
      font-size: 32rpx;
      border-radius: 8rpx;
      background: #ef4b5b;
      z-index: 999;
    }

    .opacity {
      opacity: 0.6;
      background: #a4a4a4;
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
