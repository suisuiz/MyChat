<!--
 * @Descripttion: 搜索、添加联系人
 * @Author: SUI
 * @Company: chorustek
 * @Date: 2021-03-02 15:45:39
 * @Version: 1.0.0
 * @LastEditors: SUI
 * @LastEditTime: 2021-09-29 16:09:52
 * @FilePath: \things\pages\contacts\add_contacts.vue
-->
<template>
  <view class="body">
    <block v-if="isShow">
      <!-- 切换搜索 -->
      <view class="search-wrap uni-flex-center">
        <view class="input uni-flex-center" @click="isShow = false"> <uni-icons type="search" color="#8E8E93" size="18" /><text>手机号/用户ID</text> </view>
      </view>
      <!-- 内容 -->
      <!-- <view class="add-contacts uni-flex-jus" @click="addDevice">
				<view class="uni-flex-ali">
					<image class="img" src="/static/img/contact/add.png"></image>
					<view>
						<view class="name">手动添加旧</view>
						<view class="small">选择设备具体型号</view>
					</view>
				</view>
				<uni-icons type="forward" color="#9E9C9E" size="16" />
			</view> -->
      <!-- <view class="add-contacts uni-flex-jus" @click="addDevice2">
        <view class="uni-flex-ali">
          <image class="img" src="/static/img/contact/add.png"></image>
          <view>
            <view class="name">手动添加</view>
            <view class="small">选择设备具体型号</view>
          </view>
        </view>
        <uni-icons type="forward" color="#9E9C9E" size="16" />
      </view> -->
      <view class="add-contacts uni-flex-jus" @click="scanDevice">
        <view class="uni-flex-ali">
          <image class="img" src="/static/img/contact/find.png"></image>
          <view>
            <view class="name">扫描设备</view>
            <view class="small">扫描并识别周围设备</view>
          </view>
        </view>
        <uni-icons type="forward" color="#9E9C9E" size="16" />
      </view>
      <view class="add-contacts uni-flex-jus">
        <view class="uni-flex-ali">
          <image class="img" src="/static/img/contact/nfc.png"></image>
          <view>
            <view class="name">NFC碰一碰</view>
            <view class="small">使用碰碰贴添加设备</view>
          </view>
        </view>
        <uni-icons type="forward" color="#9E9C9E" size="16" />
      </view>
      <view class="add-contacts uni-flex-jus" @click="scan">
        <view class="uni-flex-ali">
          <image class="img" src="/static/img/contact/scan.png"></image>
          <view>
            <view class="name">扫一扫</view>
            <view class="small">扫描设备二维码或者好友名片</view>
          </view>
        </view>
        <uni-icons type="forward" color="#9E9C9E" size="16" />
      </view>
    </block>
    <block v-if="!isShow">
      <!-- 搜索联系人 -->
      <view class="input-wrap uni-flex-jus">
        <view class="input-box uni-flex-jus uni-flex-item">
          <view class="uni-flex-jus uni-flex-item">
            <uni-icons color="#8E8E93" class="uni-searchbar__box-icon-search" size="16" type="search" />
            <input class="input uni-flex-item" focus type="text" v-model="searchVal" @input="noresults = false" />
          </view>
          <uni-icons
            v-if="searchVal != ''"
            color="#A9A9A9"
            size="16"
            type="clear"
            @click="
              searchVal = ''
              noresults = false
            "
          />
        </view>
        <text
          class="text"
          @click="
            noresults = false
            searchVal = ''
            isShow = true
          "
          >取消</text
        >
      </view>
      <!-- 展示搜索结果列表 -->
      <view class="search-box uni-flex-ali" v-if="searchVal != '' && noresults == false" @click="clickSearch"
        >搜索：
        <view class="value">{{ searchVal }}</view>
      </view>
      <view class="no-results uni-flex-center" v-if="noresults">该用户不存在</view>
    </block>
  </view>
</template>

