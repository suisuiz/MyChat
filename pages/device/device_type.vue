<!--
 * @Descripttion: 手动添加 === 设备类型
 * @Author: SUI
 * @LastEditors: SUI
 * @LastEditTime: 2022-05-08 12:01:17
 * @FilePath: \MyChat\pages\device\device_type.vue
-->
<template>
  <view class="page" v-if="pageLoad">
    <!-- 设备列表 -->
    <view class="device-wrap">
      <scroll-view scroll-y class="aside" scroll-with-animation="true">
        <view :class="tabIndex === index ? 'menu active' : 'menu'" v-for="(item, index) in deviceTypeList" :key="index" @click="tabMenu(index)">
          {{ item.name }}
        </view>
      </scroll-view>
      <view class="item-content">
        <scroll-view class="box" :scroll-into-view="toView" scroll-y @scroll="scroll" scroll-with-animation="true">
          <view class="cate" v-for="(item, index) in deviceTypeList" :key="'A' + index" :id="'A' + index">
            <!-- <view class="header">{{item.name}}</view> -->
            <view class="device-item" v-for="(key, index) in item.list" :key="'B' + index" @click="binditem(key)">
              <image class="img" :src="key.image"></image>
              <text class="title">{{ key.name }}</text>
            </view>
            <view class="clear"></view>
          </view>
        </scroll-view>
      </view>
    </view>

    <!-- 选择网关 -->
    <view class="mask-wrap uni-flex-center" v-if="maskBol">
      <view class="close" @click="maskBol = false"></view>
      <view class="center-wrap uni-column-center" @click.stop="maskBol = false">
        <view class="mask-box">
          <scroll-view :class="gwList.length > 2 ? 'scroll_wrap3' : gwList.length == 2 ? 'scroll_wrap2' : 'scroll_wrap1'" scroll-y="true" v-if="gwList.length != 0">
            <view class="item uni-flex-jus" v-for="(item, index) in gwList" :key="index" @click.stop="change(index)">
              <text>{{ item.name }}</text>
              <uni-icons v-if="item.checked" type="checkbox-filled" color="#EF4B5B" size="16" />
              <uni-icons v-if="!item.checked" type="checkbox-filled" color="#C6CCDA" size="16" />
            </view>
          </scroll-view>
          <view class="item uni-flex-jus" @click.stop="creatGw">添加网关</view>
          <view class="save uni-flex-center" @click.stop="saveBtn">确定</view>
        </view>
        <uni-icons type="clear" color="#FFFFFF" size="30" />
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
      // 左侧scroll
      tabIndex: 0,
      toView: '',
      // 设备类别数组
      deviceTypeList: [],
      // 网关
      gwList: [],
      // 选择网关弹框
      maskBol: false,
      // 选中的设备ID
      deviceId: '',
      modelid: ''
    }
  },

  onShow() {
    // 设备类别列表
    this.getDeviceType()
    // 网关列表
    this.getGwList()
  },

  methods: {
    // 添加设备类别列表
    getDeviceType() {
      app.showLoading()
      app.list_add_device({}, (res) => {
        if (res.code == 0) {
          // console.log(res.data);
          this.deviceTypeList = res.data
          this.pageLoad = true
          app.hideLoading()
        } else {
          app.showToast(res.message)
        }
      })
    },

    // 网关列表
    getGwList() {
      app.list_gateway({}, (res) => {
        if (res.code == 0) {
          // console.log(res.data);
          res.data.map((item) => {
            item.checked = false
          })
          this.gwList = res.data
        } else {
          app.showToast(res.message)
        }
      })
    },

    // 点左侧
    tabMenu(index) {
      this.tabIndex = index
      this.toView = `A${index}`
    },

    scroll(e) {
      var scrollTop = e.detail.scrollTop, //滚动的Y轴
        h = 0,
        seletedId,
        index = 0
      this.deviceTypeList.forEach((item, i) => {
        var _h = Math.ceil(item.list.length / 3) * 87 //获取右侧内容每个部分的高度

        if (scrollTop >= h) {
          seletedId = index
        }
        h += _h
        index++
      })
      var that = this
      setTimeout(() => {
        that.tabIndex = seletedId
      }, 10)
    },

    // 点击设备
    binditem(item) {
      // console.log(item);
      if (item.gateway) {
        this.deviceId = item.id
        this.modelid = item.gateway
        this.maskBol = true
      } else {
        uni.navigateTo({
          url: `/pages/device/add_device?deviceid=${item.id}`
        })
      }
    },

    // 选择网关
    change(index) {
      this.gwList.map((item) => {
        item.checked = false
      })
      this.gwList[index].checked = true
    },

    // 添加网关
    creatGw() {
      if (this.modelid) {
        uni.navigateTo({
          url: `/pages/device/add_gw?modelid=${this.modelid}`
        })
      }
    },

    // 确认
    saveBtn() {
      let gwId = ''
      this.gwList.map((item) => {
        if (item.checked) {
          gwId = item.gatewayid
        }
      })
      if (gwId) {
        uni.navigateTo({
          url: `/pages/device/add_device?deviceid=${this.deviceId}&gwid=${gwId}`
        })
        this.maskBol = false
      } else {
        this.maskBol = false
      }
    }
  }
}
</script>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  padding-top: 22rpx;
  box-sizing: border-box;
  background: #f3f4f8;

  // 添加设备
  .device-wrap {
    height: calc(100vh - 30rpx);
    background: #ffffff;

    .aside {
      float: left;
      width: 200rpx;
      height: 100%;
      padding-bottom: 0;
      text-align: center;
      overflow: scroll;
      background: #f3f4f8;

      &::-webkit-scrollbar {
        width: 0;
      }

      .menu {
        margin-top: 4rpx;
        margin-right: 4rpx;
        height: 76rpx;
        line-height: 76rpx;
        color: #1e1e1e;
        font-size: 32rpx;
        background: #ffffff;

        &:first-child {
          margin-top: 0;
        }
      }

      .active {
        position: relative;
        overflow: hidden;
        white-space: nowrap;
        color: #ef4b5b;
        font-size: 32rpx;
        background: #eeeff1;
      }

      .active:before {
        position: absolute;
        z-index: 10;
        right: 0;
        top: calc(calc(100% - 90rpx) / 2);
        left: 0;
        height: 90rpx;
        width: 8rpx;
        content: '';
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
        background-color: #694be1;
      }
    }

    .item-content {
      float: left;
      width: calc(100% - 200rpx);
      height: 100%;

      .box {
        height: calc(100% - 20rpx);
        overflow: scroll;

        &::-webkit-scrollbar {
          width: 0;
        }

        .cate {
          display: block;
          border-bottom: solid 4rpx #f3f4f8;

          // .header {
          // 	color: #818181;
          // 	font-size: 28rpx;
          // 	padding: 20rpx;
          // }

          .device-item {
            float: left;
            padding-bottom: 40rpx;
            width: 33%;
            text-align: center;
            box-sizing: border-box;

            // 取前三个设置 padding
            &:nth-of-type(-n + 3) {
              padding-top: 50rpx;
            }

            .img {
              display: block;
              height: 100rpx;
              width: 100rpx;
              text-align: center;
              margin: 0rpx auto;
            }

            .title {
              margin: 5rpx 0;
              color: #1e1e1e;
              font-size: 20rpx;
              text-align: center;
            }
          }

          .clear {
            clear: both;
          }
        }
      }
    }
  }

  // 选择网关
  .mask-wrap {
    position: fixed;
    top: 0;
    height: 100vh;
    width: 100%;
    z-index: 99;

    .close {
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      background: rgba(88, 88, 88, 0.3);
    }

    .center-wrap {
      z-index: 100;

      .mask-box {
        margin-bottom: 50rpx;
        width: 670rpx;
        border-radius: 40rpx;
        overflow: hidden;
        background: #ffffff;

        .item {
          padding: 0 40rpx;
          box-sizing: border-box;
          height: 98rpx;
          color: #1e1e1e;
          font-size: 28rpx;
          border-bottom: 2rpx solid #f3f4f8;
        }

        .scroll_wrap1 {
          height: 98rpx;
        }

        .scroll_wrap2 {
          height: 196rpx;
        }

        .scroll_wrap3 {
          height: 300rpx;
        }

        .save {
          height: 118rpx;
          color: #ff2a2a;
          font-size: 28rpx;
        }
      }
    }
  }
}
</style>
