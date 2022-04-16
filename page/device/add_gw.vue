<!--
 * @Descripttion: 添加网关
 * @Author: SUI
 * @Company: chorustek
 * @Date: 2021-06-21 14:29:00
 * @Version: 1.0.0
 * @LastEditors: SUI
 * @LastEditTime: 2021-07-13 15:48:26
 * @FilePath: \things\pages\device\add_gw.vue
-->
<template>
  <view v-if="pageLoad">
    <view class="gw-wrap">
      <view class="title">操作说明</view>
      <view class="content">{{ introduce }}</view>
      <image class="img" :src="gw_image" />
      <view class="add-btn" @tap="addDevice">添加网关</view>
    </view>

    <view class="mask_wrap" v-if="maskBol">
      <view class="mask_top">
        <view class="mask_title">网关名称</view>
        <input type="text" placeholder="请填写网关名称" v-model="inputName" />
        <view class="mask_bottom uni-flex-ali">
          <!-- <text class="cancels">取消</text> -->
          <text class="confirm" @tap="confirmBtn">确定</text>
        </view>
      </view>
      <view class="mask_view"></view>
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
      // 操作说明、图片
      introduce: '',
      gw_image: '',
      // 按钮文字
      btnText: '添加设备',
      // 重命名弹框、名字
      maskBol: false,
      inputName: '',
      // 扫描的ID
      gwId: ''
    }
  },

  onLoad({ modelid }) {
    if (modelid) {
      this.modelid = modelid
      // console.log('modelid======',this.modelid)
      this.get_gateway_info()
    }
  },

  methods: {
    // 获取初始信息
    get_gateway_info() {
      app.showLoading()
      let data = {
        modelid: this.modelid
      }
      app.get_gateway_info(data, (res) => {
        if (res.code == 0) {
          // console.log(res.data);
          this.introduce = res.data.introduce
          this.gw_image = res.data.image
          this.pageLoad = true
          app.hideLoading()
        } else {
          app.showToast(res.message)
        }
      })
    },

    // 扫描添加网关
    addDevice() {
      let that = this
      uni.scanCode({
        success: (res) => {
          // console.log('条码内容：' + res.result);
          if (res.result) {
            that.maskBol = true
            that.gwId = res.result
          }
        }
      })
    },

    // 确认
    confirmBtn() {
      if (this.inputName == '') {
        app.showToast('请填写网关名称')
        return
      }
      app.showLoading()
      let data = {
        name: this.inputName,
        gatewayid: this.gwId
      }
      // console.log(data);
      app.new_gateway(data, (res) => {
        if (res.code == 0) {
          uni.showToast({
            title: '添加成功',
            mask: true,
            success() {
              setTimeout(() => {
                uni.navigateBack({
                  delta: 1
                })
                app.hideLoading()
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
</script>

<style scoped lang="scss">
.gw-wrap {
  padding: 22rpx 40rpx 0;
  box-sizing: border-box;

  // 标题
  .title {
    margin-bottom: 20rpx;
    font-size: 48rpx;
    color: #2f2f2e;
    font-weight: 500;
  }

  // 内容
  .content {
    margin-bottom: 40rpx;
    color: #a4a4a4;
    font-size: 28rpx;
    font-weight: 400;
  }

  // 图片
  .img {
    margin-bottom: 40rpx;
    width: 670rpx;
    height: 670rpx;
  }

  // 添加按钮
  .add-btn {
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    color: #ffffff;
    font-size: 28rpx;
    border-radius: 10rpx;
    background: #ef4b5b;
  }
}

// 命名弹窗
.mask_wrap {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: rgba(88, 88, 88, 0.3);
  z-index: 999;

  .mask_top {
    position: absolute;
    margin: auto;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 620rpx;
    height: 330rpx;
    text-align: center;
    color: #3b3f4a;
    font-size: 32rpx;
    border-radius: 42rpx;
    background: #ffffff;

    .mask_title {
      height: 100rpx;
      line-height: 100rpx;
    }

    input {
      margin: 0 auto 24rpx;
      width: 98%;
      height: 92rpx;
      color: #1e1e1e;
      font-size: 30rpx;
    }

    .mask_bottom {
      height: 114rpx;
      font-size: 32rpx;
      font-weight: 500;
      border-top: solid 1px rgba(216, 216, 216, 0.4);

      .cancels {
        flex: 1;
        height: 80rpx;
        line-height: 80rpx;
        border-right: solid 1px rgba(216, 216, 216, 0.4);
      }

      .confirm {
        flex: 1;
        color: #1e1e1e;
        height: 90rpx;
        line-height: 90rpx;
      }
    }
  }
}
</style>
