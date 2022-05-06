<!--
 * @Descripttion: 新建场所
 * @Author: SUI
 * @Company: chorustek
 * @Date: 2021-06-15 10:29:52
 * @Version: 1.0.0
 * @LastEditors: SUI
 * @LastEditTime: 2021-11-29 17:54:47
 * @FilePath: \things\pages\place\creat_place.vue
-->
<template>
  <view v-if="pageLoad" class="page">
    <view class="form-wrap">
      <!-- 基础信息 -->
      <view class="form">
        <view class="item item-img uni-flex-jus">
          <text>头像</text>
          <view class="uni-flex-ali">
            <image class="img" :src="image" mode="" @tap="changeImg"></image>
          </view>
        </view>
        <view class="item uni-flex-jus">
          <text>名称</text>
          <view class="uni-flex-ali">
            <input class="input" placeholder="请填写名称" placeholder-class="pls" type="text" v-model="name" />
          </view>
        </view>
        <view class="item uni-flex-jus">
          <text>上级地址</text>
          <view class="uni-flex-ali">
            <input class="input" placeholder="请填写地址" placeholder-class="pls" type="text" v-model="uplink" />
          </view>
        </view>
      </view>
      <!-- 节点列表 -->
      <view class="form2">
        <view class="item item-list uni-flex-jus">
          <text>节点列表</text>
          <!-- 隐藏添加节点 -->
          <!-- <view class="uni-flex-ali" @click="addList">
            <uni-icons type="plus-filled" color="#C6CCDA" size="16" />
          </view> -->
        </view>
        <view class="gateway-list" v-for="(item, index) in gateway" :key="index">
          <view class="item way-item uni-flex-jus">
            <text>编号</text>
            <view class="uni-flex-ali">
              <input class="input" placeholder="请填写编号" placeholder-class="pls" type="text" v-model="item.gatewayid" />
            </view>
          </view>
          <!-- 默认开启转发 nfd true -->
          <!-- <view class="item way-item uni-flex-jus" @click="item.nfd = !item.nfd"> -->
          <view class="item way-item uni-flex-jus">
            <text>开启转发</text>
            <view class="uni-flex-ali">
              <uni-icons v-if="!item.nfd" type="checkbox-filled" color="#C6CCDA" size="16" />
              <uni-icons v-if="item.nfd" type="checkbox-filled" color="#EF4B5B" size="16" />
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- 删除 -->
    <uni-popup id="deldialog" ref="deldialog" type="dialog">
      <uni-popup-dialog mode="base" type="other" title=" " content="删除此节点?" @confirm="deldialog"> </uni-popup-dialog>
    </uni-popup>
    <!-- 完成 -->
    <view class="save-btn uni-flex-center">
      <view class="btn uni-flex-center" @click="save">完成</view>
    </view>
  </view>
</template>

<script>
// 引入接口
let app = require('@/common/common.js')
// 提示框
import uniPopup from '@/components/uni-popup/uni-popup.vue'
import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
export default {
  components: {
    uniPopup,
    uniPopupDialog
  },
  data() {
    return {
      // 控制页面隐藏显示
      pageLoad: false,
      // 表单显示的内容
      image: '/static/img/me/plusx.png',
      name: '',
      num: '',
      uplink: '',
      // 配置
      gateway: [
        {
          gatewayid: '',
          nfd: true
        }
      ],
      // 判断跳转
      pageType: '',
      // 删除的节点索引
      delIndex: ''
    }
  },

  onLoad(e) {
    if (e) {
      this.pageType = 'back'
    }
    this.pageLoad = true
  },

  onShow() {},

  methods: {
    // 上传头像
    changeImg() {
      let that = this
      uni.chooseImage({
        count: 1,
        success: (res) => {
          app.showLoading()
          app.upload_file({}, res.tempFilePaths[0], (res) => {
            if (res.code == 0) {
              that.image = res.data
              app.hideLoading()
            } else {
              uni.showToast({
                title: res.message,
                image: '/images/icon/alert.png',
                mask: true
              })
            }
          })
        }
      })
    },

    // 长按删节点
    removeItem(index) {
      this.delIndex = index + 1
      this.$refs.deldialog.open()
    },

    // 删除
    deldialog(done, name) {
      if ((this.gateway.length > 1) & (this.delIndex != '')) {
        this.gateway.splice(this.delIndex - 1, 1)
      }
      done()
    },

    // 添加节点列表
    addList() {
      this.gateway.push({
        gatewayid: '',
        nfd: true
      })
    },

    // 保存
    save() {
      let that = this
      if (that.image == '/static/img/me/plusx.png') {
        app.showToast('请上传头像')
        return
      }
      if (that.name == '') {
        app.showToast('请填写名称')
        return
      }
      if (that.gateway[0].gatewayid == '') {
        app.showToast('请填写编号')
        return
      }
      let data = {
        name: that.name,
        image: that.image,
        uplink: that.uplink,
        gateway: that.gateway
      }
      // console.log(data);
      app.showLoading()
      app.add_site_contact(data, (res) => {
        if (res.code == 0) {
          uni.showToast({
            title: '创建成功',
            mask: true,
            success() {
              setTimeout(() => {
                app.hideLoading()
                // 根据入口参数跳转不同页面
                if (that.pageType == '') {
                  uni.redirectTo({
                    url: 'list'
                  })
                } else {
                  uni.navigateBack({
                    delta: 1
                  })
                }
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
.page {
  min-height: 100vh;
  background: #f3f4f8;

  .form-wrap {
    padding: 22rpx 40rpx 0;
    box-sizing: border-box;

    .form,
    .form2 {
      border-radius: 20rpx;
      background: #ffffff;

      .item {
        padding: 0 40rpx;
        box-sizing: border-box;
        height: 118rpx;
        color: #1e1e1e;
        font-size: 32rpx;
        border-top: 2rpx solid #f3f4f8;

        // .uni-flex-ali {
        //   flex: 1;
        // }

        text {
          flex: 1;
        }

        .img {
          height: 100rpx;
          width: 100rpx;
          border-radius: 100%;
        }

        .input {
          color: #1e1e1e;
          height: 100rpx;
          font-size: 32rpx;
          text-align: right;
        }

        .pls {
          color: #a4a4a4;
        }
      }

      .item-img {
        height: 180rpx;
        border: none;
      }

      .item-list {
        height: 120rpx;
        border: none;
      }

      .gateway-list {
        border-top: 2rpx solid #f3f4f8;

        .way-item {
          border: none;
          height: 100rpx;
        }
      }
    }

    .form2 {
      margin-top: 20rpx;
    }
  }

  .save-btn {
    margin: 60rpx 0;

    .btn {
      width: 500rpx;
      height: 80rpx;
      color: #ffffff;
      font-size: 32rpx;
      border-radius: 8rpx;
      background: #ef4b5b;
    }
  }
}
</style>
