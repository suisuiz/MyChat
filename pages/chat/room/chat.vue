<!--
 * @Descripttion: 聊天-单聊和群聊
 * @Author: SUI
 * @Company: chorustek
 * @Date: 2020-10-15 16:32:00
 * @Version: 1.0.0
 * @LastEditors: SUI
 * @LastEditTime: 2021-12-21 10:04:05
 * @FilePath: \things\pages\chat\room\chat.vue
-->
<template>
  <view v-if="pageLoad" class="chat-page">
    <!-- 消息展示 -->
    <view @touchstart="hideDrawer">
      <!-- 
					scroll-view文档: https://uniapp.dcloud.io/component/scroll-view?id=scroll-view

					scroll-y								 允许纵向滚动
					upper-threshold					 距顶部 xx px 时，触发 scrolltoupper 事件
					scroll-top							 设置竖向滚动条位置
					scroll-into-view				 值为子元素id（id不能以数字开头）滚动到该元素
					scroll-with-animation		 在设置滚动条位置时使用动画过渡
					refresher-enabled				 开启自定义下拉刷新
					refresher-threshold			 设置自定义下拉刷新阈值
					refresher-default-style  设置自定义下拉刷新默认样式，支持设置 black，white，none，none 表示不使用默认样式
					refresher-background		 设置自定义下拉刷新区域背景颜色
					refresher-triggered			 设置当前下拉刷新状态，true 表示下拉刷新已被触发，false 表示下拉刷新未被触发
					@scrolltoupper					 滚动到顶部/左边，会触发 scrolltoupper 事件
					@scroll									 滚动触发，{scrollLeft, scrollTop, scrollHeight, scrollWidth, deltaX, deltaY}
					@refresherpulling				 自定义下拉刷新控件被下拉
					@refresherrefresh				 自定义下拉刷新被触发
					@refresherrestore				 自定义下拉刷新被复位
					@refresherabort					 自定义下拉刷新被中止
			 -->
      <scroll-view
        class="scroll_view"
        :style="{ height: scrollHeight }"
        scroll-y
        upper-threshold="50"
        :scroll-top="scrollTop"
        :scroll-into-view="scrollToView"
        :scroll-with-animation="scrollAnimation"
        :refresher-enabled="enabledBol"
        :refresher-threshold="100"
        refresher-default-style="black"
        :refresher-triggered="triggeredBol"
        @scrolltoupper="onUpper"
        @scroll="scrollEvent"
        @refresherpulling="onPulling"
        @refresherrefresh="onRefresh"
        @refresherrestore="onRestore"
        @refresherabort="onAbort"
      >
        <!-- 消息列表--遍历 -->
        <view class="chat-wrap">
          <view v-for="(item, index) in msgList" :key="'A' + index" :id="'mg' + index">
            <!-- 入群通知 -->
            <view class="item_msg_box" v-if="(item.content.type == '1') & (item.content.subtype == '5')">
              <text class="msg_box">{{ item.content.msg }}</text>
            </view>
            <!-- 没有入群通知样式 -->
            <block v-else>
              <!-- 对话时间 -->
              <!-- <view class="item_time_box">{{item.time}}</view> -->
              <!-- 用户消息--自己发的消息 -->
              <view v-if="item.userid == userid" class="user_chat">
                <!-- 基础消息 type=1 -->
                <block v-if="item.content.type == '1'">
                  <!-- 文字消息subtype=1 -->
                  <view v-if="item.content.subtype == '1'" class="rightMsg">
                    <rich-text :nodes="item.content.content"></rich-text>
                  </view>
                  <!-- 语言消息subtype=2 -->
                  <view v-if="item.content.subtype == '2'" class="rightMsg_voice" @tap="playVoice(item.content)">
                    <view class="length"></view>
                    <view class="icon uni-flex-ali my-voice"></view>
                  </view>
                  <!-- 图片消息subtype=3 -->
                  <view v-if="item.content.subtype == '3'" class="rightMsg_img" @tap="showPic(item.content.content)">
                    <image :src="item.content.content" mode="aspectFill"></image>
                  </view>
                  <!-- 视频消息subtype=4 -->
                  <view v-if="item.content.subtype == '4'" class="rightMsg_img" @tap="showVideo(item.content.content)">
                    <image :src="item.content.cover" mode="aspectFill"></image>
                  </view>
                </block>
                <!-- 设备消息 type=7 -->
                <block v-if="item.content.type == '7'">
                  <view class="content_item_url_wrap2 content_item_url_wrap2-me">
                    <view class="top_box">
                      <image class="slider-img" :src="item.image" mode=""></image>
                      <view>{{ item.content.content.brightness }}%</view>
                      <view class="slider-wrap uni-flex-jus">
                        <!-- 灯调亮度 -->
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
                    <view class="bottom_box uni-flex-jus">
                      <view>设备状态</view>
                      <switch :checked="item.content.content.state == 1 ? true : false" @change="switchChange($event, item)" color="#42DA60" style="transform: scale(0.7)" />
                    </view>
                  </view>
                </block>
                <!-- 联系人名片 type=8 -->
                <block v-if="item.content.type == '8'">
                  <view class="rightMsg_card" @click="cardClickInfo(item.content.content)">
                    <view class="title">推荐联系人</view>
                    <view class="content uni-flex-ali">
                      <image class="img" :src="item.content.content.image" mode="aspectFill"> </image>
                      <view class="info">
                        <view class="name">{{ item.content.content.name }}</view>
                        <view class="id">{{ item.content.content.wuchatid }}</view>
                      </view>
                    </view>
                  </view>
                </block>

                <!-- 自己的头像 -->
                <view class="chat_item_box">
                  <image class="chat_avatarUrl" :src="item.image" @error="imageError(item)"></image>
                </view>
              </view>

              <!-- 他人发出的消息 -->
              <view v-else class="other_chat">
                <!-- 他人的头像 -->
                <view class="chat_item_box">
                  <image class="chat_avatarUrl" :src="item.image" @error="imageError(item)" @click="toCard(item)"></image>
                </view>
                <view class="content-box">
                  <!-- 他人的名字 -->
                  <view class="left_name">
                    <text class="name">{{ item.name }}</text>
                    <text class="time">{{ item.time }}</text>
                  </view>
                  <!-- 他人的基础消息 type=1 -->
                  <block v-if="item.content.type == '1'">
                    <!-- 文字消息subtype=1 -->
                    <view v-if="item.content.subtype == '1'" class="leftMsg">
                      <rich-text :nodes="item.content.content"></rich-text>
                    </view>
                    <!-- 语音消息subtype=2 -->
                    <!-- <view v-if="item.content.subtype=='2'" class="leftMsg_voice uni-flex-ali"
											@tap="playVoice(item.content)" :class="playMsgid == item.content.id?'left_play':''"> -->
                    <view v-if="item.content.subtype == '2'" class="leftMsg_voice uni-flex-ali" @tap="playVoice(item.content)">
                      <view class="icon uni-flex-ali other-voice"></view>
                      <view class="length"></view>
                    </view>
                    <!-- 图片消息subtype=3 -->
                    <view v-if="item.content.subtype == '3'" class="leftMsg_img" @tap="showPic(item.content.content)">
                      <image class="img" :src="item.content.content" mode="aspectFill"></image>
                    </view>
                    <!-- 视频消息subtype=4 -->
                    <view v-if="item.content.subtype == '4'" class="leftMsg_img" @tap="showVideo(item.content.content)">
                      <image class="img" :src="item.content.cover" mode="aspectFill"></image>
                    </view>
                    <view v-if="item.content.subtype == '6'" class="leftMsg wcolor" @click="toWebview(item.content.content)">
                      <text>控制面板</text>
                    </view>
                  </block>

                  <!-- 功能列表内容 type=2 -->
                  <block v-if="item.content.type == '2'">
                    <!-- 图文列表内容subtype=1 -->
                    <view class="content_item_box-wrap" v-if="item.content.subtype == '1'">
                      <view class="content_item_box-item uni-column-center" v-for="(items, index2) in item.content.content" :key="'B' + index2" @click="clickInfo(items)">
                        <image class="content_item_box-icon" :src="items.icon"></image>
                        <text :style="{ color: items.color }">{{ items.content }}</text>
                      </view>
                    </view>
                    <!-- 图片列表内容subtype=2 -->
                    <view class="content_item_box-wrap" v-if="item.content.subtype == '2'">
                      <view class="content_item_box-item uni-column-center" v-for="(items, index2) in item.content.content" :key="'C' + index2" @click="clickInfo(items)">
                        <image class="content_item_box-img" :src="items.img" mode="aspectFill"> </image>
                        <view class="content_item_box-text">{{ items.content }}</view>
                      </view>
                    </view>
                  </block>
                  <!-- 图文详情内容 type=3 -->
                  <block v-if="item.content.type == '3'">
                    <!-- subtype=1	(物体识别、实时讲解)		subtype=2	(图片)		subtype=3	(视频) -->
                    <view class="content_item_box-flex uni-flex-ali" @click="previewClick(item.content)">
                      <image class="img" :src="item.content.content.img" mode="aspectFill"> </image>
                      <view class="right-box uni-column-jus">
                        <view class="title">{{ item.content.content.title }}</view>
                        <view class="content">{{ item.content.content.content }}</view>
                      </view>
                    </view>
                  </block>
                  <!-- 列表的样式 type=4 -->
                  <block v-if="item.content.type == '4'">
                    <!-- 跳转网页subtype=1 -->
                    <view class="content_item_url_wrap" v-if="item.content.subtype == '1'">
                      <view class="content_item_url_wrap_title">{{ item.content.title.text }}</view>
                      <view class="content_item_url_item_box" v-for="(items, index2) in item.content.content" :key="'D' + index2" @click="clickInfo(items.name, item.content.subtype, items.url)">
                        {{ items.name }}
                      </view>
                    </view>
                    <!-- 跳转app subtype=2 -->
                    <view class="content_item_url_wrap" v-if="item.content.subtype == '2'">
                      <!-- <image :src="item.content.title.image" mode="aspectFill"></image> -->
                      <view class="content_item_url_item_box" @click="clickInfo(item.content.content, item.content.subtype)">
                        {{ item.content.content.name }}
                      </view>
                    </view>
                    <!-- 文本列表内容subtype=3 -->
                    <view class="content_item_url_wrap" v-if="item.content.subtype == '3'">
                      <view class="content_item_url_wrap_title">{{ item.content.title }}</view>
                      <view class="content_item_url_item_box" v-for="(items, index2) in item.content.content" :key="'E' + index2" @click="clickInfo(items, item.content.subtype)">{{ items }} </view>
                    </view>
                  </block>

                  <!-- 产品图片 -->
                  <!-- <block v-if="item.content.type == '4'">
										<view class="content_item_box-flex2">
											<view class="title">产品图片</view>
											<image :src="item.content.content.img" mode="aspectFill"></image>
										</view>
									</block> -->

                  <!-- 设备消息 type=7 -->
                  <block v-if="item.content.type == '7'">
                    <view class="content_item_url_wrap2 content_item_url_wrap2-other" @longpress="devicEvent(item)">
                      <view class="top_box">
                        <image class="slider-img" :src="item.image" mode=""></image>
                        <view>{{ item.name }}</view>
                        <view class="slider-wrap uni-flex-jus">
                          <image class="slider-img-left" src="/static/img/other/left.png" mode=""> </image>
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
                      <view class="bottom_box uni-flex-jus">
                        <view>设备状态</view>
                        <!-- 设备开关 -->
                        <switch :checked="item.content.content.state == 1 ? true : false" @change="switchChange($event, item)" color="#42DA60" style="transform: scale(0.7)" />
                      </view>
                    </view>
                  </block>
                  <!-- 联系人名片 type=8 -->
                  <block v-if="item.content.type == '8'">
                    <view class="leftMsg_card" @click="cardClickInfo(item.content.content)">
                      <view class="title">推荐联系人</view>
                      <view class="content uni-flex-ali">
                        <image class="img" :src="item.content.content.image" mode="aspectFill"> </image>
                        <view class="info">
                          <view class="name">{{ item.content.content.name }}</view>
                          <view class="id">{{ item.content.content.wuchatid }}</view>
                        </view>
                      </view>
                    </view>
                  </block>
                  <!-- 自定义样式 -->
                  <view v-if="item.content.type == '9'" class="">
                    <rich-text :nodes="item.content.content"></rich-text>
                  </view>

                  <!-- type 10 怡亚通样式 -->
                  <block v-if="item.content.type == '10'">
                    <view class="leftMsg" @tap="ttyToUrl(item)">
                      <rich-text :nodes="item.content.content"></rich-text>
                    </view>
                  </block>

                  <!-- type 11 怡亚通样式  商品列表 -->
                  <block v-if="item.content.type == '11'">
                    <scroll-view class="content-goods" scroll-x>
                      <view class="content-goods-item" v-for="(key, i) in item.content.content" :key="i" @tap="toGoods(key)" @longpress="goodsLongEvent(key)">
                        <image class="img" :src="key.image" mode="aspectFill"></image>
                        <view class="name">{{ key.name }}</view>
                        <view class="price">￥{{ key.price }}</view>
                      </view>
                    </scroll-view>
                  </block>

                  <!-- type 12 怡亚通样式  订单  -->
                  <block v-if="item.content.type == '12'">
                    <view class="content-order" @tap="ttyToOrder(item)">
                      <view class="order-title">{{ item.content.title }}</view>
                      <view class="box-flex uni-flex-ali">
                        <image class="img" :src="item.content.image" mode="aspectFill"> </image>
                        <view class="right-box uni-column-jus">
                          <view class="title">{{ item.content.name }}</view>
                          <view class="content">{{ item.content.desc }}</view>
                        </view>
                      </view>
                      <view class="btn">更多</view>
                    </view>
                  </block>
                </view>
              </view>
            </block>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 设备转发模块 -->
    <view class="relay-mark uni-flex-center" v-if="isRelay" @click="isRelay = false">
      <view class="uni-flex-jus">
        <view class="relay-wrap uni-column-center" @click="relayEvent(1)">
          <image class="relay-img" src="/static/img/device/device_share1.png" mode=""></image>
          <text>共享数据</text>
        </view>
        <view class="relay-wrap wrap2 uni-column-center" @click="relayEvent(2)">
          <image class="relay-img" src="/static/img/device/device_share2.png" mode=""></image>
          <text>共享权限</text>
        </view>
      </view>
    </view>

    <!-- 底部输入栏 -->
    <!-- <view id="input_box" class="input-box" :class="popupLayerClass" @touchmove.stop.prevent="discard"> -->
    <view id="input_box" class="input-box" :class="hideMore ? '' : 'showLayer'" @touchmove.stop.prevent="discard">
      <view class="top-box">
        <view class="textbox">
          <!-- 点击出语音 -->
          <view
            class="voice-mode"
            :class="[isVoice ? '' : 'hidden', recording ? 'recording' : '']"
            @touchstart="voiceBegin"
            @touchmove.stop.prevent="voiceIng"
            @touchend="voiceEnd"
            @touchcancel="voiceCancel"
            >{{ voiceTis }}</view
          >
          <!-- 文字框 -->
          <view class="text-mode" :class="isVoice ? 'hidden' : ''">
            <view class="box">
              <textarea @input="textarea" auto-height="true" v-model="inputVal" />
            </view>
          </view>
        </view>
        <!-- 发送按钮 -->
        <view class="send" @tap="sendClick">
          <view class="btn" :class="inputVal == '' ? 'btn1' : ''">发送</view>
        </view>
      </view>
      <view class="bottom-box">
        <view class="items" @tap="switchVoice">
          <image src="/static/img/more/voice.png" mode=""></image>
        </view>
        <!-- 相册 -->
        <view class="items" @tap="chooseImage">
          <image src="/static/img/more/img.png" mode=""></image>
        </view>
        <!-- 拍照 -->
        <view class="items" @tap="camera">
          <image src="/static/img/more/photo.png" mode=""></image>
        </view>
        <!-- 更多 -->
        <view class="items" @tap="showMore" v-if="chatType != '1' && plusList.length > 0">
          <image src="/static/img/more/plus.png" mode=""></image>
        </view>
      </view>
    </view>

    <!-- 抽屉栏 -->
    <!-- <view class="popup-layer" :class="popupLayerClass" @touchmove.stop.prevent="discard"> -->
    <view class="popup-layer" @touchmove.stop.prevent="discard" v-if="!hideMore">
      <!-- 更多功能 相册-拍照-语音输入 -->
      <!-- <view class="more-layer" :class="{ hidden: hideMore }"> -->
      <view class="more-layer">
        <swiper class="swiper" :indicator-dots="indicatorBol">
          <swiper-item>
            <view class="list">
              <view class="box" v-for="(item, index) in plusList.slice(0, 8)" :key="index" @click="plusBtn(item)">
                <view class="icon">
                  <image :src="item.image" mode=""></image>
                </view>
                <view class="text">{{ item.name }}</view>
              </view>
            </view>
          </swiper-item>
          <swiper-item v-if="plusList.length > 8">
            <view class="list">
              <view class="box" v-for="(item, index) in plusList.slice(8, 16)" :key="index" @click="plusBtn(item)">
                <view class="icon">
                  <image :src="item.image" mode=""></image>
                </view>
                <view class="text">{{ item.name }}</view>
              </view>
            </view>
          </swiper-item>
          <swiper-item v-if="plusList.length > 16">
            <view class="list">
              <view class="box" v-for="(item, index) in plusList.slice(16, 24)" :key="index" @click="plusBtn(item)">
                <view class="icon">
                  <image :src="item.image" mode=""></image>
                </view>
                <view class="text">{{ item.name }}</view>
              </view>
            </view>
          </swiper-item>
        </swiper>
      </view>
    </view>

    <!-- 录音UI效果 -->
    <view class="record" :class="recording ? '' : 'hidden'">
      <view class="ing" :class="willStop ? 'hidden' : ''">
        <view class="icon luyin2"></view>
      </view>
      <view class="cancel" :class="willStop ? '' : 'hidden'">
        <view class="icon chehui"></view>
      </view>
      <view class="tis" :class="willStop ? 'change' : ''">{{ recordTis }}</view>
    </view>
  </view>
