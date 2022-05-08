<!--
 * @Descripttion: 对话列表
 * @Author: SUI
 * @Company: chorustek
 * @Date: 2020-10-15 18:56:40
 * @Version: 1.0.0
 * @LastEditors: SUI
 * @LastEditTime: 2021-12-21 20:27:01
 * @FilePath: \things\pages\chat\list.vue
-->
<template>
  <view class="body" v-if="pageLoad">
    <!-- 点击右上角+ 仅 APP 编译-->
    <!-- #ifdef APP-PLUS -->
    <block v-if="isShow">
      <upper-right-plus :show="isShow" @childTap="childTap($event)"></upper-right-plus>
    </block>
    <!-- #endif -->

    <!-- 切换展示列表 -->
    <scroll-view class="top-tab" scroll-x>
      <view class="top-tab-item" v-for="(item, index) in chatTopTab" :key="index" @tap="clickTopTab(item, index)">
        <view :class="topTabIndex == index ? 'change' : 'name'">{{ item }}</view>
      </view>
    </scroll-view>

    <!-- 列表展示 -->
    <block v-if="listData.length != 0 || serviceList.length != 0">
      <!-- 服务号和管理号 -->
      <uni-swipe-action v-if="topTabIndex !== 1">
        <uni-swipe-action-item :right-options="options1" @click="unFollow($event, item.roomid, index)" v-for="(item, index) in serviceList" :key="'Q' + index">
          <view class="item_box uni-flex-jus" @click="intoServiceChat(item)" hover-class="bg-light">
            <!-- 左边 -->
            <view class="item_box_left_img">
              <!-- 服务号、管理号头像 -->
              <view class="image_box2 uni-flex-ali">
                <image class="avatarImg1" :src="item.image" @error="imageError(item)"></image>
              </view>
            </view>
            <!-- 右边 -->
            <view class="item_box_left uni-flex-ali">
              <view class="center_box uni-column-jus">
                <!-- 对话名字、时间 -->
                <view class="center_title uni-flex-space">
                  <view class="center_title_1">{{ item.name }}</view>
                  <view class="time_box">{{ item.time }}</view>
                </view>
                <!-- 根据对话类型展示不同的效果 -->
                <block v-if="item.content != null">
                  <view class="center_content" v-if="item.content.type === '1'">
                    <text v-if="item.content.subtype === '1'">{{ item.content.content }}</text>
                    <text v-else-if="item.content.subtype === '2'">[语音]</text>
                    <text v-else-if="item.content.subtype === '3'">[图片]</text>
                    <text v-else-if="item.content.subtype === '4'">[视频]</text>
                    <text v-else-if="item.content.subtype === '5'">[通知]</text>
                    <text v-else-if="item.content.subtype === '6'">[控制面板]</text>
                    <text v-else-if="item.content.subtype === '7'">[视频]</text>
                    <text v-else-if="item.content.subtype === '8'">[文件]</text>
                    <text v-else>其他</text>
                  </view>
                  <view class="center_content" v-else-if="item.content.type === '2'">[链接]</view>
                  <view class="center_content" v-else-if="item.content.type === '3'">
                    [链接]<text>{{ item.content.content.title }}</text></view
                  >
                  <view class="center_content" v-else-if="item.content.type === '4'">[链接]</view>
                  <view class="center_content" v-else-if="item.content.type === '7'">[分享]</view>
                  <view class="center_content" v-else-if="item.content.type === '8'">[名片]</view>
                  <view class="center_content" v-else-if="item.content.type === '10'">{{ item.content.content }}</view>
                  <view class="center_content" v-else-if="item.content.type === '11'">[列表]</view>
                  <view class="center_content" v-else-if="item.content.type === '12'">[订单]</view>
                  <view class="center_content" v-else-if="item.content.type === '13'">[直播]</view>
                  <view class="center_content" v-else>一起来聊天吧</view>
                </block>
                <block v-else>
                  <view class="center_content">欢迎进入服务、管理号</view>
                </block>
                <!-- 未读条数 -->
                <!-- <view v-if="item.unread != 0" class="content_spot">{{ item.unread }}</view> -->
              </view>
            </view>
          </view>
        </uni-swipe-action-item>
      </uni-swipe-action>

      <!-- 其他的列表 -->
      <uni-swipe-action>
        <uni-swipe-action-item :right-options="options" @click="deleteItem($event, item.roomid, index)" v-for="(item, index) in listData" :key="'A' + index">
          <view class="item_box uni-flex-jus" :class="item.content.status & (item.content.status == '3') ? 'changeBack' : ''" @click="intoChat(item)" hover-class="bg-light">
            <!-- 左边 -->
            <view class="item_box_left_img">
              <!-- 单聊头像 -->
              <view class="image_box uni-flex-ali" v-if="item.chattype !== 5">
                <image class="avatarImg1" :src="item.image" @error="imageError(item)"></image>
              </view>
              <!-- 拼群聊头像 -->
              <view class="img_wrap" v-if="item.chattype === 5" :class="item.member.length == 2 ? 'uni-flex-ali' : item.member.length > 2 ? 'img_wrap2' : ''">
                <block v-if="item.member.length === 1">
                  <image class="avatarImg" mode="aspectFill" :src="keys.image" v-for="(keys, ind) in item.member" :key="ind" @error="imageError(keys)"></image>
                </block>
                <block v-for="(keys, ind) in item.member" :key="ind" v-else-if="item.member.length == 2">
                  <image class="avatarImg2" mode="aspectFill" :src="keys.image" @error="imageError(keys)"></image>
                </block>
                <block v-for="(keys, ind) in item.member" :key="ind" v-else-if="item.member.length == 3">
                  <image class="avatarImg3" mode="aspectFill" :src="keys.image" @error="imageError(keys)"></image>
                </block>
                <!-- 头像大于3最多展示4个 -->
                <block v-for="(keys, ind) in item.member" :key="ind" v-else>
                  <image class="avatarImg3" mode="aspectFill" :src="keys.image" @error="imageError(keys)"></image>
                </block>
              </view>
              <view class="spot" :class="spotObj[item.status]"></view>
            </view>
            <!-- 右边 -->
            <view class="item_box_left uni-flex-ali">
              <view class="center_box uni-column-jus">
                <!-- 对话名字、时间 -->
                <view class="center_title uni-flex-space">
                  <view class="center_title_1">{{ item.name }}</view>
                  <view class="time_box">{{ item.time }}</view>
                </view>
                <!-- 根据对话类型展示不同的效果 -->
                <block v-if="item.content != null">
                  <view class="center_content" v-if="item.content.type === '1'">
                    <text v-if="item.content.subtype === '1'">{{ item.content.content }}</text>
                    <text v-else-if="item.content.subtype === '2'">[语音]</text>
                    <text v-else-if="item.content.subtype === '3'">[图片]</text>
                    <text v-else-if="item.content.subtype === '4'">[视频]</text>
                    <text v-else-if="item.content.subtype === '5'">[通知]</text>
                    <text v-else-if="item.content.subtype === '6'">[控制面板]</text>
                    <text v-else-if="item.content.subtype === '7'">[视频]</text>
                    <text v-else-if="item.content.subtype === '8'">[文件]</text>
                    <text v-else>其他</text>
                  </view>
                  <view class="center_content" v-else-if="item.content.type === '2'">[链接]</view>
                  <view class="center_content" v-else-if="item.content.type === '3'">
                    [链接]<text>{{ item.content.content.title }}</text></view
                  >
                  <view class="center_content" v-else-if="item.content.type === '4'">[链接]</view>
                  <view class="center_content" v-else-if="item.content.type === '7'">[分享]</view>
                  <view class="center_content" v-else-if="item.content.type === '8'">[名片]</view>
                  <view class="center_content" v-else-if="item.content.type === '10'">{{ item.content.content }}</view>
                  <view class="center_content" v-else-if="item.content.type === '11'">[列表]</view>
                  <view class="center_content" v-else-if="item.content.type === '12'">[订单]</view>
                  <view class="center_content" v-else-if="item.content.type === '13'">[直播]</view>
                  <view class="center_content" v-else>一起来聊天吧</view>
                </block>
                <block v-else>
                  <view class="center_content">欢迎加入群聊</view>
                </block>
                <!-- 未读条数 -->
                <view v-if="item.unread != 0" class="content_spot">{{ item.unread }}</view>
              </view>
            </view>
          </view>
        </uni-swipe-action-item>
      </uni-swipe-action>
    </block>

    <!-- 空空如也 -->
    <view class="not-wrap uni-flex-center" v-else>
      <view class="not-box uni-column-center">
        <image class="img" src="/static/img/kong.png" mode=""></image>
        <text>暂无内容</text>
      </view>
    </view>

    <!-- 右下角--智能小助手 -->
    <!-- <image class="smartSetting" src="/static/img/device/smartSetting2.png" @click="toSmart"></image> -->
  </view>
