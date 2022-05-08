<!--
 * @Descripttion: 工业质检
 * @Author: SUI
 * @LastEditors: SUI
 * @LastEditTime: 2022-05-08 12:03:19
 * @FilePath: \MyChat\pages\chat\room\chat_booth.vue
-->
<template>
  <view v-if="pageLoad" class="chat-page">
    <video class="video-wrap" :src="videoUrl" autoplay controls="false"></video>
    <view class="chat-title">
      <uni-icons class="backHome" @click="backHome" type="arrowleft"></uni-icons>
      <text>{{ chatTitle }}</text>
    </view>

    <scroll-view
      id="scrollview"
      class="scroll-wrap"
      scroll-y="true"
      :style="{ height: scrollHeight }"
      :scroll-top="scrollTop"
      @scroll="scrollEvent"
      :refresher-threshold="140"
      :refresher-enabled="refresherenabled"
      refresher-background="#f5f5f5"
    >
      <view id="msglistview">
        <block v-for="(item, index) in msgList" :key="index">
          <!-- <view class="item_time_box">{{item.createdAt}}</view> -->
          <view v-if="item.type == 1" class="user_chat">
            <block v-if="item.content.type == '1'">
              <view class="rightMsg"
                ><text>{{ item.content.content }}</text></view
              >
            </block>
            <block v-if="item.content.type == '7'">
              <view class="content_item_url_wrap2">
                <view class="top_box" :class="item.content.content.state == 1 ? 'top_box1' : 'top_box2'" v-if="item.content.content.image != undefined">
                  <image class="slider-img" :src="item.content.content.image" mode=""></image>
                  <view>{{ item.content.content.brightness }}%</view>
                  <view class="slider-wrap">
                    <image class="slider-img-left" src="/static/img/other/left.png" mode=""></image>
                    <slider
                      class="slider-box"
                      :disabled="item.content.content.state == 0 ? true : false"
                      :value="item.content.content.brightness"
                      @change="sliderChange($event, item)"
                      :activeColor="item.content.content.state == 1 ? '#3296FA' : '#BDBDBD'"
                      backgroundColor="#BDBDBD"
                      block-color="#FFFFFF"
                      block-size="16"
                    />
                    <image class="slider-img-right" src="/static/img/other/right.png" mode=""> </image>
                  </view>
                </view>
                <view class="bottom_box">
                  <view>{{ item.content.content.title }}</view>
                  <switch :checked="item.content.content.state == 1 ? true : false" @change="switchChange($event, item)" color="#42DA60" style="transform: scale(0.9)" />
                </view>
              </view>
            </block>
            <view class="chat_item_box">
              <image class="chat_avatarUrl" :src="item.image"></image>
            </view>
          </view>
          <view v-else class="other_chat">
            <view class="chat_item_box">
              <image class="chat_avatarUrl" :src="item.image"></image>
            </view>
            <block v-if="item.content.type == '1'">
              <view class="leftMsg"
                ><text>{{ item.content.content }}</text></view
              >
            </block>
            <block v-if="item.content.type == '2'">
              <view class="content_item_box-wrap">
                <view class="content_item_box-item" v-for="(items, index2) in item.content.content" :key="index2" @click="clickInfo(items.content)">
                  <image class="content_item_box-icon" :src="items.icon"></image>
                  <text :style="{ color: items.color }">{{ items.content }}</text>
                </view>
              </view>
            </block>
            <block v-if="item.content.type == '3'">
              <view class="content_item_box-flex" @click="preview(item.content)">
                <image class="content_item_box-flex-img" :src="item.content.content.img" mode="aspectFill"></image>
                <view class="content_item_box-flex-right">
                  <view class="title">{{ item.content.content.title }}</view>
                  <view class="content">{{ item.content.content.content }}</view>
                </view>
              </view>
            </block>
            <block v-if="item.content.type == '4'">
              <view class="content_item_box-flex2">
                <view class="title">产品图片</view>
                <image :src="item.content.content.img" mode="aspectFill"></image>
              </view>
            </block>
            <block v-if="item.content.type == '5'">
              <view class="content_item_box-wrap">
                <view class="content_item_box-item" v-for="(items, index2) in item.content.content" :key="index2" @click="clickInfo(items.title)">
                  <image class="content_item_box-img" :src="items.img" mode="aspectFill"></image>
                  <view class="content_item_box-text">{{ items.title }}</view>
                </view>
              </view>
            </block>
            <block v-if="item.content.type == '6'">
              <view class="content_item_url_wrap">
                <view class="content_item_url_wrap_title">{{ item.content.title }}</view>
                <view class="content_item_url_item_box" v-for="(items, index2) in item.content.content" :key="index2" @click="clickInfo(items.name, items.type, items.url)">{{ items.name }} </view>
              </view>
            </block>
            <block v-if="item.content.type == '7'">
              <view class="content_item_url_wrap2">
                <view class="top_box" :class="item.content.content.state == 1 ? 'top_box1' : 'top_box2'" v-if="item.content.content.image != undefined">
                  <image class="slider-img" :src="item.content.content.image" mode=""></image>
                  <view>{{ item.content.content.brightness }}%</view>
                  <view class="slider-wrap">
                    <image class="slider-img-left" src="/static/img/other/left.png" mode=""></image>
                    <!-- 灯调亮度 -->
                    <slider
                      class="slider-box"
                      :disabled="item.content.content.state == 0 ? true : false"
                      :value="item.content.content.brightness"
                      @change="sliderChange($event, item)"
                      :activeColor="item.content.content.state == 1 ? '#3296FA' : '#BDBDBD'"
                      backgroundColor="#BDBDBD"
                      block-color="#FFFFFF"
                      block-size="16"
                    />
                    <image class="slider-img-right" src="/static/img/other/right.png" mode=""> </image>
                  </view>
                </view>
                <view class="bottom_box">
                  <view>{{ item.content.content.title }}</view>
                  <!-- 设备开关 -->
                  <switch :checked="item.content.content.state == 1 ? true : false" @change="switchChange($event, item)" color="#42DA60" style="transform: scale(0.9)" />
                </view>
              </view>
            </block>
            <!-- 工业质检 返回按钮 -->
            <block v-if="item.content.type == '8'">
              <view class="leftMsg" @click="navigateBack(item.content.subtype)"
                ><text class="back-text">{{ item.content.content }}</text></view
              >
            </block>
            <!-- 工业质检 切换流 -->
            <block v-if="item.content.type == '9'">
              <view class="content_item_url_wrap2">
                <view class="bottom_box">
                  <view class="bottom_box-item" v-for="(key, i) in item.content.content" :key="i" @click="iconChange(item.content.content, key, i)">
                    <uni-icons type="circle-filled" :color="key.bol ? '#51ADFF' : '#E3E3E3'" size="19" /><text>{{ key.name }}</text>
                  </view>
                </view>
              </view>
            </block>
          </view>
        </block>
        <view class="relay-mark" v-if="isRelay" @click="markEvent">
          <view class="relay-wrap" @click="relayEvent">
            <image class="relay-img" src="/static/img/other/relay.png" mode=""></image>
            <text>转发</text>
          </view>
        </view>
      </view>
    </scroll-view>
    <view class="inputRoom">
      <image class="left-img" src="/static/img/other/voice.png" mode="" @click="startRecognize"></image>
      <input
        :class="inputVal == '' ? 'bottom_input' : 'bottom_input2'"
        @input="inputvalue"
        @blur="blur"
        @focus="focus"
        placeholder="在此输入您想体验的算法演示"
        placeholder-class="place-class"
        confirm-type="send"
        @confirm="confirminp"
        :value="inputVal"
      />
      <view v-if="inputVal != ''" class="sendbtn" @click="sendClick">发送</view>
    </view>
  </view>
