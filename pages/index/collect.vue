<!--
 * @Descripttion: 收藏
 * @Author: SUI
 * @LastEditors: SUI
 * @LastEditTime: 2022-05-08 12:00:34
 * @FilePath: \MyChat\pages\index\collect.vue
-->
<template>
  <view class="page" v-if="pageLoad">
    <view class="introduce_wrap">
      <view class="introduce_item" v-for="(item, index) in pagedata" :key="index" @click="preview(item)">
        <view class="introduce_item_top">
          <image class="introduce_item_img" :src="item.cover" mode=""></image>
          <view class="introduce_item_right">
            <view class="title">{{ item.name }}</view>
            <view class="size">{{ item.size }}</view>
          </view>
        </view>
        <view class="introduce_item_bottom"
          ><text>{{ item.room }}</text
          ><text>{{ item.time }}</text></view
        >
      </view>
    </view>

    <uni-popup id="dialogInput" ref="dialogInput" type="dialog">
      <uni-popup-dialog mode="base" type="other" title=" " :content="text" @confirm="dialogInputConfirm"> </uni-popup-dialog>
    </uni-popup>
  </view>
</template>

<script>
let app = require('@/common/common.js')
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
      searchVal: '',
      pagedata: [],
      text: '',
      deviceData: []
    }
  },
  onShow() {
    let that = this
    app.showLoading()
    that.getData()
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
    this.getData()
    setTimeout(() => {
      uni.stopPullDownRefresh()
    }, 1000)
  },
  methods: {
    getData() {
      // 收藏列表
      app.favorited({}, (res) => {
        if (res.code == 0) {
          this.pagedata = res.data
          this.pageLoad = true
          setTimeout(() => {
            app.hideLoading()
          }, 100)
        } else {
          app.showToast(res.message)
        }
      })
    },
    search(res) {
      uni.showToast({
        title: '搜索：' + res.value,
        icon: 'none'
      })
    },
    input(res) {
      this.searchVal = res.value
    },
    onBackPress() {
      // 仅 APP-PLUS 编译
      // #ifdef APP-PLUS
      plus.key.hideSoftKeybord()
      // #endif
    },
    preview(item) {
      uni.previewImage({
        current: 0,
        urls: item.images
      })
    },

    dialogInputConfirm(done, name) {
      let that = this
      let data = that.deviceData
      data.thing = that.deviceData.things
      // NFC添加联系人
      app.add_contact(data, (res) => {
        if (res.code == 0) {
          uni.showToast({
            title: '添加成功',
            success() {
              setTimeout(() => {
                done()
                uni.switchTab({
                  url: '/pages/contacts/contacts'
                })
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
  background: #f5f5f5;
}

.search-wrap {
  padding: 0 32rpx;
  background: #ffffff;
  box-sizing: border-box;
}

.introduce_wrap {
  padding: 20rpx 0;
  box-sizing: border-box;
}

.introduce_item {
  height: 204rpx;
  padding: 0 56rpx;
  box-sizing: border-box;
  margin: 0 auto 20rpx;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.introduce_item_top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.introduce_item_img {
  width: 98rpx;
  height: 118rpx;
}

.introduce_item_right {
  flex: 1;
  margin-left: 22rpx;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.introduce_item_right .title {
  color: #1e1e1e;
  font-size: 32rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.introduce_item_right .size {
  color: #8f8f8f;
  font-size: 24rpx;
}

.introduce_item_bottom {
  color: #8f8f8f;
  font-size: 24rpx;
  margin-top: 16rpx;
}

.introduce_item_bottom text:nth-of-type(1) {
  margin-right: 16rpx;
}
</style>
