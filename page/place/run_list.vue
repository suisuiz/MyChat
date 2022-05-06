<!--
 * @Descripttion: 场所运行群名单
 * @Author: SUI
 * @Company: chorustek
 * @Date: 2021-06-15 14:34:27
 * @Version: 1.0.0
 * @LastEditors: SUI
 * @LastEditTime: 2021-08-30 10:59:40
 * @FilePath: \things\pages\place\run_list.vue
-->
<template>
  <view v-if="pageLoad" class="page">
    <!-- 运行名单 -->
    <view class="contacts-list" v-if="placeList.length != 0">
      <view class="wrap uni-flex-jus" v-for="(item, index) in placeList" :key="'A' + index">
        <view class="wrap-box uni-flex-ali">
          <!-- 拼群聊头像 -->
          <view class="img_wrap" :class="item.member.length == 2 ? 'uni-flex-ali' : item.member.length > 2 ? 'img_wrap2' : ''">
            <block v-if="item.member.length == 1">
              <image v-for="(keys, ind) in item.member" :key="ind" class="avatarImg" mode="aspectFill" :src="keys.image" @error="imageError(item)"></image>
            </block>
            <block v-for="(keys, ind) in item.member" :key="ind" v-else-if="item.member.length == 2">
              <image class="avatarImg2" mode="aspectFill" :src="keys.image" @error="imageError(keys)"></image>
            </block>
            <block v-for="(keys, ind) in item.member" :key="ind" v-else-if="item.member.length == 3">
              <image class="avatarImg3" mode="aspectFill" :src="keys.image" @error="imageError(keys)"></image>
            </block>
            <block v-for="(keys, ind) in item.member" :key="ind" v-else>
              <image class="avatarImg3" mode="aspectFill" :src="keys.image" @error="imageError(item)"></image>
            </block>
          </view>

          <view class="right">
            <view class="name uni-flex-ali">
              <text>{{ item.name }}</text>
            </view>
          </view>
        </view>
      </view>
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
      pageLoad: false,
      placeList: []
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
    // 场所运行名单
    getData() {
      let data = {
        siteid: this.id
      }
      app.showLoading()
      app.list_site_chat(data, (res) => {
        if (res.code == 0) {
          console.log('名单', res.data)
          this.placeList = res.data
          this.pageLoad = true
          app.hideLoading()
        } else {
          app.showToast(res.message)
        }
      })
    },

    imageError(item, index) {
      this.$set(item, 'image', '/static/img/user.png')
    }
  }
}
</script>

<style scoped lang="scss">
.page {
  min-height: 100vh;

  // 运行名单
  .contacts-list {
    padding: 22rpx 40rpx 0;
    box-sizing: border-box;

    .wrap {
      position: relative;
      margin-bottom: 40rpx;

      &-box {
        .img_wrap {
          width: 90rpx;
          height: 90rpx;
          margin-right: 30rpx;
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

        .right {
          flex: 1;

          .name {
            margin-right: 20rpx;
            color: #2f2f2e;
            font-size: 32rpx;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
          }
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
}
</style>
