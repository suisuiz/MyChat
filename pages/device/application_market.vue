<!--
 * @Descripttion: 应用市场
 * @Author: SUI
 * @Company: chorustek
 * @Date: 2021-07-02 11:48:55
 * @Version: 1.0.0
 * @LastEditors: SUI
 * @LastEditTime: 2021-12-21 14:47:14
 * @FilePath: \things\pages\device\application_market.vue
-->
<template>
  <view class="page" v-if="pageLoad">
    <!-- 搜索框 -->
    <view class="search-wrap">
      <view class="search-box">
        <view class="box uni-flex-center" @click="toSearch"> <uni-icons color="#8E8E93" class="uni-searchbar__box-icon-search" size="14" type="search" /><text>搜索</text> </view>
      </view>
    </view>

    <!-- 服务号 -->
    <!-- <uni-icons type="forward" color="#9E9C9E" size="16" /> -->
    <!-- <view class="padding">
      <view class="item-title uni-flex-jus" v-if="pageData.server.length != 0">
        <view class="title">服务号</view>
      </view>
    </view>
    <view class="app_wrap">
      <scroll-view class="app_wrap-box" scroll-x>
        <view class="app_item" v-for="(item, index) in pageData.server" :key="index">
          <image class="img img2" :src="item.image" @error="imageError(item)"></image>
          <view class="text">{{ item.name }}</view>
          <view class="uni-flex-center status-new" @tap.stop="goServiceChat(item)">关注</view>
        </view>
      </scroll-view>
    </view> -->

    <!-- 联系人 -->
    <view class="padding">
      <view class="item-title uni-flex-jus" v-if="pageData.app.length != 0" @click="appList">
        <view class="title">联系人</view>
        <!-- <uni-icons type="forward" color="#9E9C9E" size="16" /> -->
      </view>
    </view>
    <view class="app_wrap">
      <!-- <scroll-view class="app_wrap-box" scroll-x> -->
      <view>
        <view class="app_item" v-for="(item, index) in pageData.app" :key="index" @tap.stop="info(item.appid)">
          <image class="img" :src="item.image" @error="imageError(item)"></image>
          <view class="text">{{ item.name }}</view>
          <view class="uni-flex-center status-new" @tap.stop="goPersonChat(item)">添加</view>
        </view>
      </view>
      <!-- </scroll-view> -->
    </view>

    <!-- 工作流 -->
    <view class="padding">
      <view class="item-title" v-if="pageData.workflow.length != 0">
        <view class="title">工作流</view>
      </view>
    </view>
    <view class="padding">
      <view v-for="(item, index) in pageData.workflow" :key="index" class="item-box uni-flex-jus" @tap.stop="info(item.appid)">
        <view class="left uni-flex-ali">
          <image class="img" :src="item.image" mode="" @error="imageError(item)"></image>
          <view style="flex: 1">
            <view class="name">{{ item.name }}</view>
            <view class="content">{{ item.desc }}</view>
          </view>
        </view>
        <view class="uni-flex-center status-new" @tap.stop="download(item)">添加</view>
      </view>
    </view>
    <view style="height: 26rpx"></view>
  </view>
</template>