</template>

<script>
let app = require('@/common/common.js')
export default {
  data() {
    return {
      pageLoad: false,
      scrollTop: 1000,
      windowHeight: 0,
      inputVal: '',
      roomid: '',
      scrollHeight: '50vh',
      headimgurl: '',
      msgList: [],
      isRelay: false,
      refresherenabled: false,
      deviceId: '',
      videoUrl: '',
      chatTitle: ''
    }
  },
  onLoad(e) {
    let that = this
    uni.getSystemInfo({
      success: (res) => {
        that.windowHeight = res.windowHeight
        that.scrollHeight = res.windowHeight - 43 - 34 - 231 + 'px'
      }
    })
    that.videoUrl = 'rtsp://39.98.206.183/industry1'
    // 工业质检JSON
    app.industrial_json((res) => {
      that.msgList = res
    })

    if (typeof e.id != 'undefined') {
      that.roomid = e.id
      that.chatTitle = e.title
      let headimgurl = uni.getStorageSync('headimgurl')
      that.headimgurl = headimgurl
    }
    that.pageLoad = true
  },
  onShow() {
    uni.hideKeyboard()
  },
  methods: {
    scrollToBottom() {
      let that = this
      if (that.msgList.length > 0) {
        let query = uni.createSelectorQuery()
        query.select('#scrollview').boundingClientRect()
        query.select('#msglistview').boundingClientRect()
        query.exec((res) => {
          if (res[0] != null && res[1] != null) {
            if (res[1].height > res[0].height) {
              that.scrollTop = res[1].height - res[0].height
            }
          }
        })
      }
    },

    scrollEvent() {
      uni.hideKeyboard()
    },

    getHistory(type) {
      let that = this
      let data = {
        room: that.roomid
      }
      if (type) {
        data.type = type
      }
      // 历史
      app.chatHistory(data, (res) => {
        if (res.code == 0) {
          var chatArr = that.msgList
          let historyArr = []
          if (res.data.length > 0) {
            res.data.forEach((item, index) => {
              if (Object.prototype.toString.call(item.content) == '[object Object]') {
                historyArr.push(item)
              } else {
                item.content.forEach((key) => {
                  let obj = {}
                  obj.type = item.type
                  obj.image = item.image
                  obj.content = key
                  historyArr.push(obj)
                })
              }
            })
            that.msgList = historyArr
          }
          setTimeout(() => {
            that.pageLoad = true
            that.scrollToBottom()
            app.hideLoading()
            uni.hideKeyboard()
          }, 500)
        } else {
          app.showToast(res.message)
        }
      })
    },

    startRecognize() {
      uni.hideKeyboard()
      // 仅 APP-PLUS 编译
      // #ifdef APP-PLUS
      let that = this
      var text = ''
      var options = {}
      options.continue = true
      options.engine = 'iFly'
      options.punctuation = false
      options.timeout = 20 * 1000
      text = ''
      console.log('开始语音识别：')
      plus.speech.startRecognize(
        options,
        (s) => {
          text += s
          that.inputVal += text
        },
        (e) => {
          console.log('语音识别失败：' + e.message)
        }
      )
      // #endif
    },

    clickInfo(content, type, weburl) {
      let that = this
      if (typeof type == 'undefined') {
        let data = {
          name: content,
          type: 1,
          room: that.roomid
        }
        that.msgList.push({
          type: 1,
          image: that.headimgurl,
          content: {
            type: '1',
            content: content
          }
        })
        setTimeout(() => {
          that.scrollToBottom()
          that.chat(data)
        }, 500)
      } else {
        uni.navigateTo({
          url: `/pages/other/webview?url=${weburl}&&room=${that.roomid}`
        })
      }
    },

    focus(e) {},

    blur(e) {
      if (e.detail.value != '') {
        this.inputVal = e.detail.value
      }
      this.scrollHeight = this.windowHeight - 52 - 34 - 231 + 'px'
      uni.pageScrollTo({
        scrollTop: 0,
        duration: 0
      })
    },

    inputvalue(e) {
      this.inputVal = e.detail.value
    },

    confirminp(e) {
      let that = this
      if (e.detail.value != '') {
        uni.hideKeyboard()
        let data = {
          name: e.detail.value,
          room: that.roomid
        }
        that.inputVal = ''
        that.msgList.push({
          type: 1,
          image: that.headimgurl,
          content: {
            type: '1',
            content: e.detail.value
          }
        })
        setTimeout(() => {
          that.scrollToBottom()
          that.chat(data)
        }, 500)
      }
    },

    sendClick() {
      let that = this
      let value = this.inputVal
      let data = {
        name: value,
        room: that.roomid
      }
      this.inputVal = ''
      that.msgList.push({
        type: 1,
        image: that.headimgurl,
        content: {
          type: '1',
          content: value
        }
      })
      setTimeout(() => {
        that.scrollToBottom()
        that.chat(data)
      }, 500)
    },

    chat(data) {
      let that = this
      that.inputVal = ''
      setTimeout(() => {
        // 发消息
        app.chatRequest(data, (res) => {
          if (res.code == 0) {
            let arr = res.data
            if (arr.content && arr.content.length > 0) {
              arr.content.forEach((key) => {
                let obj = {}
                obj.type = arr.type
                obj.image = arr.image
                obj.content = key
                that.msgList.push(obj)
              })
            }
            setTimeout(() => {
              that.scrollToBottom()
            }, 500)
          } else {
            app.showToast(res.message)
          }
        })
      }, 1000)
    },

    preview(e) {
      console.log(e.subtype, e.content)
      let that = this
      var type = e.subtype
      var pullurl = e.pullurl
      var pushurl = e.pushurl
      var videotype = e.videotype
      var content = e.content
      uni.hideKeyboard()
      switch (type) {
        case '1':
          // 仅 APP-PLUS 编译
          // #ifdef APP-PLUS
          uni.navigateTo({
            url: `/pages/other/video?type=${videotype}&&pullurl=${pullurl}&&pushurl=${pushurl}`
          })
          // #endif
          break
        case '2':
          setTimeout(() => {
            let arr = content.list
            uni.previewImage({
              current: 0,
              urls: arr,
              longPressActions: {
                itemList: ['添加到个人收藏'],
                success: (e) => {
                  if (e.tapIndex == 0) {
                    let data = {
                      room: that.roomid,
                      doc: content.doc
                    }
                    // 收藏
                    app.favorite(data, (res) => {
                      if (res.code == 0) {
                        app.showToast('收藏成功')
                      } else {
                        app.showToast(res.message)
                      }
                    })
                  }
                },
                fail: (err) => {
                  console.log(err.errMsg)
                }
              }
            })
          }, 500)
          break
        case '3':
          // 仅 APP-PLUS 编译
          // #ifdef APP-PLUS
          if (content.url) {
            uni.navigateTo({
              url: `/pages/other/preview?url=${content.url}&&poster=${content.img}`
            })
          }
          // #endif
          break
        default:
          break
      }
    },

    sliderChange(e, item) {
      let that = this
      let data = {
        room: that.roomid,
        brightness: e.detail.value
      }
      // 改亮度
      app.device_brightness(data, (res) => {
        if (res.code == 0) {
          item.content.content.brightness = e.detail.value
        } else {
          app.showToast(res.message)
        }
      })
    },

    switchChange(e, item) {
      let that = this
      let data = {}
      switch (item.content.content.id) {
        case '1':
          data.action = e.detail.value ? 'turn_on' : 'turn_off'
          // 工业质检-开关
          app.device_light(data, (res) => {
            if (res.code == 0) {
            } else {
              app.showToast(res.message)
            }
          })
          break
        default:
          data.action = e.detail.value ? 'start' : 'stop'
          // 工业质检-转盘
          app.device_motor(data, (res) => {
            if (res.code == 0) {
            } else {
              app.showToast(res.message)
            }
          })
          break
      }
    },

    devicEvent(id) {
      this.isRelay = true
      this.deviceId = id
    },

    markEvent() {
      this.isRelay = false
    },

    relayEvent() {
      let id = this.deviceId
      let room = this.roomid
      uni.navigateTo({
        url: `/pages/contacts/contacts_two?room=${room}&&id=${id}`
      })
    },

    navigateBack(type) {
      if (type == '1') {
        console.log('Android')
        plus.runtime.launchApplication(
          {
            pname: 'com.example.thunder'
          },
          (e) => {
            console.log('Open system default browser failed: ' + e.message)
          }
        )
      } else {
        uni.switchTab({
          url: '/pages/chat/list'
        })
      }
    },

    iconChange(items, key, i) {
      items.forEach((item) => {
        item.bol = false
        key.bol = true
      })
      this.videoUrl = items[i].url
    },

    backHome() {
      uni.switchTab({
        url: '/pages/chat/list'
      })
    }
  }
}
</script>

