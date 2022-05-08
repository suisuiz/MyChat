<!--
 * @Descripttion: 初始页
 * @Author: SUI
 * @Company: chorustek
 * @Date: 2020-10-28 18:05:43
 * @Version: 1.0.0
 * @LastEditors: SUI
 * @LastEditTime: 2021-08-30 10:55:52
 * @FilePath: \things\pages\index\index.vue
-->
<template>
  <view></view>
</template>

<script>
let app = require('@/common/common.js')
export default {
  data() {
    return {}
  },
  onLoad() {
    uni.showLoading({
      title: '加载中',
      mask: true
    })

    let tokenObj = app.getToken()
    if (!tokenObj || !tokenObj.token) {
      uni.hideLoading()
      uni.reLaunch({
        url: '/pages/user/login'
      })
      return false
    } else {
      // 仅 APP-PLUS 编译
      // #ifdef APP-PLUS
      plus.navigator.closeSplashscreen()
      // #endif

      uni.hideLoading()
      uni.switchTab({
        url: '/pages/chat/list'
      })
    }
  },
  onHide() {
    uni.hideLoading()
  },
  onUnload() {
    uni.hideLoading()
  },
  methods: {}
}
</script>

<style lang="scss" scoped></style>
