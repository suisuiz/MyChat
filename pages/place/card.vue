<!--
 * @Descripttion: 场所名片
 * @Author: SUI
 * @LastEditors: SUI
 * @LastEditTime: 2022-05-08 11:59:00
 * @FilePath: \MyChat\pages\place\card.vue
-->
<template>
  <view v-if="pageLoad" class="page">
    <view class="wrap">
      <!-- 信息 -->
      <view class="top_box uni-flex-ali">
        <image :src="image" mode="" @error="imageError"></image>
        <view class="nick-wrap">
          <view class="nick-name">{{ name }}</view>
        </view>
      </view>

      <!-- 内容 -->
      <view class="center-wrap">
        <view class="center-box uni-flex-jus" @click="runList">
          <text>运行名单</text>
          <uni-icons type="forward" color="#9E9C9E" size="16" />
        </view>
      </view>

      <!-- 删除 -->
      <view class="send-btn" @click="delBtn">删除</view>
      <uni-popup id="deldialog" ref="deldialog" type="dialog">
        <uni-popup-dialog mode="base" type="other" title=" " content="是否删除场所?" @confirm="deldialog"> </uni-popup-dialog>
      </uni-popup>
    </view>
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
      // ID、姓名、头像
      id: '',
      name: '',
      image: ''
    }
  },
  onLoad({ id }) {
    if (typeof id != 'undefined') {
      this.id = id
      this.getData()
    }
  },

  onShow() {},

  methods: {
    // 获取卡片详情
    getData() {
      let that = this
      // 场所传 type = 3
      let data = {
        detailid: that.id,
        type: 3
      }
      app.contactInfo(data, (res) => {
        console.log('场所名片', res)
        if (res.code == 0) {
          that.name = res.info.Name
          that.image = res.info.Image
          that.pageLoad = true
          app.hideLoading()
        } else {
          app.showToast(res.message)
        }
      })
    },

    imageError(item, index) {
      this.image = '/static/img/user.png'
    },

    // 运行名单
    runList() {
      if (this.id) {
        uni.navigateTo({
          url: `/pages/place/run_list?id=${this.id}`
        })
      }
    },

    // 删除
    delBtn() {
      this.$refs.deldialog.open()
    },

    // 确认删除
    deldialog(done, name) {
      app.showLoading()
      let data = {
        siteid: this.id
      }
      app.del_site_contact(data, (res) => {
        if (res.code == 0) {
          setTimeout(() => {
            uni.showToast({
              title: '删除成功',
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
          }, 1000)
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

    // 信息
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
      }
    }

    // 内容
    .center-wrap {
      margin-top: 20rpx;
      padding: 0 40rpx;
      box-sizing: border-box;
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
      }
    }

    // 发送消息
    .send-btn {
      margin-top: 20rpx;
      height: 90rpx;
      line-height: 90rpx;
      color: #ef495a;
      font-size: 32rpx;
      text-align: center;
      border-radius: 20rpx;
      background: #ffffff;
    }
  }
}
</style>
