<!--
 * @Descripttion: 入口
 * @Author: SUI
 * @Company: chorustek
 * @Date: 2020-10-15 16:24:45
 * @Version: 1.0.0
 * @LastEditors: SUI
 * @LastEditTime: 2021-11-25 19:12:48
 * @FilePath: \things\App.vue
-->
<script>
// 引入接口
let app = require('@/common/common.js')
let { sendId } = require('@/common/util.js')
let websocket = require('@/common/websocket.js')
// sqlite 变量
let DB = ''
export default {
  data() {
    return {
      // websocket连接
      socketTask: null, // 云端
      socketTask2: null // 边缘端
    }
  },

  onLaunch() {
    // 接收其他APP的传参 仅 APP-PLUS 编译
    // #ifdef APP-PLUS
    this.checkArguments()
    plus.globalEvent.addEventListener('newintent', (e) => {
      this.checkArguments()
    })
    // #endif

    // 监听个推跳转页面
    //#ifdef APP-PLUS
    // 监听在线消息事件
    plus.push.addEventListener(
      'receive',
      (msg) => {
        console.log('recevice:' + JSON.stringify(msg))
        /**
         *  推送的内容  先转对象
         *  msg.content.type 1 申请通知
         *  msg.content.type 2 聊天通知
         */
        console.log(JSON.parse(msg.content))
        let content = JSON.parse(msg.content)
        // 这里可以写跳转业务代码
        switch (content.type) {
          case 1:
            // 跳转新的朋友
            uni.setStorageSync('content_tabIndex', 1)
            uni.switchTab({
              url: '/pages/contacts/contacts',
              success: () => {
                // 隐藏 tab 小红点
                uni.hideTabBarRedDot({ index: 1 })
              }
            })
            break

          case 2:
            // content.data 接收的数据
            if (content.data.roomid) {
              uni.navigateTo({
                url: `/pages/chat/room/chat?roomid=${content.data.roomid}&title=${content.data.title}&chattype=${content.data.chattype}&receiveid=${content.data.receiveid}`
              })
            }
            break

          default:
            break
        }
      },
      false
    )

    /* 5+  push 消息推送 ps:使用:H5+的方式监听，实现推送*/
    plus.push.addEventListener(
      'click',
      (msg) => {
        console.log('click:' + JSON.stringify(msg))
        /**
         *  推送的标题/名字和内容
         *  payload:{"title":"碎碎z","content":"聊天内容"}
         */
        console.log(msg.payload)

        // uni.showModal({
        //   title: 'click 事件',
        //   content: 'click:' + JSON.stringify(msg),
        //   success: (res) => {
        //     if (res.confirm) {
        //       console.log('用户点击确定')
        //     } else if (res.cancel) {
        //       console.log('用户点击取消')
        //     }
        //   }
        // })
      },
      false
    )

    //#endif
    if (app.getToken()) {
      let that = this
      that.DBinitialize()
      that.socketTask = new websocket('8.142.124.233')
      that.socketTask.onLogin = (event) => {
        that.sockeDataLogin(event, false)
      }
      that.socketTask.onChat = (event) => {
        that.sockeDataMsg(event, false)
      }
      that.socketTask.onNotify = (event) => {
        that.sockeDataNotify(event, false)
      }
    }
  },

  onShow() {
    let that = this
    // console.log('App Show')

    if (app.getToken()) {
      // console.log('token===', app.getToken())
      // #ifdef APP-PLUS
      this.DBinitialize()
      setTimeout(() => {
        // mdns 发现IP 更新边缘侧的 IP
        require('@/common/mdns.js').switchIp()
      }, 800)
      // #endif
    }
  },

  onHide() {},

  onUnload() {
    let that = this
    // console.log('App onUnload')
    DB = require('@/common/sqlite.js')
    that.clearSocket()
    that.clearSocket2()
    // #ifdef APP-PLUS
    let open = DB.isOpen() // 这个是查询有没有打开数据库
    if (open) {
      DB.closeSqlite()
        .then((res) => {
          uni.setStorageSync('sqliteBol', false)
          // console.log('数据库已关闭')
        })
        .catch((error) => {
          // console.log('数据库关闭失败')
        })
    }
    // #endif
  },

  methods: {
    // 初始化
    DBinitialize() {
      let that = this
      // 数据库操作
      DB = require('@/common/sqlite.js')
      let open = DB.isOpen() // 这个是查询有没有打开数据库
      // console.log('数据库状态', open ? '开启' : '关闭')
      if (!open) {
        // 打开数据库
        DB.openSqlite()
          .then((res) => {
            // console.log("数据库已打开");
            uni.setStorageSync('sqliteBol', true)
            // 数据库建表
            that.checkSqlite()
            // 更新联系人
            that.getContactList('update')
          })
          .catch((error) => {
            // console.log('数据库开启失败')
            // app.showToast('数据库开启失败')
          })
      } else {
        uni.setStorageSync('sqliteBol', true)
        // 更新联系人
        that.getContactList('update')
      }

      // if (open) {
      // // 删表里数据
      // DB.deleteTableData("history")
      // 	.then(res => {
      // 			console.log("删除表数据");
      // 	})
      // 	.catch(error => {
      // 			console.log("删除失败", error);
      // 	});
      // // 删表里数据
      // DB.deleteTableData("chatlist")
      // 	.then(res => {
      // 			console.log("删除表数据");
      // 	})
      // 	.catch(error => {
      // 			console.log("删除失败", error);
      // 	});
      // // 删表
      // DB.dropTable("history")
      // 	.then(res => {
      // 		console.log("删除表");
      // 	})
      // 	.catch(error => {
      // 		console.log("删除失败", error);
      // 	});
      // DB.dropTable("chatlist")
      // 	.then(res => {
      // 		console.log("删除表");
      // 	})
      // 	.catch(error => {
      // 		console.log("删除失败", error);
      // 	});
      // }
    },

    // 给登录准备的
    begin() {
      let that = this
      that.DBinitialize()
      // console.log('begin')
      that.socketTask = null
      that.socketTask2 = null
      setTimeout(() => {
        that.socketTask = new websocket('8.142.124.233')
        that.socketTask.onLogin = (event) => {
          that.sockeDataLogin(event, false)
        }
        that.socketTask.onChat = (event) => {
          that.sockeDataMsg(event, false)
        }
        that.socketTask.onNotify = (event) => {
          that.sockeDataNotify(event, false)
        }
        // mdns 发现IP 更新边缘侧的 IP
        require('@/common/mdns.js').switchIp()
      }, 800)
    },

    // 清空 云端WebSocket
    clearSocket() {
      let that = this
      that.CLOSESOCKET()
    },

    // 清空 边缘端WebSocket
    clearSocket2() {
      let that = this
      that.CLOSESOCKET2()
    },

    checkArguments() {
      // console.log("=========检测启动参数=========");
      // console.log("Shortcut-plus.runtime.arguments: " + plus.runtime.arguments);
      // [LOG]Shortcut-plus.runtime.arguments: {"login":"main"} at App.vue
      if (plus.runtime.arguments != '') {
        let valve = JSON.parse(plus.runtime.arguments)
        if (valve.login == 'main') {
          app.industrial_enter({}, (res) => {
            if (res.code == 0) {
              uni.reLaunch({
                url: `/pages/chat/room/chat_booth?id=${res.data.room}&&title=${res.data.title}`
              })
            } else {
              app.showToast(res.message)
            }
          })
        }
      }
    },

    // 关闭 WebSocket、连接   云端
    CLOSESOCKET() {
      let that = this
      if (that.socketTask != null) {
        that.socketTask.close()
      }
    },
    // 关闭 WebSocket、连接  边缘端
    CLOSESOCKET2() {
      let that = this
      if (that.socketTask2 != null) {
        that.socketTask2.close()
      }
    },

    // 校验数据库是否建表 / 查表数据
    checkSqlite(nolog) {
      // 查询表 DB.selectTableData(表名,查询条件列名,查询条件列值)
      // 校验联系人列表数据
      DB.selectTableData('contact')
        .then((res) => {
          // console.log('contact表数据', res);
          if (res.length == 0) {
            this.getContactList()
          }
        })
        .catch((error) => {
          // console.log('查询失败', error)
          // 建表
          let sql = '"contact" text'
          DB.createTable('contact', sql)
            .then((res) => {
              console.log('创建contact表成功')
              this.getContactList('update')
            })
            .catch((error) => {
              console.log('创建表失败')
            })
        })
      // 校验历史记录数据
      DB.selectTableData('history')
        .then((res) => {
          if (!nolog) {
            // console.log("history表数据", res);
          }
        })
        .catch((error) => {
          // console.log("查询失败", error);
          // 建表
          // 历史 字段 msg_id  roomid  type  userid  receiveid  time  content  unread
          let sql = '"msg_id" varchar(70) PRIMARY KEY,"roomid" varchar(50),"type" varchar(50),"userid" varchar(50),"receiveid" varchar(50),"time" text,"content" text,"unread" int'
          DB.createTable('history', sql)
            .then((res) => {
              console.log('创建history表成功')
            })
            .catch((error) => {
              console.log('创建表失败')
            })
        })
      // 校验对话列表数据
      DB.selectTableData('chatlist')
        .then((res) => {
          if (!nolog) {
            // console.log("chatlist表数据", res);
          }
        })
        .catch((error) => {
          // console.log("查询失败", error);
          // 建表
          // 对话 字段 roomid  type  userid  receiveid  time  content  msg_id  unread
          let sql = '"roomid" varchar(50) PRIMARY KEY,"type" varchar(50),"userid" varchar(50),"receiveid" varchar(50),"time" text,"content" text,"msg_id" varchar(20),"unread" int'
          DB.createTable('chatlist', sql)
            .then((res) => {
              console.log('创建chatlist表成功')
            })
            .catch((error) => {
              console.log('创建表失败')
            })
        })
    },

    // 调联系人列表接口 更新本地数据库
    getContactList(update) {
      app.contactList2({}, (res) => {
        // console.log('获取联系人列表')
        if (res.code == 0) {
          if (update) {
            // console.log(res.data)
            // 修改表数据 DB.updateTableData(表名, 要修改的列名=修改后列值, 修改条件的列名, 修改条件的列值)
            let data = `contact = '${JSON.stringify(res.data)}'`
            DB.updateTableData('contact', data)
              .then((res) => {
                uni.$emit('update_list', true)
                console.log('联系人列表更新成功')
              })
              .catch((error) => {
                this.checkSqlite('nolog')
                console.log('修改失败', error)
              })
          } else {
            // 插入数据
            let data = JSON.stringify(res.data)
            DB.insertTableData('contact', data)
              .then((res) => {
                uni.$emit('update_list', true)
                // console.log("添加成功");
              })
              .catch((error) => {
                console.log('新增失败', error)
              })
          }
        } else {
          console.log('失败')
        }
      })
    },

    // 历史记录表-新增数据
    async insertHistoryData(sql, seq, bol, obj, subtype) {
      let that = this
      try {
        const historyData = await DB.selectTableData('history', 'msg_id', seq)

        if (historyData.length == 0) {
          let condition = "'msg_id','roomid','type','userid','receiveid','time','content','unread'"
          try {
            // 处理 subtype 9 不加入历史
            if (!subtype || subtype !== '9') {
              // 新增/插入数据 DB.insertOrReplaceData(表名, 对应表头列的数据)
              await DB.insertTableData('history', sql, condition)
            }
            if (seq) {
              // 接收到新数据通知聊天刷新
              uni.$emit('get_message', obj)
            }
          } catch (error) {
            // console.log('history插入数据库失败', error)
          }
        }

        // 接收到了消息，给应答
        that.sockeReceiveMsg(seq, bol)
      } catch (error) {
        console.log('catch 失败==', error)
      }
    },

    // 对话列表--新增数据
    async insertListChat(sql) {
      let condition = "'roomid','type','userid','receiveid','time','content','msg_id','unread'"
      // 新增/更新数据 DB.insertOrReplaceData(表名, 对应表头列的数据)
      try {
        await DB.insertOrReplaceData('chatlist', sql, condition)
        // 接收到消息显示小红点
        // uni.showTabBarRedDot({ index: 0 })
      } catch (error) {
        console.log('chatlist插入数据库失败', error)
      }
    },

    // socket 接收登录消息处理
    sockeDataLogin(arr, bol) {
      let that = this
      that.checkSqlite('nolog')
      if (arr.length > 0) {
        console.log(`${bol ? '边缘端' : '云端'}login接收数据`, arr)
        for (let i = 0; i < arr.length; i++) {
          /**
           *  arr[i].type
           *  1  群聊 、 2 单聊 、3 刷新联系人 、4 添加带网关设备接收到消息停止倒计时 、5 新的朋友红点
           */
          switch (arr[i].type) {
            case '3':
              // 接收消息更新联系人列表
              that.getContactList('update')
              // 收到消息应答
              that.sockeReceiveMsg(arr[i].msg_id, bol)
              break
            case '4':
              // 收到消息应答
              that.sockeReceiveMsg(arr[i].msg_id, bol)
              break
            case '5':
              // 联系人加小红点
              uni.showTabBarRedDot({ index: 1 })
              // 收到消息应答
              that.sockeReceiveMsg(arr[i].msg_id, bol)
              break
            default:
              // 对话 字段 roomid  type  userid  receiveid  time  content  msg_id  unread
              let content = JSON.stringify(arr[i].msg)
              let chatSql = `'${arr[i].roomid}','${arr[i].type}','${arr[i].userid}','${arr[i].receiveid}','${arr[i].time}','${content}','${arr[i].msg_id}',1`

              // 处理 @xx 转控制面板处理
              if (arr[i].msg.subtype !== '9') {
                // 插入对话列表
                that.insertListChat(chatSql)
              }

              // 历史 字段 msg_id  roomid  type  userid  receiveid  time  content  unread
              let historySql = `'${arr[i].msg_id}${arr[i].roomid}','${arr[i].roomid}','${arr[i].type}','${arr[i].userid}','${arr[i].receiveid}','${arr[i].time}','${content}',1`
              // 插入历史记录表		arr[i].msg_id 是 序列号 seq
              // 边缘端 true  ;   云端  false
              that.insertHistoryData(historySql, arr[i].msg_id, bol, arr[i].msg.subtype)
              break
          }
        }
      }
    },

    // socket 接收 msg 消息处理
    sockeDataMsg(sockeData, bol) {
      // console.log(`${bol ? '边缘端' : '云端'}socket收到内容`, sockeData);
      let that = this
      let obj = sockeData.response.data
      console.log(`${bol ? '边缘端' : '云端'}msg接收数据`, obj)

      // 判断设备告警 刷新设备列表设备状态
      that.deviceAlarm(obj)

      // 对话 字段 roomid  type  userid  receiveid  time  content  msg_id  unread
      let content = JSON.stringify(obj.msg)
      let chatuserid = obj.userid
      // 处理发送名片
      if (obj.msg.type == '8') {
        // 不是发给自己
        if (uni.getStorageSync('userId') !== obj.msg.content.shareto) {
          chatuserid = obj.msg.content.shareto
        }
      }
      let chatSql = `'${obj.roomid}','${obj.type}','${chatuserid}','${obj.receiveid}','${obj.time}','${content}','${sockeData.seq}',1`

      // 处理 @xx 转控制面板处理
      if (obj.msg.subtype !== '6' && obj.msg.subtype !== '9') {
        // 插入对话列表
        that.insertListChat(chatSql)
      }

      // 历史 字段 msg_id  roomid  type  userid  receiveid  time  content  unread
      let historySql = `'${sockeData.seq}${obj.roomid}','${obj.roomid}','${obj.type}','${obj.userid}','${obj.receiveid}','${obj.time}','${content}',1`
      // 插入历史记录表		arr[i].msg_id 是 序列号 seq
      let dataObj = {
        roomid: obj.roomid,
        type: obj.type,
        userid: obj.userid,
        receiveid: obj.receiveid,
        time: obj.time,
        content: JSON.parse(content),
        seq: sockeData.seq
      }
      // 边缘端 true  ;   云端  false
      that.insertHistoryData(historySql, sockeData.seq, bol, dataObj, obj.msg.subtype)
    },

    // socket 接收 notify 消息处理
    sockeDataNotify(sockeData, bol) {
      let that = this
      let notifyMsg = sockeData.response.data
      console.log(`${bol ? '边缘端' : '云端'}notify接收消息`, notifyMsg)
      /**
       *  notifyMsg.type
       *  1  群聊 、 2 单聊 、3 刷新联系人 、4 添加带网关设备接收到消息停止倒计时 、5 新的朋友红点
       */
      switch (notifyMsg.type) {
        case '3':
          // 接收消息更新联系人列表
          that.getContactList('update')
          // 收到消息应答
          that.sockeReceiveMsg(sockeData.seq, bol)
          break
        case '4':
          // 添加带网关设备接收到消息停止倒计时
          let notifyObj = {
            id: notifyMsg.msg
          }
          if (notifyMsg.roomid) {
            notifyObj.roomid = notifyMsg.roomid
          }
          uni.$emit('add_gw_device', notifyObj)
          // 接收消息更新联系人列表
          that.getContactList('update')
          // 收到消息应答
          that.sockeReceiveMsg(sockeData.seq, bol)
          break
        case '5':
          // 联系人加小红点
          uni.showTabBarRedDot({ index: 1 })
          // 收到消息应答
          that.sockeReceiveMsg(sockeData.seq, bol)
          break
        default:
          break
      }
    },

    // 设备告警处理 刷新设备列表设备状态
    async deviceAlarm(obj) {
      if (obj.type == '2' && obj.msg.type == '1' && obj.msg.subtype == '1' && obj.msg.status) {
        // 查询表 DB.selectTableData(表名,查询条件列名,查询条件列值)
        try {
          let res = await DB.selectTableData('contact')
          let contact = JSON.parse(res[0].contact)
          let device = contact.device
          device.forEach((key) => {
            key.list.forEach((value) => {
              if (value.id === obj.userid) {
                value.status = obj.msg.status
              }
            })
          })

          // 更新本地数据库
          try {
            let data = `contact = '${JSON.stringify(contact)}'`
            await DB.updateTableData('contact', data)
          } catch (err) {
            console.log('查询失败', err)
          }
        } catch (error) {
          console.log('查询失败', error)
        }
      }
    },

    // socket 收到消息应答
    sockeReceiveMsg(seq, bol) {
      let that = this
      if (seq) {
        that.checkSqlite()
        let msg_ack = {
          cmd: 'msg_ack',
          seq: seq,
          response: {
            code: 200,
            codeMsg: 'Success',
            data: 'ok'
          }
        }
        // bol 边缘端 true  ;   云端  false
        if (!bol) {
          that.socketTask.send({
            data: JSON.stringify(msg_ack),
            success() {
              console.log('云端收消息成功')
            }
          })
        } else {
          that.socketTask2.send({
            data: JSON.stringify(msg_ack),
            success() {
              console.log('边缘收消息成功')
            }
          })
        }
      }
    }
  }
}
</script>

<style>
/* APP-NVUE 不编译，其他编译 */
/* #ifndef APP-NVUE */
/* @import './common/uni.css'; */
@import '@/static/css/uni.css';
/* #endif */

/* @import './common/uni-nvue.css'; */
@import '@/static/css/uni-nvue.css';

/* 仅 MP-TOUTIAO 编译 */
/* #ifdef MP-TOUTIAO */
@font-face {
  font-family: uniicons;
  src: url('/static/uni.ttf');
}

/* #endif */

/* APP-NVUE 不编译，其他编译 */
/* #ifndef APP-NVUE */
/* @import './common/index.css'; */
@import '@/static/css/index.css';
/* #endif */
</style>