<script>
// 引入接口
let app = require('@/common/common.js')
export default {
  data() {
    return {
      pageLoad: false,
      pageData: {
        server: [],
        app: [],
        workflow: []
      }
    }
  },

  onShow() {
    this.getPage()
  },

  methods: {
    // 获取页面数据
    getPage() {
      let that = this
      app.showLoading()
      //  0全部 1轻应用 2工作流
      let data = { apptype: 0 }
      app.list_all_appstore(data, (res) => {
        if (res.code == 0) {
          // 应用显示前4个,工作流显示全部
          // console.log(res.data)
          that.pageData = {
            server: res.data.service,
            app: res.data.app,
            workflow: res.data.workflow
          }
          that.pageLoad = true
          app.hideLoading()
        } else {
          app.showToast(res.message)
        }
      })
    },

    // 图片显示失败
    imageError(item) {
      this.$set(item, 'image', '/static/img/user.png')
    },

    // 搜索
    toSearch() {
      uni.navigateTo({
        url: '/pages/index/search?type=app'
      })
    },

    // 展示全部
    appList() {
      // uni.navigateTo({
      //   url: `/pages/device/appslist`
      // })
    },

    // 市场详情
    info(appid) {
      // uni.navigateTo({
      //   url: `/pages/device/application_card?appid=${appid}`
      // })
    },

    // 关注服务号
    goServiceChat(item) {
      console.log(item)
      app.showLoading()
      this.addService(item)
    },

    // 添加联系人
    goPersonChat(item) {
      console.log(item)
      app.showLoading()
      this.addContact(item)
    },

    // 关注服务号\管理号、跳聊天
    addService(item) {
      let data = {
        roomid: item.appid
      }
      app.follow_service(data, (res) => {
        if (res.code == 0) {
          // console.log('关注成功', res.data)
          uni.showToast({
            title: '添加成功',
            mask: true,
            duration: 2000,
            success() {
              // // 更新联系人列表
              // getApp().getContactList('update')
              setTimeout(() => {
                app.hideLoading()
                uni.redirectTo({
                  url: `/pages/chat/room/service_chat?roomid=${res.data.roomid}&title=${item.name}&chattype=5&receiveid=${res.data.detailid}&appid=${res.data.appid}&siteid=${res.data.siteid}`
                })
              }, 2000)
            }
          })
        } else {
          app.showToast(res.message)
        }
      })
    },

    // 加好友、跳聊天
    addContact(item) {
      let data = {
        appid: item.appid
      }
      app.add_app_contact(data, (res) => {
        if (res.code == 0) {
          // console.log('加好友', res.data)
          uni.showToast({
            title: '添加成功',
            mask: true,
            duration: 2000,
            success() {
              // 更新联系人列表
              getApp().getContactList('update')
              setTimeout(() => {
                app.hideLoading()
                uni.redirectTo({
                  url: `/pages/chat/room/chat?roomid=${res.data.roomid}&title=${item.name}&chattype=4&receiveid=${res.data.detailid}&more=no&appid=${res.data.appid}&siteid=${res.data.siteid}`
                })
              }, 2000)
            }
          })
        } else {
          app.showToast(res.message)
        }
      })
    },

    // 添加工作流
    download(item) {
      let that = this
      app.showLoading()
      let data = { appid: item.appid }
      app.add_app_contact(data, (res) => {
        if (res.code == 0) {
          uni.showToast({
            title: '下载成功',
            mask: true,
            success() {
              setTimeout(() => {
                app.hideLoading()
                that.getPage()
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
  position: relative;
  height: 100vh;

  // 搜索框
  .search-wrap {
    padding: 0 40rpx;
    box-sizing: border-box;

    .search-box {
      padding: 10rpx 0;
      box-sizing: border-box;

      .box {
        height: 72rpx;
        border-radius: 36rpx;
        background: #f3f4f8;

        text {
          margin-left: 8rpx;
          color: #8e8e93;
          font-size: 28rpx;
        }
      }
    }
  }

  .padding {
    padding: 0 40rpx;
    box-sizing: border-box;
  }

  // 标题
  .item-title {
    padding-bottom: 18rpx;
    box-sizing: border-box;
    color: #a4a4a4;
    border-bottom: solid 1px #f3f4f8;

    .title {
      font-size: 32rpx;
    }
  }

  // 应用
  .app_wrap {
    display: flex;
    flex-wrap: wrap;
    padding: 20rpx 0;
    box-sizing: border-box;

    .app_wrap-box {
      align-self: baseline;
      // width: 550rpx;
      width: 100%;
      white-space: nowrap;
      // background: #2f2f2e;
    }

    .app_item {
      display: inline-block;
      width: 25%;
      text-align: center;
      overflow: hidden;
      margin-top: 40rpx;

      &:nth-of-type(-n + 4) {
        margin-top: 0;
      }

      .img {
        width: 110rpx;
        height: 110rpx;
        border-radius: 100%;
      }

      .img2 {
        border-radius: 10rpx;
      }

      .text {
        display: inline-block;
        width: 75%;
        margin: 0 auto 10rpx;
        color: #2f2f2e;
        font-size: 28rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }
    }
  }

  // 工作流
  .item-box {
    margin-top: 20rpx;
    height: 120rpx;

    .left {
      flex: 1;
      margin-right: 20rpx;

      .img {
        width: 120rpx;
        height: 120rpx;
      }

      .name {
        margin-left: 30rpx;
        margin-bottom: 10rpx;
        color: #2f2f2e;
        font-size: 32rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }

      .content {
        margin-left: 30rpx;
        color: #a4a4a4;
        font-size: 28rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }
    }
  }

  .status-old {
    margin: auto;
    width: 120rpx;
    height: 60rpx;
    color: #8b6eff;
    font-size: 28rpx;
    border-radius: 8rpx;
    background: #f3f4f8;
  }

  .status-new {
    margin: auto;
    width: 120rpx;
    height: 60rpx;
    color: #ef4b5b;
    font-size: 28rpx;
    border-radius: 8rpx;
    background: #f3f4f8;
  }
}
</style>
