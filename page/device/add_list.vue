<!--
 * @Descripttion: 手动添加
 * @Author: SUI
 * @Company: chorustek
 * @Date: 2021-07-01 17:52:55
 * @Version: 1.0.0
 * @LastEditors: SUI
 * @LastEditTime: 2021-07-13 15:38:12
 * @FilePath: \things\pages\device\add_list.vue
-->

<template>
  <view class="page" v-if="pageLoad">
    <!-- 列表展示 -->
    <view class="list-wrap" v-if="pageData.length != 0">
      <view class="list-item" v-for="(item, index) in pageData" :key="index" @click="binditem(item)" @longpress="remove(item)">
        <image class="img" :src="item.image"></image>
        <text class="title">{{ item.name }}</text>
      </view>
    </view>

    <!-- 空空如也 -->
    <view class="not-wrap uni-flex-center" v-else>
      <view class="not-box uni-column-center">
        <image class="img" src="/static/img/kong.png" mode=""></image>
        <text>暂无内容</text>
      </view>
    </view>

    <!-- 删除 -->
    <uni-popup id="deldialog" ref="deldialog" type="dialog">
      <uni-popup-dialog mode="base" type="other" title=" " content="删除此应用?" @confirm="deldialog"> </uni-popup-dialog>
    </uni-popup>
  </view>
</template>

<script>
// 引入接口
let app = require('@/common/common.js')
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
      pageLoad: false,
      // 设备类别数组
      pageData: [],
      // 长按删除的ID
      delAppId: ''
    }
  },

  onShow() {
    // 设备类别列表
    this.getPageData()
  },

  methods: {
    // 添加设备类别列表
    getPageData() {
      app.showLoading()
      app.list_installed_app({}, (res) => {
        if (res.code == 0) {
          this.pageData = res.data
          this.pageLoad = true
          app.hideLoading()
        } else {
          app.showToast(res.message)
        }
      })
    },

    // 点击列表
    binditem(item) {
      // 设备是网关时候特殊处理跳转添加网关
      if (item.name == '网关') {
        uni.navigateTo({
          url: `/pages/device/add_gw?modelid=${item.appid}`
        })
      } else {
        app.showLoading()
        let data = {
          appid: item.appid
        }
        app.add_app_contact(data, (res) => {
          if (res.code == 0) {
            uni.showToast({
              title: '添加成功',
              mask: true,
              duration: 2000,
              success() {
                // 更新联系人列表
                getApp().getContactList('update')
                setTimeout(() => {
                  app.hideLoading()
                  // 跳转群聊
                  uni.redirectTo({
                    url: `/pages/chat/room/chat?roomid=${res.data.roomid}&title=${item.name}&chattype=4&receiveid=${res.data.deviceid}&more=no`
                  })
                }, 2000)
              }
            })
          } else {
            app.showToast(res.message)
          }
        })
      }
    },

    // 长按删
    remove(item) {
      this.delAppId = item.appid
      this.$refs.deldialog.open()
    },

    // 删除
    deldialog(done, name) {
      let that = this
      let data = {
        appid: this.delAppId
      }
      app.del_installed_app(data, (res) => {
        if (res.code == 0) {
          uni.showToast({
            title: '删除成功',
            mask: true,
            success() {
              done()
              setTimeout(() => {
                that.getPageData()
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
  background: #ffffff;

  // 列表展示
  .list-wrap {
    display: flex;
    flex-wrap: wrap;
    padding: 40rpx 0;
    box-sizing: border-box;

    .list-item {
      margin-top: 40rpx;
      width: 25%;
      text-align: center;
      overflow: hidden;

      &:nth-of-type(-n + 4) {
        margin-top: 0;
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
