<!--
 * @Descripttion: 上传文件
 * @Author: SUI
 * @LastEditTime: 2022-05-08 11:51:06
 * @FilePath: \MyChat\components\contents\UploadFile\UploadFile.vue
-->
<template>
  <view>
    <!-- 上传文件 -->
    <lsj-upload ref="lsjUpload" height="100%" :childId="id" :size="2048" :option="option" position="static" v-model="percent" @input="onInput" @callback="onCallback">
      <!-- 这里可以自定义上传样式 -->
      <!-- <view class="btn" style="height: 180rpx">选择附件上传</view> -->
      <view class="btn"><rich-text :nodes="msgnodes"></rich-text></view>
    </lsj-upload>
  </view>
</template>

<script>
let app = require('@/common/common.js')

export default {
  name: 'UploadFile',
  props: {
    msgid: {
      type: String,
      default: '0'
    },
    msgnodes: {
      type: String,
      default: '上传文件'
    },
    receiveid: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      option: {},
      percent: ''
    }
  },

  mounted() {
    console.log('子组件')
    // this.$refs.lsjUpload.show()
    // 初始化参数并创建上传DOM
    console.log(this.msgid)
    this.onCreate()
  },

  destroyed() {
    console.log('离开')
  },
  methods: {
    onCreate() {
      // 初始化参数并创建上传DOM
      let urls = `http://${uni.getStorageSync('localAddress')}:8201/upload_video`
      this.option = {
        // #ifdef APP-PLUS
        cuWebview: this.$mp.page.$getAppWebview(), // app必传
        // #endif
        url: urls, //替换为你的接口地址
        name: 'file', // 附件key
        size: 2048, // 附件上传大小上限(M)，默认10M
        debug: true,
        position: 'static',
        //根据你接口需求自定义请求头
        header: {
          token: app.getToken().token
        },
        //根据你接口需求自定义body参数
        formData: {
          detailid: this.receiveid,
          msgid: this.msgid
        }
      }
    },
    onInput(e) {
      console.log('上传进度', e)
      // app.showLoading()
    },
    onCallback(e) {
      console.log('上传结果', e)
      // {
      // 	"success": "true",
      // 	"fileName": "mmexport1638334757614.jpg",
      // 	"status": "200",
      // 	"responseText": "{\"code\":0}",
      // 	"msg": "上传成功"
      // }
      let res = JSON.parse(e.responseText)
      if (res.code === 0) {
        // app.hideLoading()
        app.showToast('上传成功')
      } else {
        app.showToast(res.message)
      }
      // this.$refs.lsjUpload.hide()
    }
  }
}
</script>

<style scoped>
.btn {
  align-self: baseline;
  /* position: relative; */
  padding: 30rpx;
  box-sizing: border-box;
  max-width: 450rpx;
  line-height: 1.5;
  font-size: 32rpx;
  color: #2f2f2e;
  word-break: break-word;
  border-radius: 2rpx 40rpx 40rpx 40rpx;
  background: #f4f5fa;
  z-index: 10;
}
</style>
