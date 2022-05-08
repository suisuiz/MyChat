<!--
 * @Descripttion: 搜索
 * @Author: SUI
 * @Company: chorustek
 * @Date: 2021-06-22 16:55:43
 * @Version: 1.0.0
 * @LastEditors: SUI
 * @LastEditTime: 2021-08-30 10:58:39
 * @FilePath: \things\pages\index\search.vue
-->
<template>
  <view>
    <view class="status_bar"></view>
    <!-- 搜索框 -->
    <view class="search-wrap">
      <view class="search-box uni-flex-center">
        <uni-icons color="#8E8E93" class="icon-search uni-flex-center" size="14" type="search" />
        <input :focus="showSync" placeholder="搜索" maxlength="100" @confirm="confirm" class="search-input" confirm-type="search" type="text" v-model="searchVal" />
        <view v-if="searchVal != ''" class="icon-clear uni-flex-center" @click="searchVal = ''">
          <uni-icons color="#8E8E93" class="" size="14" type="clear" />
        </view>
      </view>
      <text @click="cancel" class="cancel_btn">取消</text>
    </view>

    <!-- 搜索 联系人、设备、群 结果 -->
    <block v-if="contactsList.length != 0">
      <view class="contacts-box uni-flex-ali" v-for="(item, index) in contactsList" :key="index" @click="contactsClick(item)">
        <!-- 联系人、设备头像 -->
        <image class="img" v-if="item.type != 5" :src="item.image" mode="" @error="imageError(item)"></image>
        <!-- 拼群聊头像 -->
        <view class="img_wrap" v-if="item.type == 5" :class="item.members.length == 2 ? 'uni-flex-ali' : item.members.length > 2 ? 'img_wrap2' : ''">
          <block v-if="item.members.length == 1">
            <image v-for="(keys, i) in item.members" :key="i" class="avatarImg" mode="aspectFill" :src="keys.image" @error="imageError(keys)"></image>
          </block>
          <block v-else-if="item.members.length == 2">
            <image v-for="(keys, i) in item.members" :key="i" class="avatarImg2" mode="aspectFill" :src="keys.image" @error="imageError(keys)"></image>
          </block>
          <block v-else-if="item.members.length == 3">
            <image v-for="(keys, i) in item.members" :key="i" class="avatarImg3" mode="aspectFill" :src="keys.image" @error="imageError(keys)"></image>
          </block>
          <block v-else-if="item.members.length > 3">
            <image v-for="(keys, i) in item.members" :key="i" class="avatarImg3" mode="aspectFill" :src="keys.image" @error="imageError(keys)"></image>
          </block>
        </view>
        <view class="name">
          <rich-text :nodes="item.showName"></rich-text>
        </view>
      </view>
    </block>

    <!-- 空空如也 -->
    <view class="not-wrap uni-flex-center" v-if="(contactsList.length == 0) & (appList.length == 0)">
      <view class="not-box uni-column-center">
        <image class="img" src="/static/img/kong.png" mode=""></image>
        <text>暂无结果</text>
      </view>
    </view>

    <!-- 搜索 应用结果 -->
    <block v-if="appList.length != 0">
      <view v-for="(item, index) in appList" :key="index" class="item-box uni-flex-jus" @tap.stop="appInfo(item.appid)">
        <view class="left uni-flex-ali">
          <image class="img" :src="item.image" mode="" @error="imageError(item)"></image>
          <view>
            <!-- <view class="name">{{item.name}}</view> -->
            <rich-text class="name" :nodes="item.showName"></rich-text>
            <view class="content">{{ item.desc }}</view>
          </view>
        </view>
        <uni-icons type="forward" color="#9E9C9E" size="16" />
      </view>
    </block>

    <!-- 空空如也 -->
    <view class="not-wrap uni-flex-center" v-if="(contactsList.length == 0) & (appList.length == 0)">
      <view class="not-box uni-column-center">
        <image class="img" src="/static/img/kong.png" mode=""></image>
        <text>暂无结果</text>
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
      /**
       * 	搜索类型
       * 	people	联系人、设备、群
       * 	app	应用
       */
      type: '',
      // 是否聚焦
      showSync: true,
      // 输入框的值
      searchVal: '',
      // 搜索 联系人、设备、群结果
      contactsList: [],
      // 搜索 应用结果
      appList: []
    }
  },

  onLoad({ type }) {
    if (type) {
      this.type = type
    }
  },

  methods: {
    // 搜索
    confirm() {
      if (this.searchVal == '') {
        app.showToast('请填写内容')
        return
      }
      if (this.type == 'people') {
        // 搜索 联系人、设备、群
        this.searchContect()
      } else {
        // 搜索 应用
        this.searchApp()
      }
    },

    // 搜索 联系人、设备、群
    searchContect() {
      app.showLoading()
      let data = {
        key: this.searchVal
      }
      app.search(data, (res) => {
        if (res.code == 0) {
          // 过滤出符合条件的值高亮
          res.data.forEach((item, index) => {
            if (item.name.includes(this.searchVal)) {
              item.showName = this.join(item.name, this.searchVal)
            }
          })
          // console.log(res.data);
          this.contactsList = res.data
          app.hideLoading()
        } else {
          app.showToast(res.message)
        }
      })
    },

    // 搜索 应用
    searchApp() {
      app.showLoading()
      let data = {
        key: this.searchVal
      }
      app.find_app(data, (res) => {
        if (res.code == 0) {
          // 过滤出符合条件的值高亮
          res.data.forEach((item) => {
            if (item.name.includes(this.searchVal)) {
              item.showName = this.join(item.name, this.searchVal)
            }
          })
          // console.log(res.data);
          this.appList = res.data
          app.hideLoading()
        } else {
          app.showToast(res.message)
        }
      })
    },

    // 拼接
    join(str, key) {
      var reg = new RegExp(`(${key})`, 'gm')
      var replace = '<span style="color:#694BE1">$1</span>'
      return str.replace(reg, replace)
    },

    // 取消
    cancel() {
      uni.navigateBack({
        delta: 1
      })
    },

    imageError(item, index) {
      this.$set(item, 'image', '/static/img/user.png')
    },

    // 点击联系人
    contactsClick(item) {
      if (item.id) {
        if (item.type == 5) {
          // 点击群列表
          uni.redirectTo({
            url: `/pages/chat/room/chat?roomid=${item.id}&title=${item.name}&chattype=5&receiveid=${item.id}`
          })
        } else {
          uni.redirectTo({
            url: `/pages/contacts/card?peopleId=${item.id}&chattype=${item.type}`
          })
        }
      }
    },

    // 应用详情
    appInfo(appid) {
      uni.navigateTo({
        url: `/pages/device/application_card?appid=${appid}`
      })
    }
  }
}
</script>