<style scoped lang="scss">
.chat-page {
  min-height: 100vh;
  background: #ffffff;
}

.scroll-wrap {
  background: #f5f5f5;
}

.item_time_box {
  margin: 20upx 0;
  height: 44upx;
  line-height: 44upx;
  border-radius: 22upx;
  text-align: center;
  font-size: 24upx;
  color: #8f8f8f;
}

.other_chat {
  display: flex;
  padding: 20upx 16upx;
  box-sizing: border-box;
  overflow: hidden;
}

.chat_item_box {
  width: 80upx;
  height: 80upx;
  line-height: 80upx;
}

.chat_avatarUrl {
  width: 80upx;
  height: 80upx;
  border-radius: 100%;
}

.user_chat {
  display: flex;
  justify-content: flex-end;
  padding: 20upx 16upx;
  box-sizing: border-box;
}

.leftMsg {
  max-width: 496upx;
  font-size: 32upx;
  color: #373737;
  line-height: 1.5;
  padding: 22upx;
  box-sizing: border-box;
  background-color: #fff;
  margin-left: 16upx;
  border-radius: 20upx;
  z-index: 10;
  box-shadow: 0px 0px 4px 0px rgba(204, 204, 204, 0.5);
}

.rightMsg {
  max-width: 496upx;
  font-size: 32upx;
  color: #fff;
  line-height: 1.5;
  padding: 22upx;
  box-sizing: border-box;
  background-color: #51adff;
  margin-right: 16upx;
  border-radius: 20upx;
  z-index: 10;
}