</template>

<script>
// 引入接口
let app = require('@/common/common.js')
// 引入方法
let { getTimeText } = require('@/common/util.js')
// 引入封装的 sqlite
let DB = require('@/common/sqlite.js')

// 引入右上角自定义蒙版
import UpperRightPlus from '@/components/contents/UpperRightPlus/UpperRightPlus.vue'

export default {
  components: {
    UpperRightPlus
  },
  data() {
    return {
      // 页面显示
      pageLoad: false,
      // 右上角显示
      isShow: false,
      // 列表数据
      listData: [],
      arrData: [],
      options1: [
        {
          text: '取消关注',
          style: {
            backgroundColor: '#5CBBFF'
          }
        }
      ],
      options: [
        {
          text: '删除',
          style: {
            backgroundColor: '#ef495a'
          }
        }
      ],
      // 服务号、管理号数据
      serviceList: [],
      updateService: null,
      // 设备状态对象
      spotObj: { 1: 'spot-green', 2: 'spot-gray', 3: 'spot-red' },

      chatTopTab: ['全部', '未读', '已读'],
      topTabIndex: 0
    }
  },

  onLoad() {
    this.isShow = false
  },

  onShow() {
    let that = this
    that.isShow = false

    // app.showLoading();
    if (uni.getStorageSync('sqliteBol')) {
      // 获取列表数据
      that.getServe()
      setTimeout(() => {
        that.getData()
      }, 1000)
      that.updateService = setInterval(() => {
        if (that.topTabIndex !== 1) {
          that.getServe()
        }
      }, 10000)
      // 推送规则
      that.set_notify('all')
    } else {
      setTimeout(() => {
        if (uni.getStorageSync('sqliteBol')) {
          // 获取列表数据
          that.getServe()
          setTimeout(() => {
            that.getData()
          }, 1000)
          that.updateService = setInterval(() => {
            if (that.topTabIndex !== 1) {
              that.getServe()
            }
          }, 10000)
          // 推送规则
          that.set_notify('all')
        } else {
          // console.log('失败')
        }
      }, 500)
    }

    // 收消息更新列表
    uni.$on('get_message', (obj) => {
      // #ifdef APP-PLUS
      that.getData()
      // #endif
    })
    // 更新联系人
    uni.$on('update_list', (obj) => {
      if (obj) {
        // #ifdef APP-PLUS
        that.getData()
        // #endif
      }
    })
  },

  // 点击右上角
  onNavigationBarButtonTap(e) {
    // 0 加号按钮  1 搜索按钮
    if (e.index == 0) {
      this.isShow = !this.isShow
    } else {
      uni.navigateTo({
        url: '/pages/index/search?type=people'
      })
    }
  },

  // 下拉
  onPullDownRefresh() {
    // 停止刷新动画
    uni.stopPullDownRefresh()
    uni.navigateTo({
      url: '/pages/device/application_market'
    })
  },

  onHide() {
    app.hideLoading()
    uni.$off('get_message')
    uni.$off('update_list')
    // 推送规则
    this.set_notify('')
    clearInterval(this.updateService)
  },
  onUnload() {
    app.hideLoading()
    uni.$off('get_message')
    uni.$off('update_list')
    // 推送规则
    this.set_notify('')
    clearInterval(this.updateService)
  },

  methods: {
    // 获取列表数据	APP端主动执行
    getData() {
      // app.showLoading();
      let that = this
      let open = DB.isOpen() // 这个是查询有没有打开数据库
      // console.log("数据库状态", open ? "开启" : "关闭");
      if (!open) {
        app.hideLoading()
        DB.openSqlite()
          .then((res) => {
            // console.log('列表==数据库已打开')
            that.getData()
            return
          })
          .catch((error) => {
            // console.log('列表==数据库开启失败')
            that.getData()
            return
          })
      } else {
        DB.selectTableData('chatlist')
          .then((res) => {
            // console.log('本地数据', res);
            // 数据按照时间排序
            let arr = res.sort(that.sortDownDate)
            // console.log('排序后对话数据', arr)

            arr.forEach((item) => {
              item.content = JSON.parse(item.content)
              item.time = getTimeText(item.time)
              item.unread = parseInt(item.unread)
              item.chattype = ''
              item.name = ''
              item.image = ''
              // 在线、离线、告警状态
              item.status = '0'

              if ((item.content.type === '1' && item.content.subtype === '1') || item.content.type === '10') {
                let str = item.content.content
                item.content.content = str.replace(/<span>/g, ' ').replace(/<\/span>/g, '')
              }

              let data = {}
              if (item.type === '1') {
                data.userid = item.roomid
              } else {
                data.userid = item.userid
              }
              // 获取姓名头像
              that.getUserInfo(data, (info) => {
                // console.log(info)
                if (info.name) {
                  item.name = info.name
                }
                if (info.image) {
                  item.image = info.image
                }
                if (info.member) {
                  item.member = info.member
                } else {
                  item.member = []
                }
                if (info.type) {
                  item.chattype = info.type
                }
                if (info.appid) {
                  item.appid = info.appid
                }
                if (info.type) {
                  item.siteid = info.siteid
                }
              })

              DB.selectTableData('contact')
                .then((res) => {
                  // console.log("建表后查询表数据", res);
                  if (res.length != 0) {
                    // console.log('表数据', JSON.parse(res[0].contact))
                    let contactData = JSON.parse(res[0].contact)
                    contactData.forEach((conitem, index) => {
                      conitem.list.forEach((conkey, index) => {
                        if (item.type === '1' && item.roomid === conkey.id) {
                          item.status = conkey.status
                        } else {
                          item.status = conkey.status
                        }
                      })
                    })
                  }
                })
                .catch((error) => {})
            })

            // 未读消息
            let unreadNum = 0
            // 删除错误数据
            // arr.forEach((item) => {
            //   // 头像名字找不到删除此消息
            //   if (item.image == '' && item.name == '') {
            //     // 删表里数据
            //     DB.deleteTableData('chatlist', 'roomid', item.roomid)
            //       .then((res) => {
            //         that.getData()
            //       })
            //       .catch((error) => {
            //         // console.log('删除失败', error)
            //       })
            //     DB.deleteTableData('history', 'roomid', this.roomid)
            //       .then((res) => {
            //         // console.log("历史记录删除")
            //       })
            //       .catch((error) => {
            //         // console.log('删除失败', error)
            //       })
            //   }
            //   unreadNum += item.unread
            // })

            // 处理未读 显示小红点
            if (unreadNum !== 0) {
              uni.showTabBarRedDot({ index: 0 })
            } else {
              uni.hideTabBarRedDot({ index: 0 })
            }

            // 处理告警移到第一位
            let status = '3'
            let findObj = {}
            for (var i = 0; i < arr.length; i++) {
              if (arr[i].content.status === status) {
                findObj = arr[i]
                arr.splice(i, 1)
                break
              }
            }
            if (JSON.stringify(findObj) !== '{}') {
              arr.unshift(findObj)
            }

            // console.log('列表', arr)

            that.arrData = arr
            that.filterArr()
            setTimeout(() => {
              app.hideLoading()
            }, 10)
          })
          .catch((error) => {
            // console.log('查询对话列表失败', error)
            that.listData = []
            that.pageLoad = true
            setTimeout(() => {
              app.hideLoading()
            }, 10)
          })
      }
    },

    // 获取 服务号 和 管理号
    getServe() {
      let that = this
      uni.getLocation({
        type: 'wgs84',
        success(res) {
          // 获取经纬度
          let data = {
            longitude: res.longitude,
            latitude: res.latitude
          }
          // console.log(data)
          app.serviceList(data, (res) => {
            if (res.code == 0) {
              res.data.map((item) => (item.time = getTimeText(item.time)))
              // console.log('服务号、管理号数据===', res.data)
              that.serviceList = res.data
              that.filterArr()
            } else {
              uni.showToast({
                title: res.message,
                image: '/images/icon/alert.png',
                mask: true
              })
            }
          })
        },
        fail() {
          // console.log('服务号、管理号获取失败')
        }
      })
    },

    filterArr() {
      let that = this
      // console.log('过滤前', that.arrData)
      let serviceIdList = that.serviceList.map((item) => item.roomid)
      let resArr = that.arrData.filter((item) => !serviceIdList.includes(item.roomid))
      // console.log(resArr)

      that.arrData.forEach((item) => {
        that.serviceList.forEach((key) => {
          if (key.roomid === item.roomid) {
            key.content = item.content
            key.time = item.time
          }
        })
      })

      that.listData = resArr
      that.pageLoad = true
    },

    // 获取用户姓名头像
    getUserInfo(value, cb) {
      app.get_userinfo(value, (res) => {
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

    // 列表排序
    sortDownDate(a, b) {
      // time 是时间的字段 a-b 正序 b-a 倒序
      return Date.parse(b.time) - Date.parse(a.time)
    },

    onBackPress() {
      // 仅 APP-PLUS 编译
      // #ifdef APP-PLUS
      plus.key.hideSoftKeybord()
      // #endif
    },

    // 接收右上角子组件消息
    childTap(e) {
      this.isShow = e
    },

    // 点击进入聊天
    intoServiceChat(item) {
      // console.log(item)
      // 校验数据库是否建表 没有就创建
      getApp().checkSqlite('nolog')

      if (item.roomid) {
        uni.navigateTo({
          url: `/pages/chat/room/service_chat?roomid=${item.roomid}&title=${item.name}&chattype=5&receiveid=${item.roomid}&appid=${item.appid}&siteid=${item.siteid}`
        })
      }
    },

    // 点击进入聊天
    intoChat(item) {
      // console.log(item)
      // 校验数据库是否建表 没有就创建
      getApp().checkSqlite('nolog')

      if (item.roomid && item.chattype) {
        uni.navigateTo({
          url: `/pages/chat/room/chat?roomid=${item.roomid}&title=${item.name}&chattype=${item.chattype}&receiveid=${item.userid}&appid=${item.appid}&siteid=${item.siteid}`
        })
      }
    },

    imageError(item) {
      this.$set(item, 'image', '/static/img/user.png')
    },

    // 取消关注
    async unFollow(e, roomid, index) {
      // console.log(`点击了${e.content.text}按钮，下标：${index}`)
      let that = this
      let data = {
        roomid: roomid
      }
      try {
        await DB.deleteTableData('history', 'roomid', roomid)
      } catch (error) {
        console.log('删除失败', error)
      }
      app.cancelFollow(data, (res) => {
        if (res.code == 0) {
          // console.log('取消关注成功')
          that.getServe()
        } else {
          uni.showToast({
            title: res.message,
            image: '/images/icon/alert.png',
            mask: true
          })
        }
      })
    },

    // 左滑删除
    async deleteItem(e, roomid, index) {
      // console.log(`点击了${e.content.text}按钮，下标：${index}`)
      // console.log(roomid)
      let that = this
      // 删表里数据
      try {
        await DB.deleteTableData('chatlist', 'roomid', roomid)
        that.getData()
      } catch (error) {
        console.log('删除失败', error)
      }
    },

    // 智能小助手
    toSmart() {
      uni.navigateTo({
        url: `/pages/device/smart_setting`
      })
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

    clickTopTab(name, index) {
      // console.log(name)

      // 取服务号、管理号 roomid 组数组
      let serviceId = this.serviceList.map((item) => item.roomid)
      // 过滤本地数据库信息 -- 移除 服务号、管理号
      let dataList = this.listData.filter((item) => !serviceId.includes(item.roomid))

      // console.log(this.serviceList)
      // console.log(serviceId)
      // console.log(this.arrData)
      console.log(dataList)

      // dataList = [
      //   {
      //     roomid: '5766a5b40-2a16-4233-baeb-',
      //     type: '1',
      //     userid: '4b4a32c1d-ab2e-4696-bfb4-f2caffc5b5ca',
      //     receiveid: '11c53127e-17a3-4613-a966-c9d2ce841bc3',
      //     time: '下午7:11',
      //     content: {
      //       type: '13',
      //       content: [
      //         {
      //           id: '45444887d-a67f-4360-9129-882052ecd249',
      //           name: '智慧共享田园',
      //           image: '/file/2021-12-21/8d2b070e-313d-4bdb-97d5-12e0a315bd7d.jpg',
      //           price: '',
      //           type: 4,
      //           things_id: 'DS-2CD3T87WD-L20210720AACHG38740354',
      //           url: '/html/#/goodsdetail',
      //           parameter: 'msgid=06cd3b0c-e043-467c-931f-70db9dee19e9&goodsid=DS-2CD3T87WD-L20210720AACHG38740354&roomid=5766a5b40-2a16-4233-baeb-a74d872c5c7e&detailid='
      //         }
      //       ]
      //     },
      //     msg_id: '1640085109583-941109',
      //     unread: 1,
      //     chattype: 5,
      //     name: '智园',
      //     image: 'https://zk.club077.com:8080/user/file/face/2021-12-17/f3684fc4-19b5-4aa4-98d6-04c224e8eca5.png',
      //     status: 0,
      //     member: []
      //   },
      //   {
      //     roomid: '57858290f-aec2-48da-b271-',
      //     type: '1',
      //     userid: '19dc56c6b-114e-4103-aaa7-94c51acd0e20',
      //     receiveid: '11c53127e-17a3-4613-a966-c9d2ce841bc3',
      //     time: '下午6:28',
      //     content: {
      //       type: '1',
      //       subtype: '3',
      //       content: 'https://zk.club077.com/chat-cloud/file/212c3377-31d0-4592-ae1f-f7818c7c3150',
      //       color: ''
      //     },
      //     msg_id: '1a2f0cff-1ae4-476e-af5a-92e847e230a4',
      //     unread: 0,
      //     chattype: 5,
      //     name: '小Mfdgfgfdgfd',
      //     image: 'http://39.99.139.115/demo/head/%E5%B0%8FM@2x.png',
      //     status: 0,
      //     member: []
      //   }
      // ]

      let filterArr = []
      if (index == 0) {
        filterArr = dataList
      } else if (index == 1) {
        filterArr = dataList.filter((item) => item.unread > 0)
      } else if (index == 2) {
        filterArr = dataList.filter((item) => item.unread === 0)
      }
      console.log(filterArr)
      this.listData = filterArr
      setTimeout(() => {
        this.topTabIndex = index
      }, 300)
    }
  }
}
</script>

<style scoped lang="scss">
.body {
  position: relative;
  height: 100vh;

  .item_box {
    margin-bottom: 2rpx;
    position: relative;
    padding: 0 40rpx;
    box-sizing: border-box;
    height: 128rpx;
    // overflow: hidden;
    background: #ffffff;
    z-index: 100;

    .item_box_left_img {
      position: relative;

      // 单聊头像
      .image_box {
        overflow: hidden;
        border-radius: 100%;

        .avatarImg1 {
          width: 90rpx;
          height: 90rpx;
        }
      }

      .image_box2 {
        overflow: hidden;
        border-radius: 10rpx;

        .avatarImg1 {
          width: 90rpx;
          height: 90rpx;
        }
      }

      // 拼头像
      .img_wrap {
        width: 90rpx;
        height: 90rpx;
        border-radius: 100%;
        overflow: hidden;
        background: #f6f7fb;

        .avatarImg {
          width: 100%;
          height: 100%;
        }

        .avatarImg2 {
          width: 50%;
          height: 100%;
        }

        .avatarImg3 {
          width: 50%;
          height: 50%;
        }
      }

      .img_wrap2 {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
      }

      .spot {
        position: absolute;
        right: 4rpx;
        bottom: 4rpx;
        width: 20rpx;
        height: 20rpx;
        border-radius: 100%;
      }

      .spot-green {
        background: #48ca41;
      }

      .spot-gray {
        background: #b5b7c8;
      }
      .spot-red {
        background: #f94a5e;
      }
    }

    .item_box_left {
      flex: 1;
      height: 100%;
      margin-left: 30rpx;
      border-bottom: solid 2rpx rgba(241, 241, 241, 100);

      .center_box {
        flex: 1;
        height: 90rpx;

        .center_title {
          .center_title_1 {
            width: 65%;
            color: #1e1e1e;
            font-size: 32rpx;
            font-weight: 500;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
          }

          .time_box {
            color: #b6babf;
            font-size: 24rpx;
          }
        }

        .center_content {
          width: 85%;
          color: #b5b5b5;
          font-size: 28rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }

        .content_spot {
          position: absolute;
          bottom: 30rpx;
          right: 40rpx;
          width: 32rpx;
          height: 32rpx;
          color: #ffffff;
          font-size: 24rpx;
          text-align: center;
          line-height: 30rpx;
          border-radius: 100%;
          background: #f94a5e;
        }
      }
    }
  }

  .changeBack {
    background: #f7f7f7;
  }

  .bg-light {
    background: $but-click-bg;
  }

  // 空空如也
  .not-wrap {
    width: 480rpx;
    height: 380rpx;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;

    .not-box {
      color: #a4a4a4;
      font-size: 28rpx;

      .img {
        margin-bottom: 44rpx;
        width: 480rpx;
        height: 278rpx;
      }
    }
  }

  // 智能小助手
  .smartSetting {
    position: fixed;
    right: 40rpx;
    bottom: 150rpx;
    width: 76rpx;
    height: 88rpx;
    z-index: 990;
  }

  .top-tab {
    width: 100%;
    white-space: nowrap;
    border-bottom: 1px solid #efefef;

    .top-tab-item {
      margin: 20rpx 0;
      display: inline-block;
      width: 120rpx;
      text-align: center;

      .name {
        color: #636367;
        font-size: 28rpx;
      }

      .change {
        color: #1e1e1e;
        font-size: 32rpx;
        font-weight: 500;
      }
    }
  }
}
</style>
