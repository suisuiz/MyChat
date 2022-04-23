<!--
 * @Descripttion: 智能助手
 * @Author: SUI
 * @Company: chorustek
 * @Date: 2021-07-01 15:55:57
 * @Version: 1.0.0
 * @LastEditors: SUI
 * @LastEditTime: 2021-08-05 11:01:25
 * @FilePath: \things\pages\device\smart_setting.vue
-->
<template>
  <view class="page" v-if="pageLoad">
    <!-- 推荐列表 -->
    <view class="recommend-wrap">
      <view class="recommend-line"></view>
      <block v-for="(item, index) in listData" :key="index">
        <view class="recommend-item" @click="recommendEvent(item.id)">
          <view class="recommend-left">
            <view class="recommend-left-title">{{ item.title }}</view>
            <view class="recommend-left-time">{{ item.time }}</view>
            <view class="recommend-left-bottom">
              <view class="recommend-price">{{ item.price }}</view>
              <image class="recommend-avatar" :src="item.avatar"></image>
            </view>
          </view>
          <view>
            <image
              class="recommend-item-shop"
              mode="aspectFill"
              :src="item.shop"
            ></image>
          </view>
        </view>
        <view class="recommend-line"></view>
      </block>
    </view>
    <!-- 蒙版内容 -->
    <view class="mask-wrap">
      <!-- 标题 -->
      <view class="mask-top" @click="shopEvent">
        <view class="mask-top-title">咖啡</view>
        <view class="mask-top-right"></view>
      </view>
      <!-- 内容 -->
      <view class="mask-bottom">
        <!-- 第一部分 -->
        <view
          class="mask-bottom-wrap"
          @touchstart="touchstart"
          @touchend="touchend"
          v-if="!showChat"
        >
          <view class="mask-box">
            <!-- 聊天 -->
            <view class="mask-chat" @touchstart="chattouchstart">
              <!-- 聊天展示 -->
              <scroll-view
                class="chat-scroll"
                scroll-y
                :scroll-with-animation="scrollAnimation"
                :scroll-top="scrollTop"
                :scroll-into-view="scrollToView"
              >
                <view
                  class="chat-scroll-item"
                  :class="
                    item.type == 1 ? 'chat-scroll-me' : 'chat-scroll-other'
                  "
                  :id="'msg' + index"
                  v-for="(item, index) in chatList"
                  :key="index"
                  ><view
                    class="chat-scroll-chat"
                    :class="
                      item.type == 1 ? 'chat-scroll-me' : 'chat-scroll-other'
                    "
                    >{{ item.text }}</view
                  ></view
                >
              </scroll-view>
              <!-- 输入框 -->
              <view class="chat-wrap">
                <!-- 正常输入框 -->
                <view class="chat-bottom" v-if="!recording">
                  <!-- 切换语音、文字 -->
                  <view class="chat-bottom-voice" @tap="switchVoice">···</view>
                  <!-- 文字输入框 -->
                  <view class="chat-bottom-textbox" v-if="!isVoice">
                    <input v-model="inputVal" />
                  </view>
                  <!-- 语音按钮 -->
                  <view class="chat-bottom-voicebtn" v-if="isVoice"
                    >按住 说话</view
                  >
                  <!-- 文字按钮 -->
                  <view class="chat-bottom-send" @tap="chatSend">发送</view>
                </view>
                <!-- 滑动蒙版 -->
                <view
                  class="chat-mask"
                  v-if="isVoice"
                  @touchstart="voiceBegin"
                  @touchmove.stop.prevent="voiceIng"
                  @touchend="voiceEnd"
                  @touchcancel="voiceCancel"
                ></view>
                <!-- 语音输入框 -->
                <view
                  class="chat-voice"
                  :class="willStop ? 'change-voice' : ''"
                  v-if="recording"
                  >{{ recordTis }}
                  <view class="uni-icon uni-icon-trash chat-voice-icon"></view>
                </view>
              </view>
            </view>
          </view>
        </view>
        <!-- 第二部分 -->
        <view class="mask-bottom-content">
          <scroll-view class="scroll-view" scroll-x>
            <view
              class="scroll-view-item"
              v-for="(item, index) in imageList"
              :key="index"
              @click="scrollEvent(item.id)"
            >
              <image
                class="scroll-view-img"
                mode="aspectFill"
                :src="item.img"
              ></image>
            </view>
          </scroll-view>
        </view>
      </view>
    </view>
    <!-- 侧边按钮 -->
    <view class="side-wrap" @tap="showChat = !showChat" v-if="showChat">
      <view class="side-wrap-line"></view>
      <view class="side-wrap-line"></view>
    </view>
  </view>
