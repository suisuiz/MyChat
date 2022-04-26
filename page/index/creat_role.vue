<!--
 * @Descripttion: 说明
 * @Author: SUI
 * @Company: chorustek
 * @Date: 2021-03-02 15:45:39
 * @Version: 1.0.0
 * @LastEditors: SUI
 * @LastEditTime: 2021-08-30 10:55:50
 * @FilePath: \things\pages\index\creat_role.vue
-->
<template>
  <view class="page">
    <view class="line"></view>
    <!-- 列表展示 -->
    <view class="data-item" v-for="(item, index) in listData" :key="index">
      <!-- 标题 -->
      <view class="data-item-title">
        <view>{{ item.title }}</view>
        <view class="data-item-title-right" @click="insert(item.id)"> <uni-icons type="plus-filled" color="#3296FA"></uni-icons><text>添加二级分类</text> </view>
      </view>
      <!-- 子类 -->
      <view class="data-item-list">
        <view class="data-item-list-item" v-for="(key, i) in item.subData" :key="i" @click="detail(key.id)">
          <view class="data-list-item-index">{{ i + 1 }}</view>
          <view class="data-list-item-name">{{ key.name }}</view>
        </view>
      </view>
    </view>
    <!-- 底部按钮 -->
    <view class="bottom-block"></view>
    <view class="bottom-wrap">
      <view class="creat-btn" @click="add">添加新内容</view>
    </view>
  </view>
</template>

<script>
let app = require('@/common/common.js')
export default {
  data() {
    return {
      listData: []
    }
  },
  onLoad() {
    this.getData()
  },

  methods: {
    // 获取列表数据
    getData() {
      let that = this
      let data = [
        {
          id: 'AIKIT',
          title: 'AIKIT',
          subData: [
            {
              name: '产品介绍',
              id: '产品介绍'
            },
            {
              name: '图片展示',
              id: '图片展示'
            }
          ]
        },
        {
          id: '中科创达北京展厅',
          title: '中科创达北京展厅',
          subData: [
            {
              name: '产品介绍',
              id: '产品介绍'
            },
            {
              name: '视频介绍',
              id: '视频介绍'
            }
          ]
        }
      ]

      that.listData = data
    },

    // 添加二级分类
    insert(e) {
      console.log(e)
    },

    // 子类详情
    detail(e) {
      console.log(e)
    },

    // 底部添加新内容
    add() {
      console.log('添加新内容')
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

.line {
  height: 2rpx;
  background: rgba(226, 226, 226, 0.5);
}

/* 列表展示 */
.data-item {
  background: #ffffff;
  margin-bottom: 20rpx;
}

.data-item-title {
  height: 94rpx;
  color: #3b3f4a;
  font-size: 32rpx;
  padding: 0 28rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: solid 2rpx rgba(226, 226, 226, 0.4);
}

.data-item-title-right text {
  font-size: 30rpx;
  margin-left: 4rpx;
}

/* 列表子类 */
.data-item-list {
  padding: 0 16rpx 0 32rpx;
  box-sizing: border-box;
}

.data-item-list-item {
  height: 92rpx;
  display: flex;
  align-items: center;
  border-bottom: solid 2rpx rgba(226, 226, 226, 0.4);
}

.data-item-list-item:last-child {
  border: none;
}

.data-list-item-index {
  width: 28rpx;
  height: 28rpx;
  text-align: center;
  line-height: 28rpx;
  color: #ffffff;
  font-size: 20rpx;
  background: #3296fa;
  opacity: 0.6;
  border-radius: 100%;
}

.data-list-item-name {
  margin-left: 12rpx;
  color: #3b3f4a;
  font-size: 30rpx;
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
