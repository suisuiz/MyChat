<!--
 * @Descripttion: 添加设备
 * @Author: SUI
 * @Company: chorustek
 * @Date: 2021-06-21 10:51:28
 * @Version: 1.0.0
 * @LastEditors: SUI
 * @LastEditTime: 2021-07-14 10:31:53
 * @FilePath: \things\pages\device\add_device.vue
-->
<template>
  <view v-if="pageLoad">
    <view class="wrap">
      <view class="title">操作说明</view>
      <view class="content">{{ introduce }}</view>
      <image class="img" :src="device_image" />
      <view class="add-btn" v-if="gwId == ''" @tap="addDevice">添加设备</view>
      <view class="add-btn" v-if="gwId != ''" @tap="addBtn">{{ btnText }}</view>
    </view>

    <view class="mask_wrap" v-if="maskBol">
      <view class="mask_top">
        <view class="mask_title">设备名称</view>
        <input type="text" placeholder="请填写设备名称" v-model="inputName" />
        <view class="mask_bottom uni-flex-ali">
          <!-- <text class="cancels">取消</text> -->
          <text class="confirm" v-if="notifyId == ''" @tap="confirmBtn"
            >确定</text
          >
          <text class="confirm" v-if="notifyId != ''" @tap="rename">确定</text>
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
      // 选择的 设备、网关ID
      deviceId: '',
      gwId: '',
      // 操作说明、图片
      introduce: '',
      device_image: '',
      // 按钮文字
      btnText: '添加设备',
      // 倒计时
      count: 60,
      // 防止按钮重复点击
      btnBol: false,
      // 重命名弹框、名字
      maskBol: false,
      inputName: '',
      notifyId: '',
      // 扫描结果
      scanArr: []
      // websocket接收到的设备ID
    }
  },

  onLoad({ deviceid, gwid }) {
    if (deviceid) {
      this.deviceId = deviceid
      // console.log('deviceid======',this.deviceId)
      this.get_device_info()
    }
    if (gwid) {
      this.gwId = gwid
      // console.log('gwid======',this.gwId)
    }
  },

  onShow() {
    let that = this
    // 收消息
    uni.$on('add_gw_device', (obj) => {
      if (obj.id) {
        console.log('成功接收')
        // 显示重命名弹窗
        that.maskBol = true
        that.notifyId = obj.id
        // 按钮信息初始化
        that.count = 60
        that.btnText = '添加设备'
        that.btnBol = false
      }
    })
  },

  onHide() {
    uni.$off('add_gw_device')
  },
  onUnload() {
    uni.$off('add_gw_device')
  },

  methods: {
    // 获取初始信息
    get_device_info() {
      app.showLoading()
      let data = {
        modelid: this.deviceId
      }
      app.get_device_info(data, (res) => {
        if (res.code == 0) {
          this.introduce = res.data.introduce
          this.device_image = res.data.image
          this.pageLoad = true
          app.hideLoading()
        } else {
          app.showToast(res.message)
        }
      })
    },

    // 扫描添加设备
    addDevice() {
      let that = this
      uni.scanCode({
        success: (res) => {
          // console.log('条码内容：' + res.result);
          if (res.result) {
            that.maskBol = true
            that.scanArr = res.result.split('#')
          }
        }
      })
    },

    // 确认
    confirmBtn() {
      if (this.inputName == '') {
        app.showToast('请填写设备名称')
        return
      }
      app.showLoading()
      let data = {
        name: this.inputName,
        type: this.scanArr[0],
        deviceid: this.scanArr[1]
      }
      // console.log(data);
      app.scan_device(data, (res) => {
        if (res.code == 0) {
          uni.showToast({
            title: '添加成功',
            mask: true,
            success() {
              setTimeout(() => {
                app.hideLoading()
                uni.switchTab({
                  url: '/pages/contacts/contacts'
                })
              }, 1000)
            }
          })
        } else {
          app.showToast(res.message)
        }
      })
    },

    // 带网关添加设备
    addBtn() {
      let that = this
      let btnBol = this.btnBol
      if (btnBol) {
        return
      }
      app.showLoading()
      let data = {
        gatewayid: that.gwId
      }
      app.add_gateway_device(data, (res) => {
        if (res.code == 0) {
          that.btnBol = true
          that.count = 60
          that.btnText = '倒计时60秒'
          app.hideLoading()
          setTimeout(() => {
            that.addDev()
          }, 1000)
        } else {
          app.showToast(res.message)
        }
      })
    },

    // 倒计时
    addDev() {
      let that = this
      let count = this.count
      count = count - 1
      if (count < 1) {
        this.count = 60
        this.btnText = '添加设备'
        this.btnBol = false
      } else {
        this.count = count
        this.btnText = `倒计时${count}秒`
        setTimeout(() => {
          that.addDev()
        }, 1000)
      }
    },

    // 带网关设备确认添加
    rename() {
      if (this.inputName == '') {
        app.showToast('请填写设备名称')
        return
      }
      app.showLoading()
      let data = {
        name: this.inputName,
        deviceid: this.notifyId
      }
      // console.log(data);
      app.set_device_name(data, (res) => {
        if (res.code == 0) {
          uni.showToast({
            title: '添加成功',
            mask: true,
            success() {
              setTimeout(() => {
                app.hideLoading()
                uni.switchTab({
                  url: '/pages/contacts/contacts'
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
</script>

<style scoped lang="scss">
.wrap {
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