</template>
<script>
let app = require('@/common/common.js')
export default {
  data() {
    return {
      pageLoad: false,
      // 推荐列表
      listData: [
        {
          id: 1,
          title: '招牌美式咖啡-PLUS会员价10元',
          time: '2021-7-1  13:28',
          price: '￥10.00',
          shop: 'https://img1.baidu.com/it/u=1933311266,1203412646&fm=26&fmt=auto&gp=0.jpg',
          avatar: 'https://profile.csdnimg.cn/4/A/B/3_qq_37049128'
        },
        {
          id: 2,
          title: '[澳白]会员价10元（堂饮）',
          time: '2021-7-1  13:28',
          price: '￥10.00',
          shop: 'https://img1.baidu.com/it/u=1404190503,2129214244&fm=26&fmt=auto&gp=0.jpg',
          avatar: 'https://profile.csdnimg.cn/4/A/B/3_qq_37049128'
        },
        {
          id: 3,
          title: '卡布奇诺-PLUS会员价10元',
          time: '2021-7-1  13:28',
          price: '￥10.00',
          shop: 'https://img0.baidu.com/it/u=2841002308,674808203&fm=26&fmt=auto&gp=0.jpg',
          avatar: 'https://profile.csdnimg.cn/4/A/B/3_qq_37049128'
        },
        {
          id: 4,
          title: '摩卡-PLUS会员价10元',
          time: '2021-7-1  13:28',
          price: '￥10.00',
          shop: 'https://img2.baidu.com/it/u=1301874636,4290811335&fm=26&fmt=auto&gp=0.jpg',
          avatar: 'https://profile.csdnimg.cn/4/A/B/3_qq_37049128'
        }
      ],
      // scroll 列表
      imageList: [
        {
          id: 1,
          img: 'https://img1.baidu.com/it/u=1404190503,2129214244&fm=26&fmt=auto&gp=0.jpg'
        },
        {
          id: 2,
          img: 'https://img1.baidu.com/it/u=1933311266,1203412646&fm=26&fmt=auto&gp=0.jpg'
        },
        {
          id: 3,
          img: 'https://img2.baidu.com/it/u=1301874636,4290811335&fm=26&fmt=auto&gp=0.jpg'
        },
        {
          id: 4,
          img: 'https://img0.baidu.com/it/u=2841002308,674808203&fm=26&fmt=auto&gp=0.jpg'
        }
      ],
      // 聊天列表
      chatList: [
        {
          id: 1,
          type: 1,
          text: '小丫给我来杯美式咖啡'
        },
        {
          id: 2,
          type: 2,
          text: '好的张先生'
        },
        {
          id: 3,
          type: 2,
          text: '澳白套餐推荐给您'
        },
        {
          id: 4,
          type: 1,
          text: '好的张先生'
        },
        {
          id: 5,
          type: 2,
          text: '澳白套餐推荐给您'
        },
        {
          id: 6,
          type: 2,
          text: '祝您用餐愉快'
        }
      ],

      // 聊天scroll-view 滑动ID
      scrollToView: '',
      scrollAnimation: false,
      scrollTop: 9999,
      isVoice: true,
      inputVal: '',

      // 滑动事件数据
      touchData: {},
      // 滑动显示
      touchBol: true,
      showChat: false,

      // 语音
      RECORDER: uni.getRecorderManager(),
      recordTis: '松开 发送',
      recording: false,
      willStop: false,
      initPoint: {
        identifier: 0,
        Y: 0
      }
    }
  },
  onLoad() {
    let tokenObj = app.getToken()
    // console.log(tokenObj);
    if (!tokenObj || !tokenObj.token) {
      uni.reLaunch({
        url: '/pages/user/login'
      })
    } else {
      this.pageLoad = true
      this.scrollAnimation = true
      setTimeout(() => {
        this.scrollToBottom()
        uni.hideKeyboard()
      }, 500)

      // #ifndef H5
      //录音开始事件
      this.RECORDER.onStart((e) => {
        this.recordBegin(e)
      })
      //录音结束事件
      this.RECORDER.onStop((e) => {
        this.recordEnd(e)
      })
      // #endif
    }
  },
  methods: {
    // 滚动至聊天内容底部
    scrollToBottom() {
      let that = this
      if (that.chatList.length > 0) {
        // 滚动到底
        that.scrollToView = 'msg' + (that.chatList.length - 1)
      }
    },

    // 推荐列表
    recommendEvent(id) {
      // console.log("推荐列表===", id);
    },

    // 进入店铺
    shopEvent() {
      console.log('点击进入店铺')
    },

    // scroll 点击事件
    scrollEvent(id) {
      console.log('scroll-id===', id)
    },

    touchstart(e) {
      this.touchData.clientX = e.changedTouches[0].clientX
      this.touchData.clientY = e.changedTouches[0].clientY
    },
    touchend(e) {
      let subX = e.changedTouches[0].clientX - this.touchData.clientX
      let subY = e.changedTouches[0].clientY - this.touchData.clientY
      // console.log("subX===", subX);
      // console.log("subY===", subY);
      if (!this.touchBol) {
        subX = 0
        subY = 0
      }
      if (subY > 100) {
        // console.log('下滑')
      }
      if (subY < -100) {
        // console.log('上滑')
      }
      if (subX > 100) {
        // console.log('右滑');
        this.showChat = true
      }
      if (subX < -100) {
        // console.log('左滑')
        this.showChat = true
      }
      this.scrollAnimation = false
      this.touchBol = true
    },

    chattouchstart() {
      this.touchBol = false
    },

    // 切换语音、输入框
    switchVoice() {
      this.isVoice = !this.isVoice
    },

    // 发送按钮
    chatSend() {
      if (this.inputVal == '') {
        return
      }
      this.chatList.push({
        id: 1,
        type: 1,
        text: this.inputVal
      })
      this.scrollAnimation = true
      setTimeout(() => {
        this.scrollToBottom()
        uni.hideKeyboard()
      }, 500)
      this.inputVal = ''
    },

    // 录音开始
    voiceBegin(e) {
      if (e.touches.length > 1) {
        return
      }
      console.log('录音开始')
      this.initPoint.Y = e.touches[0].clientY
      this.initPoint.identifier = e.touches[0].identifier
      // 录音开始
      this.RECORDER.start({
        format: 'mp3'
      })

      // this.recording = true;
      // this.recordTimer = setInterval(() => {
      // 	this.recordLength++;
      // }, 1000)
    },

    // 录音开始效果
    recordBegin(e) {
      console.log('录音开始效果')
      this.recording = true
      this.recordTimer = setInterval(() => {
        this.recordLength++
      }, 1000)
    },

    // 录音被打断
    voiceCancel() {
      console.log('录音被打断')
      this.recording = false
      this.recordTis = '松开 发送'
      // 不发送录音
      this.willStop = true
      // 录音结束
      this.RECORDER.stop()
    },

    // 录音中(判断是否触发上滑取消发送)
    voiceIng(e) {
      if (!this.recording) {
        return
      }
      let touche = e.touches[0]
      // 上滑一个导航栏的高度触发上滑取消发送
      if (this.initPoint.Y - touche.clientY >= uni.upx2px(100)) {
        this.willStop = true
        this.recordTis = '松开手指 取消发送'
      } else {
        this.willStop = false
        this.recordTis = '松开 发送'
      }
    },

    // 结束录音
    voiceEnd(e) {
      if (!this.recording) {
        return
      }
      console.log('结束录音')
      this.recording = false
      this.recordTis = '松开 发送'

      // 录音结束
      this.RECORDER.stop()
      app.showLoading()
    },

    //录音结束(回调文件)
    recordEnd(e) {
      clearInterval(this.recordTimer)
      if (!this.willStop) {
        console.log('e: ' + JSON.stringify(e))
        app.hideLoading()
        let tempFilePaths = e.tempFilePath
        let that = this
        let urlpaht = app.apiHost

        this.chatList.push({
          id: 1,
          type: 1,
          text: '我发了句语音'
        })
        this.scrollAnimation = true
        setTimeout(() => {
          this.scrollToBottom()
          uni.hideKeyboard()
        }, 500)
      } else {
        app.hideLoading()
        app.showToast('取消发送录音')
        // console.log('取消发送录音');
      }
      this.willStop = false
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  position: relative;
  min-height: 100vh;
  background-image: url(http://39.99.139.115/wuchat/bk.png);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;

  // 推荐列表
  .recommend-wrap {
    padding: 0 40upx;
    box-sizing: border-box;

    .recommend-line {
      height: 20upx;
    }

    .recommend-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #202020;
      height: 160upx;
      margin: auto;
      padding: 0 20upx;
      background: rgba(250, 250, 250, 0.85);
      border-radius: 10upx;
      box-sizing: border-box;

      .recommend-left {
        flex: 1;
        margin-right: 30upx;

        &-title {
          font-size: 28upx;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }

        &-time {
          font-size: 24upx;
        }

        &-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;

          .recommend-price {
            font-size: 36upx;
            font-weight: 600;
          }

          .recommend-avatar {
            width: 50upx;
            height: 50upx;
            border-radius: 100%;
          }
        }
      }

      &-shop {
        width: 160upx;
        height: 124upx;
        border-radius: 4upx;
      }
    }
  }

  // 蒙版
  .mask-wrap {
    position: fixed;
    bottom: 0;
    width: 100%;
    z-index: 99;

    // 标题
    .mask-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 120upx;
      padding: 0 40upx;
      background: rgba(33, 33, 33, 0.6);
      box-sizing: border-box;

      &-title {
        color: #ffffff;
        font-size: 32upx;
      }

      &-right {
        width: 24upx;
        height: 24upx;
        border-top: 4upx solid #ffffff;
        border-right: 4upx solid #ffffff;
        transform: rotate(45deg);
      }
    }

    // 内容
    .mask-bottom {
      background: #171c3f;

      // 第一部分
      &-wrap {
        padding: 64upx 40upx 0;
        box-sizing: border-box;
        animation: animations 1s forwards;

        @keyframes animations {
          from {
            opacity: 0.3;
          }
          to {
            opacity: 1;
          }
        }

        .mask-box {
          position: relative;
          // width: 650upx;
          height: 320upx;
          border-radius: 24upx;
          background: #1d213e;
          box-shadow: 0px 2upx 22upx 0px rgba(207, 207, 207, 0.37);
          background-image: url(http://39.99.139.115/wuchat/person2.png);
          background-position: 10% 100%;
          background-repeat: no-repeat;

          // 聊天
          .mask-chat {
            position: absolute;
            right: 20upx;
            top: 20upx;
            width: 400upx;
            height: 280upx;
            color: #ffffff;
            border-radius: 24upx;
            border: 1px solid #404568;
            overflow: hidden;

            // 聊天展示
            .chat-scroll {
              padding: 0 20upx;
              box-sizing: border-box;
              height: 196upx;

              &-item {
                margin-top: 18upx;
              }

              &-me {
                display: flex;
              }

              &-other {
                display: flex;
                justify-content: flex-end;
              }

              &-chat {
                width: 90%;
                font-size: 24upx;
                word-break: break-word;
              }
            }

            // 输入框
            .chat-wrap {
              // position: relative;
              position: absolute;
              bottom: 0;
              width: 100%;

              // 正常输入框
              .chat-bottom {
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 100%;
                height: 80upx;
                padding: 0 20upx;
                box-sizing: border-box;

                &-voice {
                  flex-shrink: 0;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  width: 66upx;
                  height: 46upx;
                  font-size: 18upx;
                  background: #f9718c;
                  border-radius: 10upx;
                }

                &-voicebtn {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  width: 192upx;
                  height: 50upx;
                  font-size: 20upx;
                  background: #595e7f;
                  border-radius: 24upx;
                }

                &-textbox {
                  display: flex;
                  align-items: center;
                  width: 192upx;
                  height: 50upx;
                  line-height: 50upx;
                  font-size: 20upx;
                  padding-left: 10upx;
                  box-sizing: border-box;
                  background: #595e7f;
                  border-radius: 24upx;

                  input {
                    font-size: 20upx;
                  }
                }

                &-send {
                  flex-shrink: 0;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  width: 68upx;
                  height: 46upx;
                  font-size: 20upx;
                  background: #f9718c;
                  border-radius: 10upx;
                }
              }

              // 滑动蒙版
              .chat-mask {
                position: absolute;
                left: 98rpx;
                bottom: 16rpx;
                width: 200rpx;
                height: 60rpx;
                // background: #202020;
              }

              // 语音输入框
              .chat-voice {
                position: relative;
                width: 100%;
                height: 74upx;
                line-height: 74upx;
                text-align: center;
                font-size: 20upx;
                background: #595e7f;
                border-radius: 200% 200% 0 0;

                &-icon {
                  position: absolute;
                  top: -50upx;
                  left: 188upx;
                  font-size: 30upx;
                  background: #595e7f;
                }
              }
              .change-voice {
                background: #f9718c;
              }
            }
          }
        }
      }

      // 第二部分
      &-content {
        padding: 64upx 40upx;
        box-sizing: border-box;

        .scroll-view {
          width: 100%;
          display: flex;
          white-space: nowrap;

          &-item {
            display: inline-block;
            width: 236upx;
            height: 160upx;
            margin-left: 20upx;
            border-radius: 10upx;
            overflow: hidden;
          }

          &-item:nth-of-type(1) {
            margin-left: 0;
          }

          &-img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }

  // 侧边按钮
  .side-wrap {
    position: fixed;
    right: 0;
    bottom: 470upx;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 70upx;
    height: 80upx;
    border-radius: 40px 0px 0px 40px;
    background: #171c3f;
    z-index: 99;

    &-line {
      width: 20upx;
      height: 20upx;
      border-top: 4upx solid #ffffff;
      border-right: 4upx solid #ffffff;
      transform: rotate(-135deg);
    }
  }
}
</style>
