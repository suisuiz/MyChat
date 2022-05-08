<!--
 * @Descripttion: 加号添加成员
 * @Author: SUI
 * @LastEditTime: 2022-05-08 12:02:57
 * @FilePath: \MyChat\pages\chat\chat_add_member.vue
-->
<template>
  <view class="body" v-if="pageLoad">
    <!-- 联系人列表 -->
    <scroll-view scroll-y class="body_wrap">
      <view class="contacts-list" v-if="contactsList.length != 0">
        <view v-for="(item, index) in contactsList" :key="index" @click="bindClick(item)" hover-class="bg-light">
          <view class="contacts-list-box">
            <view class="contacts-list-box-box">
              <image class="img" :src="item.image" mode="" @error="imageError(item)"></image>
              <view class="name">{{ item.name }}</view>
            </view>
            <uni-icons v-if="!item.inroom" type="checkbox-filled" color="#E2E2E2" size="18" />
            <uni-icons v-else type="checkbox-filled" color="#EF4B5B" size="18" />
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 右下角按钮 -->
    <view class="complete_wrap">
      <!-- 完成 -->
      <view :class="changebtn ? 'complete1' : 'complete'" @click="complete_btn"> 完成{{ selectarr.length != 0 ? selectarr.length : '' }} </view>
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
      type: '',
      detailid: '',
      msgid: '',
      appid: '',
      siteid: '',
      // 联系人列表
      contactsList: [],
      // 选中的列表
      selectarr: [],
      changebtn: false
    }
  },

  onLoad({ detailid, msgid, appid, siteid, type }) {
    if (type) {
      this.type = type
    }
    // 获取数据
    if (detailid) {
      this.detailid = detailid
      this.msgid = msgid
      this.appid = appid
      this.siteid = siteid
      app.showLoading()
      this.getData()
    }
  },

  methods: {
    // 获取联系人
    getData() {
      let that = this
      app.get_member({ detailid: that.detailid }, (res) => {
        if (res.code == 0) {
          console.log(res.data)
          // type   1运营 2管理 3设备 4商品
          let arr = []
          res.data.forEach((item) => {
            if (item.inroom) {
              that.changebtn = true
            }
            if (that.type === '') {
              arr.push(item)
            } else {
              if (item.type === 1) {
                arr.push(item)
              }
            }
          })

          that.contactsList = arr
          that.pageLoad = true
          setTimeout(() => {
            app.hideLoading()
          }, 10)
        } else {
          app.showToast(res.message)
        }
      })
    },

    // 建群/拉人选择联系人
    bindClick(item) {
      item.inroom = !item.inroom
      // console.log(item)
      let select = []
      this.contactsList.forEach((item) => {
        if (item.inroom) {
          select.push({
            detailid: item.id,
            type: item.type
          })
        }
      })
      if (select.length > 0) {
        this.changebtn = true
      } else {
        this.changebtn = false
      }
      this.selectarr = select
    },

    // 聊天室--确认进群
    complete_btn() {
      let that = this
      if (that.selectarr.length > 0) {
        // app.showLoading()
        let data = {
          msgid: that.msgid,
          contacts: {
            detailid: that.detailid,
            member: that.selectarr
          }
        }
        // console.log(data)

        let urls
        if (uni.getStorageSync('localAddress')) {
          urls = `https://${uni.getStorageSync('localAddress')}:8080/${that.appid}${that.siteid}`
        } else {
          urls = `${app.apiHost}/${that.appid}${that.siteid}`
        }
        if (that.type === '') {
          app.chat_add_member(urls, data, (res) => {
            console.log(res)
            if (res.code == 0) {
              uni.showToast({
                title: '添加成功',
                mask: true,
                success() {
                  setTimeout(() => {
                    app.hideLoading()
                    uni.navigateBack({
                      delta: 1
                    })
                  }, 1000)
                }
              })
            } else {
              app.showToast(res.message)
            }
          })
        } else {
          app.add_person_member(urls, data, (res) => {
            console.log(res)
            if (res.code == 0) {
              uni.showToast({
                title: '添加成功',
                mask: true,
                success() {
                  setTimeout(() => {
                    app.hideLoading()
                    uni.navigateBack({
                      delta: 1
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
  }
}
</script>

<style lang="scss" scoped>
.body {
  position: relative;
  height: 100vh;
  background: #f6f7fb;

  .body_wrap {
    height: calc(100% - 120rpx);
  }

  /* 联系人列表 */
  .contacts-list {
    background: #ffffff;

    &-box {
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 40rpx;
      box-sizing: border-box;
      height: 120rpx;

      &-box {
        display: flex;
        align-items: center;

        .img {
          width: 90rpx;
          height: 90rpx;
          margin-right: 30rpx;
          border-radius: 100%;
        }

        .name {
          flex: 1;
          margin-right: 40rpx;
          height: 120rpx;
          line-height: 120rpx;
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

    &-name_last {
      border: none;
    }

    .bg-light {
      background: $but-click-bg;
    }
  }

  // 右下角按钮
  .complete_wrap {
    position: fixed;
    bottom: 20rpx;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 0 40rpx;
    box-sizing: border-box;
    width: 100%;
    height: 88rpx;
    z-index: 99;

    .complete {
      color: #fff;
      width: 118rpx;
      height: 50rpx;
      line-height: 50rpx;
      text-align: center;
      background: #ef4b5b;
      border-radius: 8rpx;
      opacity: 0.4;
    }

    .complete1 {
      color: #fff;
      width: 118rpx;
      height: 50rpx;
      line-height: 50rpx;
      text-align: center;
      background: #ef4b5b;
      border-radius: 8rpx;
      opacity: 1;
    }
  }
}
</style>
