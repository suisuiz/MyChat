<!--
 * @Descripttion: 点击右上角弹出
 * @Author: SUI
 * @Date: 2021-09-01 14:34:05
 * @LastEditors: SUI
 * @LastEditTime: 2021-12-09 18:36:25
 * @FilePath: \things\components\contents\UpperRightPlus\UpperRightPlus.vue
-->
<template>
  <view>
    <uni-transition :mode-class="['fade', 'slide-top', 'slide-right']" class="transfromClass uni-flex-center" :show="isShow" @click="isShow = false" :duration="500">
      <view class="mask_wrap">
        <view class="mask_top">
          <view class="add_box_item uni-flex-ali" @tap="addMember">
            <image class="icons" src="/static/img/plus/member.png" mode=""></image>
            <text class="hboder">添加好友</text>
          </view>
          <view class="add_box_item uni-flex-ali" @tap="creatChat">
            <image class="icons" src="/static/img/plus/group.png" mode=""></image>
            <text class="hboder">新建群聊</text>
          </view>
          <view class="add_box_item uni-flex-ali" @tap="creatPlace">
            <image class="icons" src="/static/img/plus/place.png" mode=""></image>
            <text class="hboder">新建场所</text>
          </view>
          <view class="add_box_item uni-flex-ali" @tap="scanCode">
            <image class="icons" src="/static/img/plus/scan.png" mode=""></image>
            <text>扫一扫</text>
          </view>
        </view>
        <view class="mask_view" @tap="isShow = false" catchtouchmove="preventTouchMove"></view>
      </view>
    </uni-transition>
  </view>
</template>

<script>
// 引入接口
let app = require('@/common/common.js')
export default {
  name: 'UpperRightPlus',
  props: {
    show: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isShow: this.show
    }
  },

  created() {},

  destroy() {},

  methods: {
    preventTouchMove() {},
    // 添加好友/联系人
    addMember() {
      /*
       *	type
       * 	add 添加联系人
       * 	new 新的联系人
       */
      this.isShow = false
      this.handChildTap()
      uni.navigateTo({
        url: `/pages/contacts/add_contacts?type=add`
      })
    },

    // 发起群聊
    creatChat() {
      this.isShow = false
      this.handChildTap()
      uni.navigateTo({
        url: '/pages/chat/creat'
      })
    },

    // 新建场所
    creatPlace() {
      this.isShow = false
      this.handChildTap()
      uni.navigateTo({
        url: '/pages/place/creat_place'
      })
    },

    // 扫一扫
    scanCode() {
      let that = this
      that.isShow = false

      uni.scanCode({
        success: (res) => {
          console.log(res.result)
          // 调接口获取 类型、ID
          let data = {
            barcode: res.result
          }
          // 扫描添加
          app.scanContact(data, (res) => {
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
    },

    // 向父组件传值
    handChildTap() {
      this.isShow = false
      this.$emit('childTap', false)
    }
  }
}
</script>

<style lang="scss" scoped>
// 右上角
.transfromClass {
  position: fixed;
  bottom: 0;
  top: 0;
  left: 0;
  right: 0;
  z-index: 99999;

  .mask_wrap {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    z-index: 999;

    .mask_top {
      position: absolute;
      top: 18rpx;
      right: 16rpx;
      padding-left: 36rpx;
      box-sizing: border-box;
      border-radius: 8rpx;
      box-shadow: 0px -2rpx 10rpx 0px rgba(241, 241, 241, 0.5);
      background: #4c4c4c;

      .add_box_item {
        height: 106rpx;
        line-height: 106rpx;
        width: 100%;
        color: #ffffff;
        font-size: 32rpx;

        text {
          margin-left: 16rpx;
          width: 178rpx;
        }

        &:first-child {
          margin: 0;
        }

        .icons {
          width: 48rpx;
          height: 48rpx;
          margin-right: 10rpx;
        }
      }
    }

    .mask_top:before {
      content: '';
      position: absolute;
      right: 20rpx;
      top: -20rpx;
      border-left: 16rpx solid transparent;
      border-right: 16rpx solid transparent;
      border-bottom: 20rpx solid #4c4c4c;
    }

    .mask_view {
      width: 100%;
      height: 100%;
    }

    .hboder {
      border-bottom: 1px solid #5e5e5e;
    }
  }
}
</style>