</template>

<script>
// 引入接口
let app = require('@/common/common.js')
// 引入方法
let { sendId, formatDate, getTimeText } = require('@/common/util.js')
// 引入封装的 sqlite
import DB from '@/common/sqlite.js'
export default {
  data() {
    return {
      // 控制页面展示
      pageLoad: false,
      // 聊天室ID、类别、接收ID
      roomid: '',
      chatType: '',
      receiveid: '',
      // 自己的头像、ID
      headimgurl: '',
      userid: '',
      // 单聊时对面的头像、名字
      title: '',
      // 控制右上角是否跳转
      moreBtn: '',

      // scroll-view 初始高度、滑块初始位置、滑动ID、控制滑动动画
      scrollHeight: '',
      scrollTop: 0,
      scrollToView: '',
      scrollAnimation: false,
      // scroll-view 作为滑到顶部请求标识，防止重复请求
      isHistoryLoading: false,

      // scroll-view 下拉刷新
      enabledBol: true,
      triggeredBol: false,
      _freshing: false,

      // 消息列表
      msgList: [],
      // 转发蒙版、要转发设备ID
      isRelay: false,
      relayobj: {},

      // 输入框的内容
      inputVal: '',
      // 录音相关参数
      RECORDER: uni.getRecorderManager(),
      isVoice: false,
      voiceTis: '按住 说话',
      recordTis: '手指上滑 取消发送',
      recording: false,
      willStop: false,
      initPoint: {
        identifier: 0,
        Y: 0
      },
      recordTimer: null,
      recordLength: 0,

      //播放语音相关参数
      AUDIO: uni.createInnerAudioContext(),
      playMsgid: null,
      VoiceTimer: null,
      // 抽屉参数
      popupLayerClass: '',
      // more参数
      hideMore: true,
      // 加号里列表
      plusList: [],
      // 指示点状态
      indicatorBol: false,
      from: '',
      leave: '',
      // 跳转 webview 参数
      permission: '',

      appid: '',
      siteid: '',

      receiveList: []
    }
  },
  onLoad(e) {
    /*
     *  roomid
     *  title
     *  chattype
     *  receiveid
     */
    console.log(e)
    let that = this
    if (typeof e.roomid != 'undefined') {
      uni.setNavigationBarTitle({
        title: e.title
      })
      that.roomid = e.roomid

      /*
       *  聊天类型 chattype 1 人 4 设备 5 群
       */
      that.chatType = e.chattype
      // 接收ID发消息时用到
      that.receiveid = e.receiveid
      // 单聊时候传的头像、名字
      that.title = e.title
      if (typeof e.from != 'undefined') {
        that.from = e.from
      }

      // 设备、群聊有欢迎语
      if ((that.chatType != '1') & (that.from == '')) {
        // console.log('要欢迎语接口', that.chatType)
        // 欢迎语
        that.chatWelcome()
      } else {
        // 人人单聊获取聊天历史
        that.selectSql()
      }
    }

    if (typeof e.appid != 'undefined') {
      that.appid = e.appid
    }

    if (typeof e.siteid != 'undefined') {
      that.siteid = e.siteid
    }

    // 修改自定义标题栏的图标---临时会话隐藏右上角三个点不跳转
    if (e.more == 'no') {
      // 仅 APP-PLUS 编译
      // #ifdef APP-PLUS
      that.moreBtn = 'no'
      var currentWebview = this.$mp.page.$getAppWebview()
      var tn = currentWebview.getStyle().titleNView
      tn.buttons[0].text = ''
      currentWebview.setStyle({
        titleNView: tn
      })
      // #endif
    }

    // 初始化下拉刷新
    // that._freshing = false;
    // setTimeout(() => {
    // 	that.triggered = true;
    // }, 1000)
    //语音自然播放结束
    that.AUDIO.onEnded((res) => {
      that.playMsgid = null
    })
    //录音开始事件
    that.RECORDER.onStart((e) => {
      that.recordBegin(e)
    })
    //录音结束事件
    that.RECORDER.onStop((e) => {
      that.recordEnd(e)
    })
    // websocket收消息
    uni.$on('get_message', (obj) => {
      // console.log(obj)
      // console.log(that.roomid)
      if (obj.roomid == that.roomid) {
        // 特殊处理 @面板 功能
        if (obj.content.type == '1' && obj.content.subtype == '6') {
          uni.navigateTo({
            url: `/pages/other/webview?url=${obj.content.content}&title=控制面板`
          })
        } else {
          // 传消息给webview改变状态
          uni.$emit('change_light', obj)

          // 标为已读
          that.changeUnread()
          // 接收消息处理格式后渲染页面
          that.pushMsgList(obj)
        }
      }
    })
    uni.$on('webviewMsg', (obj) => {
      let data = {
        room_id: that.roomid,
        receive_id: that.receiveid,
        msg_id: sendId(),
        type: parseInt(that.chatType),
        message: obj
      }
      that.sendMsg(data)
    })
  },

  onShow() {
    let that = this
    // 获取设备信息
    uni.getSystemInfo({
      success: (res) => {
        // scroll-view 高度
        that.scrollHeight = `${res.windowHeight - 90}px`
        // console.log(res.windowHeight, that.scrollHeight)
      }
    })

    that.hideMore = true
    if (that.roomid != '') {
      // 推送规则
      that.set_notify(that.roomid)

      // 区分聊天左右
      that.userid = uni.getStorageSync('userId')
      // 自己的头像
      that.headimgurl = uni.getStorageSync('headimgurl')

      // 获取加号里列表
      if (that.chatType == '5') {
        // 获取轻应用列表
        that.getSoftbot()
      }
    }

    // 从 webview 回来的
    if (this.leave != '') {
      this.leave = ''
      // 入网配置
      if (this.moreBtn == 'no') {
        // console.log('roomid====', that.roomid);
        // console.log('receiveid====', that.receiveid);
        this.chatWelcome()
      }
    }

    // 标为已读
    that.changeUnread()

    uni.hideKeyboard()
    // 滑到最下边
    that.scrollTop = 9999999
    that.scrollAnimation = true
  },
  onHide() {
    // 推送规则
    this.set_notify('')
  },
  onUnload() {
    uni.$off('webviewMsg')
    uni.$off('get_message')
    // 推送规则
    this.set_notify('')
  },
  // 点击右上角三个点
  onNavigationBarButtonTap() {
    if (this.moreBtn == 'no') {
      return
    }
    this.from = ''
    // 聊天类型 chattype 1 人 4 设备 5 群
    if (this.chatType == '5') {
      uni.navigateTo({
        url: `/pages/chat/chat_detail?roomid=${this.roomid}&chatType=${this.chatType}`
      })
    } else {
      uni.navigateTo({
        url: `/pages/chat/chat_detail?roomid=${this.roomid}&chatType=${this.chatType}&detailId=${this.receiveid}`
      })
    }
  },
  methods: {
    // 对话欢迎语
    chatWelcome() {
      app.showLoading()
      let that = this
      let data = {
        type: parseInt(that.chatType)
      }
      if (that.chatType == '5') {
        data.room_id = that.roomid
      } else {
        data.device_id = that.receiveid
      }
      // 判断云端还是边缘端  true  边缘端   false  云端
      let sendBol = false //getApp().changeBol
      if (getApp().socketTask2 != null && getApp().socketTask2.loginok) {
        sendBol = true
      }
      // console.log(sendBol)
      // console.log(sendBol)
      app.chatWelcome(data, sendBol, (res) => {
        console.log('欢迎语====', res.data)
        if (res.code == 0) {
          let reqData = res.data
          // 获取跳转 webview 参数
          if (reqData.permission) {
            that.permission = reqData.permission
          }
          // 欢迎语
          if (reqData.welcome && reqData.welcome.length > 0) {
            // console.log('欢迎语', reqData.welcome)
            reqData.welcome.forEach((item) => {
              // 获取类型
              if (item.type) {
                item.userType = item.type
              }
              item.time = getTimeText(item.time)
            })
            that.msgList = reqData.welcome
            setTimeout(() => {
              app.hideLoading()
              that.pageLoad = true
              that.scrollToBottom()
              uni.hideKeyboard()
            }, 500)
          } else {
            // console.log("无欢迎语");
            // 无欢迎语调用历史
            that.selectSql()
          }
          // 加号里的服务
          if (that.chatType != '5' && reqData.service && reqData.service.length > 0) {
            // console.log('服务', reqData.service)
            reqData.service.forEach((item) => {
              // 处理图片显示问题
              if (item.image.startsWith('http')) {
                item.image = `${item.image}`
              } else {
                if (uni.getStorageSync('localAddress')) {
                  item.image = `https://${uni.getStorageSync('localAddress')}:8080/${that.appid}${that.siteid}${item.image}`
                } else {
                  item.image = `${app.apiHost}/${that.appid}${that.siteid}${item.image}`
                }
              }
            })
            if (reqData.service.length > 8) {
              that.indicatorBol = true
            } else {
              that.indicatorBol = false
            }
            // console.log(reqData.service)
            that.plusList = reqData.service
          }
        } else {
          // 失败调用历史
          that.selectSql()
          // app.showToast(res.message)
        }
      })
    },

    // 标为已读
    changeUnread() {
      // #ifdef APP-PLUS
      let listdata = `unread = '0'`
      // 修改表数据 DB.updateTableData(表名, 要修改的列名=修改后列值, 修改条件的列名, 修改条件的列值)
      DB.updateTableData('chatlist', listdata, 'roomid', this.roomid)
        .then((res) => {
          // console.log("更新chatlist成功");
        })
        .catch((error) => {
          // console.log('修改失败', error)
        })
      // #endif
    },

    // 头像加载失败
    imageError(item, index) {
      this.$set(item, 'image', '/static/img/user.png')
    },

    // 滚动至聊天内容底部
    scrollToBottom() {
      let that = this
      if (that.msgList.length > 0) {
        // 滚动到底
        that.scrollAnimation = true
        that.scrollToView = 'mg' + (that.msgList.length - 1)
      }
    },

    /********************************************** 下拉刷新 begin **********************************************/

    // 滑动到顶部触发
    onUpper(e) {
      let that = this
      if (that.isHistoryLoading) return
      // console.log('聊天滑动到顶部')
      // 参数作为进入请求标识，防止重复请求
      that.isHistoryLoading = true
      // 开启下拉刷新
      that.enabledBol = true

      // 获取历史记录
      // this.selectSql()
    },

    // 滚动触发
    scrollEvent() {
      uni.hideKeyboard()
      // console.log("滚动")
      this.isHistoryLoading = false
    },

    // 自定义下拉刷新控件被下拉
    onPulling() {
      // console.log("自定义下拉刷新控件被下拉")
    },

    // 自定义下拉刷新被触发
    onRefresh() {
      let that = this
      if (that._freshing) return
      // console.log('自定义下拉刷新被触发')
      that._freshing = true
      // that.triggeredBol = "restore"
      // 界面下拉触发，triggeredBol可能不是true，要设为true
      if (!that.triggeredBol) that.triggeredBol = true

      // 获取历史记录
      this.selectSql()

      setTimeout(() => {
        that.triggeredBol = false
        that._freshing = false
      }, 1000)
    },

    // 自定义下拉刷新被复位
    onRestore() {
      // console.log('自定义下拉刷新被复位')
      let that = this
      // 需要重置--关闭动画
      that._freshing = false
      that.triggeredBol = 'restore'
      that.enabledBol = false
    },

    // 自定义下拉刷新被中止
    onAbort() {
      // console.log('自定义下拉刷新被中止')
      let that = this
      that.enabledBol = true
    },

    /********************************************** 下拉刷新 end **********************************************/

    // 功能列表内容 type=2 点击聊天内容
    clickInfo(item, subtype, url) {
      let that = this
      // 功能列表内容 type=2
      if (subtype == undefined) {
        if (item.url) {
          that.leave = 'webview'
          let webUrl
          webUrl = `${item.url}?userid=${that.userid}&permission=${that.permission}`
          // console.log(webUrl)
          uni.navigateTo({
            url: `/pages/other/webview?url=${webUrl}&title=${item.content}`
          })
        } else {
          let data = {
            room_id: that.roomid,
            receive_id: that.receiveid,
            msg_id: sendId(),
            type: parseInt(that.chatType),
            message: {
              type: '1',
              subtype: '1',
              content: item.content,
              color: ''
            }
          }
          that.sendMsg(data)
        }
      } else {
        // type=4 跳转网页、跳转app、文本列表内容
        if (subtype == '1') {
          uni.navigateTo({
            url: `/pages/other/webview?url=${url}&room=${that.roomid}`
          })
        } else if (subtype == '2') {
          // 仅 APP-PLUS 编译
          // #ifdef APP-PLUS
          if (plus.os.name == 'Android') {
            console.log('Android')
            plus.runtime.launchApplication(
              {
                pname: item.url
              },
              (e) => {
                console.log('Open system default browser failed: ' + e.message)
              }
            )
          }
          // #endif
        } else {
          let data = {
            room_id: that.roomid,
            receive_id: that.receiveid,
            msg_id: sendId(),
            type: parseInt(that.chatType),
            message: {
              type: '1',
              subtype: '1',
              content: item,
              color: ''
            }
          }
          that.sendMsg(data)
        }
      }
    },

    // 图文详情内容 type=3
    previewClick(e) {
      // console.log(e);
      // console.log(e.subtype, e.content);
      let that = this
      uni.hideKeyboard()
      switch (e.subtype) {
        case '1':
          // subtype=1	(物体识别、实时讲解) 仅 APP-PLUS 编译
          var pullurl = e.detail.pull.url
          var pushurl = e.detail.push.url
          var videotype = e.videotype
          // #ifdef APP-PLUS
          uni.navigateTo({
            url: `/pages/other/video?type=${videotype}&pullurl=${pullurl}&pushurl=${pushurl}`
          })
          // #endif
          break
        case '2':
          console.log(e.detail)
          // subtype=2	(图片)
          setTimeout(() => {
            uni.previewImage({
              current: 0,
              urls: e.detail
            })
          }, 500)
          break
        case '3':
          // subtype=3	(视频) 仅 APP-PLUS 编译
          // #ifdef APP-PLUS
          if (e.detail.url) {
            uni.navigateTo({
              url: `/pages/other/preview?url=${e.detail.url}&poster=${e.content.img}`
            })
          }
          // #endif
          break
        default:
          break
      }
    },

    // 设备操作--调灯亮度
    sliderChange(e, item) {
      let that = this
    },

    // 设备操作--开关设备
    switchChange(e, item) {
      let that = this
    },

    // 长按设备转发
    devicEvent(item) {
      this.isRelay = true
      this.relayobj = {
        deviceId: item.userid,
        name: item.name,
        image: item.image
      }
    },

    // 转发按钮
    relayEvent(type) {
      uni.navigateTo({
        url: `/pages/contacts/share?roomid=${this.roomid}&id=${this.relayobj.deviceId}&name=${this.relayobj.name}&image=${this.relayobj.image}&from=share&shareType=${type}`
      })
    },

    // 切换语音/文字输入
    switchVoice() {
      //隐藏抽屉
      this.hideDrawer()
      this.isVoice = this.isVoice ? false : true
    },
    discard() {
      return
    },

    // 录音开始
    voiceBegin(e) {
      if (e.touches.length > 1) {
        return
      }
      this.initPoint.Y = e.touches[0].clientY
      this.initPoint.identifier = e.touches[0].identifier
      //录音开始,
      this.RECORDER.start({
        format: 'mp3'
      })
    },

    //录音开始UI效果
    recordBegin(e) {
      this.recording = true
      this.voiceTis = '松开 结束'
      this.recordLength = 0
      this.recordTimer = setInterval(() => {
        this.recordLength++
      }, 1000)
    },

    // 录音被打断
    voiceCancel() {
      this.recording = false
      this.voiceTis = '按住 说话'
      this.recordTis = '手指上滑 取消发送'
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
        this.recordTis = '手指上滑 取消发送'
      }
    },

    // 结束录音
    voiceEnd(e) {
      if (!this.recording) {
        return
      }
      this.recording = false
      this.voiceTis = '按住 说话'
      this.recordTis = '手指上滑 取消发送'
      // 录音结束
      this.RECORDER.stop()
    },

    //录音结束(回调文件)
    recordEnd(e) {
      let that = this
      clearInterval(that.recordTimer)
      if (!that.willStop) {
        // console.log(e.tempFilePath)
        console.log('e: ' + JSON.stringify(e))
        app.chat_uploadFile({}, e.tempFilePath, (res) => {
          if (res.code == 0) {
            let data = {
              room_id: that.roomid,
              receive_id: that.receiveid,
              msg_id: sendId(),
              type: parseInt(that.chatType),
              message: {
                type: '1',
                subtype: '2',
                content: res.data.filename,
                color: ''
              }
            }
            that.sendMsg(data)
          } else {
            uni.showToast({
              title: res.message,
              image: '/images/icon/alert.png',
              mask: true
            })
          }
        })
      } else {
        // console.log('取消发送录音');
      }
      this.willStop = false
    },

    // 预览图片
    showPic(img) {
      uni.previewImage({
        indicator: 'none',
        urls: [img]
      })
    },

    // 浏览视频
    showVideo(url) {
      // #ifdef APP-PLUS
      if (url) {
        uni.navigateTo({
          url: `/pages/other/preview?url=${url}`
        })
      }
      // #endif
    },

    // 播放语音
    playVoice(e) {
      // console.log(e)
      // this.playMsgid = e.id
      this.AUDIO.src = e.content
      this.$nextTick(() => {
        this.AUDIO.play()
      })
    },

    // 获取输入框的值
    textarea() {
      // console.log(this.inputVal);
      if (!this.inputVal) {
        return
      }
      if (this.chatType === '5' && this.inputVal.slice(-1) === '@') {
        uni.navigateTo({
          url: `/pages/chat/choose?roomid=${this.roomid}`
        })
      }
    },

    // 发送文字消息
    sendClick() {
      let that = this
      //隐藏抽屉
      that.hideDrawer()
      if (!that.inputVal) {
        return
      }
      let data = {
        room_id: that.roomid,
        receive_id: that.receiveid,
        msg_id: sendId(),
        type: parseInt(that.chatType),
        message: {
          type: '1',
          subtype: '1',
          content: that.inputVal,
          color: ''
        }
      }
      if (that.chatType === '5') {
        data.receive_list = that.receiveList
      }
      that.sendMsg(data)
      //清空输入框
      that.inputVal = ''
    },

    // 语音识别
    startRecognize() {
      // 仅 APP-PLUS 编译
      // #ifdef APP-PLUS
      uni.hideKeyboard()
      let that = this
      var text = ''
      var options = {}
      options.continue = true
      options.engine = 'iFly'
      options.punctuation = false
      options.timeout = 20 * 1000
      text = ''
      // console.log('开始语音识别：')
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

    // 更多功能(点击+弹出)
    showMore() {
      this.isVoice = false
      if (this.hideMore) {
        this.hideMore = false
        // this.openDrawer()
      } else {
        this.hideDrawer()
      }
    },

    // // 打开抽屉
    // openDrawer() {
    //   this.popupLayerClass = 'showLayer'
    // },

    // 隐藏抽屉
    hideDrawer() {
      // this.popupLayerClass = ''
      setTimeout(() => {
        this.hideMore = true
      }, 150)
    },

    // 选择图片发送
    chooseImage() {
      this.getImage('album')
    },
    //拍照发送
    camera() {
      this.getImage('camera')
    },

    //选照片 or 拍照
    getImage(type) {
      let that = this
      that.hideDrawer()
      uni.chooseImage({
        sourceType: [type],
        sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
        success: (res) => {
          for (let i = 0; i < res.tempFilePaths.length; i++) {
            app.chat_uploadFile({}, res.tempFilePaths[i], (res) => {
              if (res.code == 0) {
                let data = {
                  room_id: that.roomid,
                  receive_id: that.receiveid,
                  msg_id: sendId(),
                  type: parseInt(that.chatType),
                  message: {
                    type: '1',
                    subtype: '3',
                    content: res.data.filename,
                    color: ''
                  }
                }
                that.sendMsg(data)
              } else {
                uni.showToast({
                  title: res.message,
                  image: '/images/icon/alert.png',
                  mask: true
                })
              }
            })
          }
        }
      })
    },

    // 点击名片
    cardClickInfo(e) {
      if (e.userid) {
        uni.navigateTo({
          url: `/pages/contacts/card?peopleId=${e.userid}&chattype=${e.chattype}`
        })
      }
    },

    // 轻应用列表
    getSoftbot() {
      let data = {
        roomid: this.roomid
      }
      app.find_softbot(data, (res) => {
        if (res.code == 0) {
          if (res.data.length > 8) {
            this.indicatorBol = true
          } else {
            this.indicatorBol = false
          }
          this.plusList = res.data
        } else {
          uni.showToast({
            title: res.message,
            image: '/images/icon/alert.png',
            mask: true
          })
        }
      })
    },

    // 点击加号每一项
    plusBtn(item) {
      if (this.chatType == '5') {
        // 轻应用点击
        this.softbotBtn(item.id)
      } else {
        // 服务点击发消息
        this.serviceBtn(item.name)
      }
      this.hideDrawer()
    },

    // 轻应用点击
    softbotBtn(id) {
      let member = []
      member.push({
        detailid: id,
        type: 6
      })
      let data = {
        roomid: this.roomid,
        member: member
      }
      // console.log(data);
      app.add_member(data, (res) => {
        if (res.code == 0) {
          this.chatWelcome()
          uni.showToast({
            title: '添加成功',
            mask: true
          })
        } else {
          app.showToast(res.message)
        }
      })
    },

    // 服务点击发消息
    serviceBtn(name) {
      let that = this
      let data = {
        msg_type: 1,
        room_id: that.roomid,
        receive_id: that.receiveid,
        msg_id: sendId(),
        type: parseInt(that.chatType),
        message: {
          type: '1',
          subtype: '1',
          content: name,
          color: ''
        }
      }
      that.sendMsg(data)
    },

    // 封装发消息调接口
    sendMsg(data) {
      // console.log(data)
      let that = this
      let type = ''
      // 存本地的聊天类别		1 群聊	2 单聊
      if (that.chatType == '5') {
        type = '1'
      } else {
        type = '2'
      }
      app.showLoading()
      that.inputVal = ''
      // 判断云端还是边缘端  true  边缘端   false  云端
      let sendBol = false //getApp().changeBol
      if (getApp().socketTask2 != null && getApp().socketTask2.loginok) {
        sendBol = true
      }
      setTimeout(() => {
        that.receiveList = []
        app.sendMessage(data, sendBol, (res) => {
          if (res.code == 0) {
            // #ifdef APP-PLUS
            // 校验数据库是否建表 没有就创建
            getApp().checkSqlite('nolog')

            // 发送成功后插入本地库 仅APP编译
            let content = JSON.stringify(data.message)
            let time = formatDate(new Date().getTime())
            // 历史 字段 msg_id  roomid  type  userid  receiveid  time  content  unread
            let historySql = `'${data.msg_id}${data.room_id}','${data.room_id}','${type}','${that.userid}','${that.receiveid}','${time}','${content}',0`
            // 插入数据到历史记录表
            getApp().insertHistoryData(historySql)

            // 对话 字段 roomid  type  userid  receiveid  time  content  msg_id  unread
            let listSql = `'${data.room_id}','${type}','${that.receiveid}','${that.userid}','${time}','${content}','${data.msg_id}',0`
            // 查询表 DB.selectTableData(表名,查询条件列名,查询条件列值)
            DB.selectTableData('chatlist', 'roomid', data.room_id)
              .then((res) => {
                // console.log('要修改的数据', res);
                if (res.length != 0) {
                  var listdata = `content = '${content}',time = '${time}',unread = '0'`
                  // 修改表数据 DB.updateTableData(表名, 要修改的列名=修改后列值, 修改条件的列名, 修改条件的列值)
                  DB.updateTableData('chatlist', listdata, 'roomid', data.room_id)
                    .then((res) => {
                      // console.log("更新chatlist成功");
                    })
                    .catch((error) => {
                      console.log('修改失败', error)
                    })
                } else {
                  // 插入对话列表
                  getApp().insertListChat(listSql)
                }
              })
              .catch((error) => {
                console.log('查询失败')
              })

            setTimeout(() => {
              let dataObj = {
                roomid: data.room_id,
                type: type,
                userid: that.userid,
                receiveid: that.receiveid,
                time: time,
                content: JSON.parse(content)
              }
              that.pushMsgList(dataObj)
            }, 1)
            // #endif
            app.hideLoading()
          } else {
            app.showToast(res.message)
          }
        })
      }, 500)
    },

    // 查询表里对话历史
    selectSql() {
      let that = this
      DB.selectTableData('history', 'roomid', that.roomid)
        .then((res) => {
          console.log('历史', res)
          res.forEach((item) => {
            item.content = JSON.parse(item.content)
            item.unread = 1
            item.image = '/static/img/user.png'
            item.name = '默认'
            item.time = getTimeText(item.time)
            // 自己
            if (item.userid == that.userid) {
              item.image = this.headimgurl
              item.name = this.title
              item.userType = 1
            }
            if (item.content.type == '1') {
              const subTypeArr = ['3', '4', '7']
              if (item.content.subtype === '5') {
                let str = ''
                item.content.content.forEach((key) => {
                  str += key.name + '、'
                })
                let msgStr = `${item.content.owner.name}邀请${str.slice(0, -1)}加入群聊`
                item.content.msg = msgStr
              } else if (subTypeArr.includes(item.content.subtype)) {
                if (!item.content.content.startsWith('http')) {
                  if (uni.getStorageSync('localAddress')) {
                    item.content.content = `https://${uni.getStorageSync('localAddress')}:8080/${that.appid}${that.siteid}${item.content.content}`
                    item.content.cover = `https://${uni.getStorageSync('localAddress')}:8080/${that.appid}${that.siteid}${item.content.cover}`
                  } else {
                    item.content.content = `${app.apiHost}/${that.appid}${that.siteid}${item.content.content}`
                    item.content.cover = `${app.apiHost}/${that.appid}${that.siteid}${item.content.cover}`
                  }
                }
              }
            }

            if (item.content.type === '3' && item.content.subtype === '2') {
              if (!item.content.content.img.includes('http')) {
                if (uni.getStorageSync('localAddress')) {
                  item.content.content.img = `https://${uni.getStorageSync('localAddress')}:8080/${that.appid}${that.siteid}${item.content.content.img}`
                  item.content.detail[0] = `https://${uni.getStorageSync('localAddress')}:8080/${that.appid}${that.siteid}${item.content.detail[0]}`
                } else {
                  item.content.content.img = `${app.apiHost}/${that.appid}${that.siteid}${item.content.content.img}`
                  item.content.detail[0] = `${app.apiHost}/${that.appid}${that.siteid}${item.content.detail[0]}`
                }
              }
            }

            if (item.content.type === '13') {
              let liveArr = item.content.content
              liveArr.forEach((key) => {
                if (!key.image.includes('http')) {
                  if (uni.getStorageSync('localAddress')) {
                    key.image = `https://${uni.getStorageSync('localAddress')}:8080/${that.appid}${that.siteid}${key.image}`
                  } else {
                    key.image = `${app.apiHost}/${that.appid}${that.siteid}${key.image}`
                  }
                }
              })
            }

            // 获取姓名头像
            that.getUserInfo(item.userid, (info) => {
              // console.log('获取头像==', info)
              if (info.name) {
                item.name = info.name
              }
              if (info.image) {
                item.image = info.image
              }
              if (info.type) {
                item.userType = item.type
              }
              if (info.appid) {
                item.appid = info.appid
              }
              if (info.type) {
                item.siteid = info.siteid
              }
            })
          })
          res = res.filter((item) => item.content.subtype !== '8')
          // console.log('对话历史', res);
          // that.msgList = that.msgList.concat(res);
          if (res.length > 0) {
            that.msgList = res
          }
          setTimeout(() => {
            that.pageLoad = true
            that.scrollToBottom()
            uni.hideKeyboard()
            app.hideLoading()
          }, 500)
        })
        .catch((error) => {
          console.log('查询失败')
        })
    },

    // 发送、接收消息处理格式后渲染页面
    pushMsgList(obj) {
      let that = this
      obj.image = '/static/img/user.png'
      obj.name = '默认'
      obj.time = getTimeText(obj.time)
      // 自己
      if (obj.userid == that.userid) {
        obj.image = that.headimgurl
        obj.name = that.title
        obj.userType = 1
      }
      // 处理通知
      if (obj.content.type == '1') {
        const subTypeArr = ['3', '4', '7']
        if (obj.content.subtype === '5') {
          let str = ''
          obj.content.content.forEach((key) => {
            str += key.name + '、'
          })
          let msgStr = `${obj.content.owner.name}邀请${str.slice(0, -1)}加入群聊`
          obj.content.msg = msgStr
        } else if (subTypeArr.includes(obj.content.subtype)) {
          if (!obj.content.content.startsWith('http')) {
            if (uni.getStorageSync('localAddress')) {
              obj.content.content = `https://${uni.getStorageSync('localAddress')}:8080/${that.appid}${that.siteid}${obj.content.content}`
              obj.content.cover = `https://${uni.getStorageSync('localAddress')}:8080/${that.appid}${that.siteid}${obj.content.cover}`
            } else {
              obj.content.content = `${app.apiHost}/${that.appid}${that.siteid}${obj.content.content}`
              obj.content.cover = `${app.apiHost}/${that.appid}${that.siteid}${obj.content.cover}`
            }
          }
        }
      }

      console.log(obj)
      if (obj.content.type === '3' && obj.content.subtype === '2') {
        if (!obj.content.content.img.includes('http')) {
          if (uni.getStorageSync('localAddress')) {
            obj.content.content.img = `https://${uni.getStorageSync('localAddress')}:8080/${that.appid}${that.siteid}${obj.content.content.img}`
            obj.content.detail[0] = `https://${uni.getStorageSync('localAddress')}:8080/${that.appid}${that.siteid}${obj.content.detail[0]}`
          } else {
            obj.content.content.img = `${app.apiHost}/${that.appid}${that.siteid}${obj.content.content.img}`
            obj.content.detail[0] = `${app.apiHost}/${that.appid}${that.siteid}${obj.content.detail[0]}`
          }
        }
      }

      if (obj.content.type === '13') {
        let liveArr = obj.content.content
        liveArr.forEach((item) => {
          if (!item.image.includes('http')) {
            if (uni.getStorageSync('localAddress')) {
              item.image = `https://${uni.getStorageSync('localAddress')}:8080/${that.appid}${that.siteid}${item.image}`
            } else {
              item.image = `${app.apiHost}/${that.appid}${that.siteid}${item.image}`
            }
          }
        })
      }

      // 获取姓名头像
      that.getUserInfo(obj.userid, (info) => {
        // console.log('获取头像==', info)
        if (info.name) {
          obj.name = info.name
        }
        if (info.image) {
          obj.image = info.image
        }
        if (info.type) {
          obj.userType = info.type
        }
        if (info.appid) {
          obj.appid = info.appid
        }
        if (info.type) {
          obj.siteid = info.siteid
        }
      })

      // console.log(that.msgList)
      // that.msgList.forEach((item) => {
      //   if (item.seq && item.seq === obj.seq) return
      //   console.log('ok')
      //   that.msgList.push(obj)
      // })
      that.msgList.push(obj)
      setTimeout(() => {
        that.scrollToBottom()
        uni.hideKeyboard()
        app.hideLoading()
      }, 500)
    },

    // 获取用户姓名头像
    getUserInfo(userid, cb) {
      app.get_userinfo({ userid: userid }, (res) => {
        if (res.code == 0) {
          // console.log(res.data)
          cb(res.data)
        } else {
          uni.showToast({
            title: res.message,
            image: '/images/icon/alert.png',
            mask: true
          })
        }
      })
    },

    // 控制面板
    toWebview(url) {
      if (url) {
        uni.navigateTo({
          url: `/pages/other/webview?url=${url}&title=控制面板`
        })
      }
    },

    // 点击头像去名片
    toCard(item) {
      if (item.userType && item.userType != 6) {
        uni.navigateTo({
          url: `/pages/contacts/card?peopleId=${item.userid}&chattype=${item.userType}`
        })
      }
    },

    // 推送规则
    set_notify(notify) {
      let data = {
        roomid: notify
      }
      app.set_notify(data, (res) => {
        if (res.code != 0) {
          app.showToast(res.message)
        }
      })
    },

    // 跳转 URL 到 H5
    ttyToUrl(item) {
      let that = this
      that.hideMore = true
      // console.log(item)
      if (item.content.subtype === '1') {
        // 跳转 H5
        let urls
        if (uni.getStorageSync('localAddress')) {
          urls = `https://${uni.getStorageSync('localAddress')}:8080/${that.appid}${that.siteid}${item.content.url}`
        } else {
          urls = `${app.apiHost}/${that.appid}${that.siteid}${item.content.url}`
        }
        // console.log(urls)
        let parameter = encodeURIComponent(JSON.stringify(item.content.parameter))
        uni.navigateTo({
          // url: `/pages/other/webview?url=${urls}&title=${item.content.title}&token=${app.getToken().token}&detailid=${that.receiveid}&msgid=${item.content.msgid}&roomid=${that.roomid}`
          url: `/pages/other/webview?url=${urls}&title=${item.content.title}&token=${app.getToken().token}&parameter=${parameter}`
        })
      } else if (item.content.subtype === '2') {
        // 跳转 APP 页面
        uni.navigateTo({
          url: `/pages/chat/chat_add_member?detailid=${that.receiveid}&msgid=${item.content.msgid}&appid=${that.appid}&siteid=${that.siteid}`
        })
      } else if (item.content.subtype === '4') {
        // 上传头像
        uni.chooseImage({
          count: 1,
          compressed: false,
          success: (res) => {
            app.showLoading()
            let data = {
              detailid: that.receiveid,
              msgid: item.content.msgid
            }
            let urls
            if (uni.getStorageSync('localAddress')) {
              urls = `https://${uni.getStorageSync('localAddress')}:8080/${that.appid}${that.siteid}`
            } else {
              urls = `${app.apiHost}/${that.appid}${that.siteid}`
            }
            // console.log(data)
            // console.log(res.tempFilePath)
            app.upload_face(urls, data, res.tempFilePaths[0], (res) => {
              if (res.code == 0) {
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
      }
    },

    // 订单
    ttyToOrder(item) {
      let that = this
      // 跳转 H5
      let urls
      if (uni.getStorageSync('localAddress')) {
        urls = `https://${uni.getStorageSync('localAddress')}:8080/${that.appid}${that.siteid}${item.content.url}`
      } else {
        urls = `${app.apiHost}/${that.appid}${that.siteid}${item.content.url}`
      }
      // token  msgid
      uni.navigateTo({
        url: `/pages/other/webview?url=${urls}&title=订单&token=${app.getToken().token}&detailid=${that.receiveid}&msgid=${item.content.msgid}`
      })
    }
  }
}
</script>

<style scoped lang="scss">
// 引入聊天样式
@import './style/style.scss';
@import './style/chat.scss';
</style>
