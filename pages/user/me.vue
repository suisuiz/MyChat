<!--
 * @Descripttion: 我的
 * @Author: SUI
 * @Company: chorustek
 * @Date: 2020-10-15 16:33:36
 * @Version: 1.0.0
 * @LastEditors: SUI
 * @LastEditTime: 2021-09-26 08:37:07
 * @FilePath: \things\pages\user\me.vue
-->
<template>
  <view v-if="pageLoad" class="page">
    <view class="top_wrap uni-flex-jus" @tap.stop="userInfo">
      <view class="left-box uni-flex-ali">
        <image :src="headimgurl" mode="" @tap.stop="showImg"></image>
        <view class="nick-wrap uni-column-justify">
          <view class="nick-name">{{ nickname }}</view>
          <!-- <view class="nick-content">{{ btAddress }}</view> -->
        </view>
      </view>
      <view class="uni-flex-ali">
        <image class="img1" src="/static/img/me/ercode.png" mode=""></image>
        <uni-icons type="forward" color="#9E9C9E" size="16" />
      </view>
    </view>
    <view class="bottom-wrap">
      <view class="bottom-wrap-item uni-flex-jus">
        <view class="uni-flex-ali">
          <image src="/static/img/me/help.png" mode=""></image>
          <text class="left-text">帮助和反馈</text>
        </view>
      </view>
      <view class="bottom-wrap-item uni-flex-jus" @click="runBtn">
        <view class="uni-flex-ali">
          <image src="/static/img/me/site.png" mode=""></image>
          <text class="left-text">运行位置</text>
        </view>
        <view class="uni-flex-ali">
          <text class="right-text">{{ site }}</text>
          <uni-icons type="forward" color="#9E9C9E" size="16" />
        </view>
      </view>
      <view class="bottom-wrap-item uni-flex-jus" @click="clearBtn">
        <view class="uni-flex-ali">
          <image src="/static/img/me/withdraw.png" mode=""></image>
          <text class="left-text">退出登录</text>
        </view>
        <view class="uni-flex-ali">
          <uni-icons type="forward" color="#9E9C9E" size="16" />
        </view>
      </view>
      <!-- <view class="bottom-wrap-item uni-flex-jus" @click="test">
        <view class="uni-flex-ali">
          <image src="/static/img/me/withdraw.png" mode=""></image>
          <text class="left-text"></text>
        </view>
        <view class="uni-flex-ali">
          <uni-icons type="forward" color="#9E9C9E" size="16" />
        </view>
      </view> -->
    </view>

    <uni-popup id="dialogInput" ref="dialogInput" type="dialog">
      <uni-popup-dialog mode="base" type="other" title=" " :content="text" @confirm="dialogInputConfirm"> </uni-popup-dialog>
    </uni-popup>
  </view>
</template>

<script>
// 引入接口
let app = require('@/common/common.js')
// 引入封装的 sqlite
import DB from '@/common/sqlite.js'
// 弹框
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
      // 昵称、头像、蓝牙地址、运行位置
      headimgurl: '/static/img/user.png',
      nickname: '',
      btAddress: '',
      site: '',

      diaType: 'else',
      text: '',
      deviceData: []
    }
  },
  onShow() {
    let that = this
    app.showLoading()
    // 昵称、头像、蓝牙地址、运行位置
    that.nickname = uni.getStorageSync('nickname')
    that.headimgurl = uni.getStorageSync('headimgurl')
    that.btAddress = uni.getStorageSync('btAddress')
    that.site = uni.getStorageSync('site')
    that.pageLoad = true
    setTimeout(() => {
      app.hideLoading()
    }, 100)
  },
  onHide() {
    app.hideLoading()
    this.$refs.dialogInput.close()
  },
  onUnload() {
    app.hideLoading()
    this.$refs.dialogInput.close()
  },

  onPullDownRefresh() {
    setTimeout(() => {
      uni.stopPullDownRefresh()
    }, 100)
  },
  methods: {
    // 预览头像
    showImg() {
      uni.previewImage({
        indicator: 'none',
        urls: [this.headimgurl]
      })
    },

    // 个人信息
    userInfo() {
      uni.navigateTo({
        url: `info`
      })
    },

    // 运行位置
    runBtn() {
      uni.navigateTo({
        url: `run?site=${this.site}`
      })
    },

    // 退出登录
    clearBtn() {
      this.diaType = 'clear'
      this.text = `是否退出登录`
      this.$refs.dialogInput.open()
    },

    // 确认退出
    async dialogInputConfirm(done, name) {
      let that = this
      if (that.diaType == 'clear') {
        // // 清除本地 历史记录 和 列表
        // try {
        //   await DB.deleteTableData('chatlist')
        // } catch (error) {
        //   console.log('列表删除失败', error)
        // }
        // try {
        //   await DB.deleteTableData('history')
        // } catch (error) {
        //   console.log('历史记录删除失败', error)
        // }
        // try {
        //   await DB.deleteTableData('contact')
        // } catch (error) {
        //   console.log('联系人删除失败', error)
        // }

        uni.clearStorage()
        uni.clearStorageSync()
        getApp().clearSocket2()
        getApp().clearSocket()
        setTimeout(() => {
          uni.reLaunch({
            url: '/pages/user/login'
          })
        }, 100)
      } else {
        done()
      }
    },

    // 跳转小程序
    toWx() {
      console.log('跳转小程序')
      // #ifdef APP-PLUS
      plus.share.getServices(
        (res) => {
          var sweixin = null
          for (var i = 0; i < res.length; i++) {
            var t = res[i]
            if (t.id == 'weixin') {
              sweixin = t
            }
          }
          console.log('执行了')
          if (sweixin) {
            sweixin.launchMiniProgram({
              // 要跳转小程序的原始ID
              id: 'gh_6761e79cfd00',
              // 要跳转小程序的页面
              path: 'pages/index/home',
              // 微信小程序版本类型可取值： 0-正式版； 1-测试版； 2-体验版。 默认值为0。
              type: 0
            })
          }
        },
        (res) => {
          console.log(JSON.stringify(res))
        }
      )

      // #endif
    },

    test() {
      uni.navigateTo({
        url: ''
      })
    }
  }
}
</script>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  background: #f3f4f8;

  .top_wrap {
    padding: 0 40rpx;
    box-sizing: border-box;
    height: 230rpx;
    background: #ffffff;

    .left-box {
      flex: 1;
      height: 100%;

      image {
        width: 100rpx;
        height: 100rpx;
        border-radius: 100%;
      }

      .nick-wrap {
        flex: 1;
        height: 100%;
        margin-left: 20rpx;

        .nick-name {
          color: #252525;
          font-size: 32rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .nick-content {
          color: #909090;
          font-size: 32rpx;
        }
      }
    }

    .img1 {
      width: 32rpx;
      height: 32rpx;
      margin: 0 20rpx;
    }
  }

  .bottom-wrap {
    margin-top: 20rpx;
    padding: 0 40rpx;
    box-sizing: border-box;
    background: #ffffff;

    .bottom-wrap-item {
      display: flex;
      align-items: center;
      height: 120rpx;
      border-top: solid 1px #f3f4f8;

      image {
        width: 48rpx;
        height: 48rpx;
        margin-right: 20rpx;
      }

      .left-text {
        color: #1e1e1e;
        font-size: 32rpx;
      }

      .right-text {
        margin-right: 20rpx;
      }
    }

    .bottom-wrap-item:nth-of-type(1) {
      border: none;
    }
  }
}
</style>
