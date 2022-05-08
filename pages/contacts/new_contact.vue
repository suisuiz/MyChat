<!--
 * @Descripttion: 新的朋友
 * @Author: SUI
 * @LastEditors: SUI
 * @LastEditTime: 2022-05-08 12:02:03
 * @FilePath: \MyChat\pages\contacts\new_contact.vue
-->
<template>
  <view v-if="pageLoad">
    <view class="new-contacts" v-if="contactNew.recent.length != 0 || contactNew.old.length != 0">
      <block v-if="contactNew.recent.length != 0">
        <view class="title">最近的</view>
        <view class="wrap">
          <view class="new-item uni-flex-jus" v-for="(item, index) in contactNew.recent" :key="'A' + index">
            <view class="left uni-flex-ali">
              <!-- 单独头像 -->
              <image class="img" :src="item.image" @error="imageError(item)" v-if="item.image"> </image>
              <!-- 拼群聊头像 -->
              <view class="img_wrap" :class="item.member.length == 2 ? 'uni-flex-ali' : item.member.length > 2 ? 'img_wrap2' : ''" v-else>
                <block v-if="item.member.length == 1">
                  <image v-for="(keys, index) in item.member" :key="index" class="avatarImg" mode="aspectFill" :src="keys.image"></image>
                </block>
                <block v-for="(keys, index) in item.member" :key="index" v-else-if="item.member.length == 2">
                  <image class="avatarImg2" mode="aspectFill" :src="keys.image"></image>
                </block>
                <block v-for="(keys, index) in item.member" :key="index" v-else-if="item.member.length == 3">
                  <image class="avatarImg3" mode="aspectFill" :src="keys.image"></image>
                </block>
                <block v-for="(keys, index) in item.member" :key="index" v-else>
                  <image class="avatarImg3" mode="aspectFill" :src="keys.image"></image>
                </block>
              </view>

              <view>
                <view class="name">{{ item.name }}</view>
                <view class="name2" v-if="item.type == '4'">{{ item.applyname }}申请设备使用权</view>
              </view>
            </view>
            <view class="uni-flex-center" :class="item.status == '接受' ? 'status-new' : 'status-old'" @click="agree(item)">
              {{ item.status }}
            </view>
          </view>
        </view>
      </block>
      <block v-if="contactNew.old.length != 0">
        <view class="title">之前的</view>
        <view class="wrap">
          <view class="new-item uni-flex-jus" v-for="(item, index) in contactNew.old" :key="'B' + index">
            <view class="left uni-flex-ali">
              <!-- 单独头像 -->
              <image class="img" :src="item.image" @error="imageError(item)" v-if="item.image"> </image>

              <!-- 拼群聊头像 -->
              <view class="img_wrap" :class="item.member.length == 2 ? 'uni-flex-ali' : item.member.length > 2 ? 'img_wrap2' : ''" v-else>
                <block v-if="item.member.length == 1">
                  <image v-for="(keys, index) in item.member" :key="index" class="avatarImg" mode="aspectFill" :src="keys.image"></image>
                </block>
                <block v-for="(keys, index) in item.member" :key="index" v-else-if="item.member.length == 2">
                  <image class="avatarImg2" mode="aspectFill" :src="keys.image"></image>
                </block>
                <block v-for="(keys, index) in item.member" :key="index" v-else-if="item.member.length == 3">
                  <image class="avatarImg3" mode="aspectFill" :src="keys.image"></image>
                </block>
                <block v-for="(keys, index) in item.member" :key="index" v-else>
                  <image class="avatarImg3" mode="aspectFill" :src="keys.image"></image>
                </block>
              </view>

              <view>
                <view class="name">{{ item.name }}</view>
                <view class="name2" v-if="item.type == '4'">{{ item.applyname }}申请设备使用权</view>
              </view>
            </view>
            <view class="status-old">{{ item.status }}</view>
          </view>
        </view>
      </block>
    </view>

    <!-- 空空如也 -->
    <view class="not-wrap uni-flex-center" v-else>
      <view class="not-box uni-column-center">
        <image class="img" src="/static/img/kong.png" mode=""></image>
        <text>暂无内容</text>
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
      // 控制页面显示
      pageLoad: false,
      // 新的好友
      contactNew: {
        recent: [],
        old: []
      }
    }
  },
  onLoad() {
    this.newContact()
  },

  methods: {
    // 新的朋友
    newContact() {
      // 隐藏 tab 小红点
      // uni.hideTabBarRedDot({ index: 1 })
      app.showLoading()
      app.contactNew((res) => {
        if (res.code == 0) {
          // console.log(res.data)
          this.contactNew = {
            recent: res.data.recent,
            old: res.data.old
          }
          this.pageLoad = true
          app.hideLoading()
        } else {
          app.showToast(res.message)
        }
      })
    },

    imageError(item, index) {
      this.$set(item, 'image', '/static/img/user.png')
    },

    // 接收朋友请求
    agree(item) {
      let that = this
      if (item.status === '接受') {
        let data = {
          applyid: item.applyid
        }
        app.contactAgree(data, (res) => {
          if (res.code == 0) {
            that.newContact()
            app.hideLoading()
          } else {
            app.showToast(res.message)
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// 新的好友
.new-contacts {
  .title {
    padding-left: 40rpx;
    box-sizing: border-box;
    height: 94rpx;
    line-height: 94rpx;
    color: #2f2f2e;
    font-size: 24rpx;
    border-top: solid 1px rgba(220, 220, 220, 0.2);
    border-bottom: solid 1px rgba(220, 220, 220, 0.2);

    &:first-child {
      height: 74rpx;
      line-height: 74rpx;
      border-top: none;
    }
  }

  .wrap {
    padding: 16rpx 0;
    box-sizing: border-box;

    // 列表
    .new-item {
      padding: 0 40rpx;
      box-sizing: border-box;
      height: 110rpx;
      background: #ffffff;

      .left {
        flex: 1;
        margin-right: 20rpx;

        .img {
          width: 90rpx;
          height: 90rpx;
          border-radius: 100%;
        }

        // 拼头像
        .img_wrap {
          width: 90rpx;
          height: 90rpx;
          border-radius: 100%;
          overflow: hidden;
          background: #f6f7fb;

          .avatarImg {
            width: 100%;
            height: 100%;
          }

          .avatarImg2 {
            width: 50%;
            height: 100%;
          }

          .avatarImg3 {
            width: 50%;
            height: 50%;
          }
        }

        .img_wrap2 {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
        }

        .name {
          margin-left: 30rpx;
          color: #2f2f2e;
          font-size: 32rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }

        .name2 {
          margin-left: 30rpx;
          color: #8e8e93;
          font-size: 24rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
      }

      .status-old {
        margin: auto;
        width: 120rpx;
        height: 60rpx;
        color: #a4a4a4;
        font-size: 28rpx;
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
</style>