<style scoped lang="scss">
.status_bar {
  height: var(--status-bar-height);
  width: 100%;
}

// 搜索框
.search-wrap {
  display: flex;
  flex-direction: row;
  position: relative;
  padding: 16upx 40rpx;
  box-sizing: border-box;
  border-radius: 36rpx;

  .search-box {
    flex: 1;
    padding: 10upx 0px;
    box-sizing: border-box;
    height: 72upx;
    border-radius: 36rpx;
    background: #f3f4f8;

    .icon-search {
      width: 64rpx;
    }

    .search-input {
      flex: 1;
      font-size: 28rpx;
      color: #333;
    }

    .icon-clear {
      padding: 0 20rpx 0 10rpx;
      box-sizing: border-box;
      line-height: 48rpx;
    }
  }

  .cancel_btn {
    padding-left: 28rpx;
    line-height: 72rpx;
    font-size: 32rpx;
    color: #694be1;
  }
}

// 结果
.contacts-box {
  position: relative;
  padding: 0 40rpx;
  box-sizing: border-box;
  height: 120rpx;

  // 联系人、设备头像
  .img {
    width: 90rpx;
    height: 90rpx;
    margin-right: 30rpx;
    border-radius: 100%;
  }

  // 拼头像
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

  .name {
    flex: 1;
    margin-right: 40rpx;
    height: 120rpx;
    line-height: 120rpx;
    color: #252525;
    font-size: 32rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
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

// 应用
.item-box {
  padding: 0 40rpx;
  box-sizing: border-box;
  margin-top: 40rpx;
  height: 120rpx;

  &:nth-of-type(1) {
    margin-top: 0;
  }

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
</style>