.content_item_box-wrap {
  width: 496upx;
  margin-left: 16upx;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 24upx;
  box-sizing: border-box;
  background: #ffffff;
  border-radius: 20upx;
}

.content_item_box-item {
  width: 216upx;
  height: 180upx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f9f9f9;
  border-radius: 20upx;
  font-size: 30upx;
  margin-top: 14upx;
  position: relative;
  overflow: hidden;
}

.content_item_box-item:nth-of-type(1),
.content_item_box-item:nth-of-type(2) {
  margin-top: 0;
}

.content_item_box-icon {
  width: 80upx;
  height: 80upx;
  margin-bottom: 22upx;
}

.content_item_box-flex {
  margin-left: 16upx;
  width: 496upx;
  height: 204upx;
  border-radius: 20upx;
  display: flex;
  align-items: center;
  background: #ffffff;
  padding: 24upx;
  box-sizing: border-box;
}

.content_item_box-flex-img {
  width: 156upx;
  height: 156upx;
  border-radius: 8upx;
}

.content_item_box-flex-right {
  flex: 1;
  height: 100%;
  margin-left: 16upx;
}

.content_item_box-flex-right .title {
  color: #1e1e1e;
  font-weight: 500;
  font-size: 36upx;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.content_item_box-flex-right .content {
  /* height: 82upx; */
  line-height: 1.4;
  color: #7e7e7e;
  font-size: 32upx;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-top: 10upx;
}

.content_item_box-flex2 {
  margin-left: 16upx;
  width: 496upx;
  background: #ffffff;
  border-radius: 20upx;
  padding: 24upx;
  box-sizing: border-box;
}

.content_item_box-flex2 .title {
  color: #1e1e1e;
  font-size: 32upx;
}

.content_item_box-flex2 image {
  width: 444upx;
  height: 500upx;
  margin-top: 10upx;
  border-radius: 8upx;
}

.content_item_box-img {
  width: 100%;
  height: 100%;
  border-radius: 8upx;
}

.content_item_box-text {
  color: #ffffff;
  font-size: 26upx;
  position: absolute;
  width: 100%;
  bottom: 0;
  height: 58upx;
  line-height: 58upx;
  text-align: center;
  background: rgba(22, 22, 22, 1);
  border-radius: 0px 0px 20upx 20upx;
  opacity: 0.9;
}

.inputRoom {
  width: 100%;
  height: 104upx;
  padding: 0 24upx;
  position: fixed;
  bottom: 2upx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f7f7f7;
  z-index: 20;
  box-sizing: border-box;
  border-top: solid 1px rgba(216, 220, 221, 0.3);
}

.inputRoom .left-img {
  width: 48upx;
  height: 48upx;
}

.bottom_input {
  width: 640upx;
  height: 72upx;
  line-height: 72upx;
  padding-left: 14upx;
  background: #ffffff;
  border-radius: 42upx;
  box-sizing: border-box;
}

.bottom_input2 {
  width: 500upx;
  height: 72upx;
  line-height: 72upx;
  padding-left: 14upx;
  background: #ffffff;
  border-radius: 42upx;
  box-sizing: border-box;
}

.place-class {
  color: #b2b2b2;
  font-size: 32upx;
  text-align: center;
}

.sendbtn {
  width: 120upx;
  height: 66upx;
  color: #ffffff;
  font-size: 28upx;
  line-height: 66upx;
  text-align: center;
  background: #51adff;
  border-radius: 10upx;
}

.content_item_url_wrap {
  margin-left: 16upx;
  width: 496upx;
  padding: 0 24upx;
  box-sizing: border-box;
  background: #ffffff;
  border-radius: 20upx;
}

.content_item_url_wrap2 {
  margin-left: 16upx;
  width: 496upx;
  background: #ffffff;
  border-radius: 20upx;
}

.content_item_url_wrap2 .top_box {
  text-align: center;
  padding: 44upx 24upx;
  box-sizing: border-box;
  border-bottom: solid 1px rgba(226, 226, 226, 0.8);
}

.content_item_url_wrap2 .top_box1 {
  opacity: 1;
}

.content_item_url_wrap2 .top_box2 {
  opacity: 0.4;
}

.content_item_url_wrap2 .slider-img {
  width: 274upx;
  height: 274upx;
}

.content_item_url_wrap2 .slider-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.content_item_url_wrap2 .slider-img-left {
  width: 36upx;
  height: 34upx;
}

.content_item_url_wrap2 .slider-img-right {
  width: 48upx;
  height: 46upx;
}

.content_item_url_wrap2 .slider-box {
  flex: 1;
  padding: 0;
  margin: 0 20upx;
}

.content_item_url_wrap2 .bottom_box {
  font-size: 32upx;
  color: #1e1e1e;
  height: 104upx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24upx;
  box-sizing: border-box;
}

.content_item_url_wrap2 .bottom_box-item {
  display: flex;
  align-items: center;
}

.content_item_url_wrap2 .bottom_box-item text {
  color: #1e1e1e;
  font-size: 24upx;
  margin-left: 8upx;
}

.content_item_url_wrap_title {
  color: #1e1e1e;
  font-size: 32upx;
  padding: 22upx 0;
  box-sizing: border-box;
  border-bottom: solid 1upx rgba(224, 224, 224, 0.9);
}

.content_item_url_item_box {
  color: #3296fa;
  font-size: 30upx;
  padding: 18upx 0;
}

.relay-mark {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  z-index: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(76, 76, 76, 0.1);
}

.relay-wrap {
  color: #ffffff;
  font-size: 28upx;
  width: 298upx;
  height: 162upx;
  background: #4c4c4c;
  border-radius: 20upx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.relay-img {
  width: 42upx;
  height: 44upx;
  margin-bottom: 14upx;
}

.video-wrap {
  width: 100%;
  height: 462upx;
  margin: 0;
  padding: 0;
}

.chat-title {
  color: #1e1e1e;
  font-size: 32upx;
  width: 750upx;
  height: 64upx;
  /* line-height: 64upx; */
  text-align: center;
  background: #ffffff;
  margin-top: -6upx;
  padding: 0;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.backHome {
  position: absolute;
  left: 0;
  padding: 0 18upx;
}

.back-text {
  color: #3296fa;
  font-size: 28upx;
}
</style>
