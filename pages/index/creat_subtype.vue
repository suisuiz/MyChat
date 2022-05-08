<!--
 * @Descripttion: 说明
 * @Author: SUI
 * @LastEditors: SUI
 * @LastEditTime: 2022-05-08 12:00:43
 * @FilePath: \MyChat\pages\index\creat_subtype.vue
-->
<template>
  <view class="page">
    <!-- 选择类目 -->
    <picker mode="selector" :range="typeArr" :value="index" @change="bindPickerChange">
      <view class="form-item">
        <view>选择类目</view>
        <view :class="typeText == '请选择' ? 'place' : ''">{{ typeText }}</view>
      </view>
    </picker>
    <!-- 名称 -->
    <view class="form-item">
      <view>名称</view>
      <input type="text" placeholder="请填写名称" placeholder-style="color: #A6ABB1;font-size: 15px;text-align: right;" :value="name" @input="getName" />
    </view>
    <!-- 头像 -->
    <view class="form-item">
      <view>头像</view>
      <image class="form-img" :src="src" @click="choose"></image>
    </view>
    <!-- 欢迎语 -->
    <view class="form-item title">欢迎语</view>
    <textarea
      class="form-text"
      placeholder="请用简短的文字来写欢迎语吧。例如：您好，我是中科创达北京创达大厦一楼展厅小助手，选择您感兴趣的进行了解吧～"
      placeholder-style="color: #A6ABB1;font-size: 15px;line-height: 1.5;"
      @input="getWelcome"
    />
    <!-- 设备图片 -->
    <view v-if="typeText == '设备'">
      <view class="form-item title">图片</view>
      <view class="form-item-img">
        <image class="form-item-img-class" src="/static/img/other/upload.png" mode="" @click="upload"></image>
        <view class="form-item-img-box" v-for="(item, index) in imgList" :key="index">
          <image class="form-item-img-class" :src="item"></image>
          <image class="form-item-img-del" src="/static/img/other/del.png" @click="delImg(index)"></image>
        </view>
      </view>
    </view>

    <!-- 底部按钮 -->
    <view class="bottom-block"></view>
    <view class="bottom-wrap">
      <view class="creat-btn" v-if="typeText != '设备'" @click="next">下一步</view>
      <view class="creat-btn" v-else @click="complete">完成</view>
    </view>
  </view>
</template>

<script>
let app = require('@/common/common.js')
export default {
  data() {
    return {
      index: 0,
      typeArr: ['设备', '内容'],
      typeText: '请选择',
      name: '',
      src: '/static/img/other/upload.png',
      welcome: '',
      imgList: []
    }
  },
  onLoad() {},

  methods: {
    // 选择类别
    bindPickerChange(e) {
      console.log('picker发送选择改变，携带值为', e.target.value)
      this.index = e.target.value
      this.typeText = this.typeArr[e.target.value]
    },

    // 名称
    getName(e) {
      this.name = e.detail.value
    },

    // 选择头像
    choose(e) {
      let that = this
      uni.chooseImage({
        count: 1,
        success: (res) => {
          console.log(JSON.stringify(res.tempFilePaths))
          that.src = res.tempFilePaths
        }
      })
    },

    // 欢迎语
    getWelcome(e) {
      this.welcome = e.detail.value
    },

    // 设备图片
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

    // 下一步
    next() {
      let that = this
      let data = {
        type: this.typeText,
        name: this.name,
        src: this.src,
        welcome: this.welcome
      }
      console.log('下一步', data)
    },

    // 完成
    complete() {
      let that = this
      let data = {
        type: this.typeText,
        name: this.name,
        src: this.src,
        welcome: this.welcome
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

.place {
  color: #a6abb1;
  font-size: 30rpx;
}

.form-img {
  width: 72rpx;
  height: 72rpx;
  border-radius: 100%;
}

.title {
  height: 80rpx;
}

.form-text {
  width: 100%;
  min-height: 284rpx;
  background: #ffffff;
  line-height: 1.5;
  padding: 0 30rpx;
  box-sizing: border-box;
}

/* 设备图片 */
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
