<!--
 * @Descripttion: 运行位置
 * @Author: SUI
 * @LastEditors: SUI
 * @LastEditTime: 2022-05-08 11:57:12
 * @FilePath: \MyChat\pages\user\run.vue
-->
<template>
  <view v-if="pageLoad" class="page">
    <!-- 运行位置 -->
    <view class="wrap">
      <view class="box">
        <view class="item uni-flex-jus" @click="choose(1)">
          <text>云端</text>
          <view class="uni-flex-ali">
            <uni-icons v-if="checked" type="circle-filled" color="#EF4B5B" size="16" />
            <uni-icons v-if="!checked" type="circle-filled" color="#C6CCDA" size="16" />
          </view>
        </view>
        <view class="item uni-flex-jus" @click="choose(2)">
          <text>本地</text>
          <view class="uni-flex-ali">
            <text class="text">{{ siteName }}</text>
            <uni-icons v-if="checked2" type="circle-filled" color="#EF4B5B" size="16" />
            <uni-icons v-if="!checked2" type="circle-filled" color="#C6CCDA" size="16" />
          </view>
        </view>
      </view>
    </view>

    <!-- 选择本地运行弹框 -->
    <view class="mask-wrap uni-flex-center" v-if="maskBol">
      <view class="close" @click="maskBol = false"></view>
      <view class="wrap uni-column-center" @click.stop="maskBol = false">
        <view class="mask-box">
          <scroll-view :class="placeList.length > 2 ? 'scroll_wrap3' : placeList.length == 2 ? 'scroll_wrap2' : 'scroll_wrap1'" scroll-y="true" v-if="placeList.length != 0">
            <view class="item uni-flex-jus" v-for="(item, index) in placeList" :key="index" @click.stop="change(index)">
              <text>{{ item.name }}</text>
              <uni-icons v-if="item.checked" type="checkbox-filled" color="#EF4B5B" size="16" />
              <uni-icons v-if="!item.checked" type="checkbox-filled" color="#C6CCDA" size="16" />
            </view>
          </scroll-view>
          <view class="item uni-flex-jus" @click.stop="creatPlace">新建场所</view>
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
      // 云端Bol
      checked: true,
      // 本地Bol
      checked2: false,
      // 场所列表
      placeList: [],
      siteName: '',
      siteNameOld: '',
      maskBol: false
    }
  },
  onLoad({ site }) {
    if (typeof site != 'undefined') {
      if (site == '云端') {
        this.checked = true
        this.checked2 = false
      } else {
        this.siteName = site
        this.siteNameOld = site
        this.checked = false
        this.checked2 = true
      }
    }
  },

  onShow() {
    this.getData()
  },

  methods: {
    // 获取场所列表
    getData() {
      app.showLoading()
      app.list_site_contact({}, (res) => {
        if (res.code == 0) {
          res.data.map((item) => {
            item.checked = false
            if (item.name == this.siteName) {
              item.checked = true
            }
          })
          this.placeList = res.data
          this.pageLoad = true
          app.hideLoading()
        } else {
          app.showToast(res.message)
        }
      })
    },

    // 点击位置
    choose(index) {
      if (index == 1) {
        this.setGroupRun('云端')
      } else {
        this.maskBol = true
      }
    },

    // 选择本地运行环境
    change(index) {
      this.placeList.map((item) => {
        item.checked = false
      })
      this.placeList[index].checked = true
    },

    // 新建场所
    creatPlace() {
      uni.navigateTo({
        url: '/pages/place/creat_place?type=creat'
      })
    },

    // 确认
    saveBtn() {
      let siteId = ''
      let siteName = ''
      this.placeList.map((item) => {
        if (item.checked) {
          siteId = item.siteid
          siteName = item.name
        }
      })
      if (siteId) {
        this.setGroupRun(siteName, siteId)
      } else {
        this.maskBol = false
      }
    },

    // 设置群运行环境
    setGroupRun(siteName, siteid) {
      app.showLoading()
      let data = {}
      if (siteid) {
        data.siteid = siteid
        data.cloud = false
      } else {
        data.siteid = ''
        data.cloud = true
      }
      // console.log(data);
      app.set_run(data, (res) => {
        if (res.code == 0) {
          console.log(res.data)
          this.siteName = siteName
          uni.setStorageSync('localAddress', res.data)
          uni.setStorageSync('site', siteName)
          app.hideLoading()
          if (this.siteNameOld != siteName) {
            // 更新下websocket
            getApp().clearSocket2()
            // getApp().WEBSOCKET2()
          }
          uni.navigateBack({
            delta: 1
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

  .wrap {
    padding: 22rpx 40rpx 0;
    box-sizing: border-box;

    .box {
      padding: 0 40rpx;
      box-sizing: border-box;
      box-shadow: 0px 2rpx 10rpx 0rpx rgba(241, 241, 241, 0.5);
      border-radius: 20rpx;
      background: #ffffff;

      .item {
        height: 100rpx;
        color: #252525;
        font-size: 32rpx;
        border-top: 2rpx solid #f3f4f8;

        .text {
          margin-right: 20rpx;
        }
      }
    }
  }

  // 本地运行
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

    .wrap {
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