<script>
let app = require('@/common/common.js')
export default {
  data() {
    return {
      isShow: true,
      searchVal: '',
      noresults: false
    }
  },
  methods: {
    // 点击搜索结果
    clickSearch() {
      let data = {
        key: this.searchVal
      }
      // 搜好友
      app.contactFind(data, (res) => {
        if (res.code == 0) {
          if (res.userid != '') {
            this.getCardData(res.userid)
          } else {
            this.noresults = true
          }
        } else {
          app.showToast(res.message)
        }
      })
    },

    // 获取卡片详情
    getCardData(id) {
      let data = {
        detailid: id,
        type: 1
      }
      app.contactInfo(data, (res) => {
        // console.log(res)
        if (res.code == 0) {
          // 是好友
          if (res.info.Friend) {
            console.log('是好友')
            uni.redirectTo({
              url: `card?peopleId=${id}`
            })
          } else {
            console.log('不是好友')
            uni.redirectTo({
              url: `add_card?peopleId=${id}&type=1`
            })
          }
        } else {
          app.showToast(res.message)
        }
      })
    },

    // // 添加设备
    // addDevice() {
    //   uni.redirectTo({
    //     url: `/pages/device/device_type`
    //   })
    // },

    // // 添加设备
    // addDevice2() {
    //   uni.redirectTo({
    //     url: `/pages/device/add_list`
    //   })
    // },

    // 扫描设备
    scanDevice() {
      uni.redirectTo({
        url: `/pages/device/scan_device`
      })
    },

    // 扫一扫
    scan() {
      let that = this
      uni.scanCode({
        success: (res) => {
          // 调接口获取 类型、ID
          let data = {
            barcode: res.result
          }
          // 扫描添加
          app.scanContact(data, (res) => {
            console.log(res)
            if (res.code == 0) {
              // console.log(res.data)
              //  调信息判断是否好友--去名片
              that.getScanData(res.data.type, res.data.id)
            } else {
              app.showToast(res.message)
            }
          })
        }
      })
    },

    // 调信息判断是否好友--去名片
    getScanData(cardType, peopleId) {
      // console.log('类别===', cardType)
      let data = {
        detailid: peopleId,
        type: parseInt(cardType)
      }
      app.contactInfo(data, (res) => {
        // console.log(res)
        if (res.code == 0) {
          // 是好友
          if (res.info.Friend) {
            uni.navigateTo({
              url: `/pages/contacts/card?peopleId=${peopleId}&chattype=${cardType}`
            })
          } else {
            uni.navigateTo({
              url: `/pages/contacts/add_card?peopleId=${peopleId}&type=${cardType}`
            })
          }
        } else {
          app.showToast(res.message)
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
view {
  font-size: 32rpx;
}

.body {
  height: 100vh;
  background: #ffffff;

  /* 搜索框样式 */
  .search-wrap {
    height: 150rpx;
    padding: 0 40rpx;
    box-sizing: border-box;
    background: #ffffff;
    border-bottom: solid 2rpx #f3f4f8;

    .input {
      width: 100%;
      height: 72rpx;
      color: #8e8e93;
      font-size: 28rpx;
      border-radius: 36rpx;
      background: #f3f4f8;

      text {
        margin-left: 14rpx;
      }
    }
  }

  /* 扫一扫 */
  .add-contacts {
    padding: 0 40rpx;
    box-sizing: border-box;
    height: 120rpx;

    .img {
      width: 80rpx;
      height: 80rpx;
      margin-right: 20rpx;
      border-radius: 10rpx;
    }

    .name {
      color: #2f2f2e;
      font-size: 32rpx;
    }

    .small {
      color: #a4a4a4;
      font-size: 24rpx;
      margin-top: 6rpx;
    }
  }

  // 搜联系人
  .input-wrap {
    height: 108rpx;
    padding: 0 40rpx;
    box-sizing: border-box;
    background: #ffffff;

    .input-box {
      padding: 0 20rpx;
      box-sizing: border-box;
      margin-right: 28rpx;
      height: 72rpx;
      border-radius: 36rpx;
      background: #f3f4f8;

      .input {
        margin-left: 8rpx;
        color: #8e8e93;
        font-size: 28rpx;
      }
    }

    .text {
      color: #5d6b92;
      font-size: 32rpx;
    }
  }

  /* 搜索结果展示 */
  .search-box {
    padding: 0 60rpx;
    box-sizing: border-box;
    color: #2f2f2e;
    font-size: 28rpx;
    height: 90rpx;
    overflow: hidden;
    background: #f3f4f8;

    .value {
      color: #5d6b92;
    }
  }

  .no-results {
    height: 160rpx;
    color: #a4a4a4;
    font-size: 28rpx;
    background: #f3f4f8;
  }
}
</style>
