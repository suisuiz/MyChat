<template>
  <view class="content">
    <view class="item" v-for="(item, index) in arr" :key="index" @click="tap(item.url)">{{ item.text }} </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      arr: [
        {
          text: '测试一',
          url: 'form'
        },
        {
          text: '截图',
          url: 'screenshot'
        },
        {
          text: '拍照',
          url: 'camera'
        },
				{
				  text: '日历 vue',
				  url: 'calendar'
				},
				{
				  text: '时间线',
				  url: 'daylist'
				},
        // {
        //   text: 'uCharts 图表',
        //   url: 'uCharts'
        // },
        // {
        //   text: 'ECharts 图表 + renderjs',
        //   url: 'ECharts'
        // },
      ]
    }
  },
  onShow() {
    plus.screen.lockOrientation('portrait')
  },
  methods: {
    tap(url) {
      uni.navigateTo({
        url: `/pages/content/${url}`
      })
    }
  }
}
</script>

<style>
.content {
  padding: 0 30px;
  box-sizing: border-box;
}

.item {
  padding: 10px;
  box-sizing: border-box;
  margin-top: 20px;
  background: skyblue;
}
</style>
