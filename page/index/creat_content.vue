<!--
 * @Descripttion: 说明
 * @Author: SUI
 * @Company: chorustek
 * @Date: 2021-03-02 15:45:39
 * @Version: 1.0.0
 * @LastEditors: SUI
 * @LastEditTime: 2021-08-30 10:55:48
 * @FilePath: \things\pages\index\creat_content.vue
-->
<template>
  <view class="page">
    <!-- 二级名称 -->
    <view class="form-item">
      <view>二级名称</view>
      <input type="text" placeholder="请填写名称" placeholder-style="color: #A6ABB1;font-size: 15px;text-align: right;" :value="name" @input="getName" />
    </view>
    <!-- 内容摘要 -->
    <view class="form-item title">内容摘要</view>
    <textarea class="form-text" placeholder="请用简短的文字来描写此内容，20字左右" placeholder-style="color: #A6ABB1;font-size: 15px;line-height: 1.5;" @input="getAbstract" />
    <!-- 内容展示图 -->
    <view class="form-item title">内容展示图</view>
    <view class="form-item-img">
      <image class="form-item-img-class" src="/static/img/other/upload.png" mode="" @click="upload"></image>
      <view class="form-item-img-box" v-for="(item, index) in imgList" :key="index">
        <image class="form-item-img-class" :src="item"></image>
        <image class="form-item-img-del" src="/static/img/other/del.png" @click="delImg(index)"></image>
      </view>
    </view>

    <!-- 底部按钮 -->
    <view class="bottom-block"></view>
    <view class="bottom-wrap">
      <view class="creat-btn" @click="complete">完成</view>
    </view>
  </view>
</template>

<script>
let app = require('@/common/common.js')
export default {
  data() {
    return {
      name: '',
      abstract: '',
      imgList: []
    }
  },
  onLoad() {},

  methods: {
    // 二级名称
    getName(e) {
      this.name = e.detail.value
    },

    // 内容摘要
    getAbstract(e) {
      this.abstract = e.detail.value
    },

    // 内容展示图
    upload() {
      let that = this
      uni.chooseImage({
        count: 1,
        success: (res) => {
          console.log(JSON.stringify(res.tempFilePaths))
          that.imgList.push(res.tempFilePaths[0])
        }
      })
    },

    // 点击删除图片
    delImg(e) {
      this.imgList.splice(e, 1)
    },

    // 完成
    complete() {
      let that = this
      let data = {
        name: this.name,
        abstract: this.abstract
      }
      console.log('完成', data)
    }
  }
}
</script>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  background: #f5f5f5;
}

view {
  font-size: 32rpx;
}

input {
  text-align: right;
}

/* 表单 */
.form-item {
  height: 106rpx;
  display: flex;
  color: #3b3f4a;
  font-size: 32rpx;
  align-items: center;
  justify-content: space-between;
  padding: 0 30rpx;
  box-sizing: border-box;
  background: #ffffff;
  border-top: solid 2rpx rgba(226, 226, 226, 0.4);
}

.form-img {
  width: 72rpx;
  height: 72rpx;
  border-radius: 100%;
}

.title {
  height: 70rpx;
}

.form-text {
  width: 100%;
  min-height: 284rpx;
  background: #ffffff;
  line-height: 1.5;
  padding: 0 30rpx;
  box-sizing: border-box;
}

/* 内容展示图 */
.form-item-img {
  padding: 0 14rpx 20rpx;
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
  background: #ffffff;
}

.form-item-img-class {
  width: 156rpx;
  height: 156rpx;
  border-radius: 8rpx;
  margin-left: 16rpx;
}

.form-item-img-box {
  position: relative;
}

.form-item-img-del {
  position: absolute;
  right: 0;
  top: 0;
  width: 26rpx;
  height: 26rpx;
  border-radius: 4rpx;
}

/* 底部按钮 */
.bottom-block {
  height: 108rpx;
}

.bottom-wrap {
  width: 100%;
  height: 108rpx;
  background: #ffffff;
  position: fixed;
  bottom: 2rpx;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.creat-btn {
  width: 176rpx;
  height: 64rpx;
  font-size: 28rpx;
  text-align: center;
  line-height: 64rpx;
  color: #ffffff;
  background: #3296fa;
  border-radius: 8rpx;
  margin-right: 20rpx;
}
</style>
