/*
 * @Descripttion: mdns 切换 IP
 * @Author: SUI
 * @Date: 2021-07-26 10:47:36
 * @LastEditors: SUI
 * @LastEditTime: 2023-05-26 09:23:10
 * @FilePath: \things\common\mdns.js
 */
let websocket = require('@/common/websocket.js')
const mdns = uni.requireNativePlugin('gl-mdns')

module.exports = {
  // mdns 自动发现同网段设备服务
  switchIp() {
    // #ifdef APP-PLUS
    mdns.startDiscovery(
      {
        serviceType: '_nfd._tcp',
        timeOut: 5
      },
      (res) => {
        // console.log(JSON.stringify(res));
        // this.result += JSON.stringify(res) + "\n";
        if (res.result == 'stopped') {
        } else if (res.result == 'discovered') {
          let name = res.name
          let ip = res.ip
          if (ip.split('.').length != 4) return
          // 获取到 IP 更新 websocket
          // console.log(ip, name)
          getApp().mdns_siteId = name
          if (getApp().socketTask2 != null) {
            if (name == getApp().socketTask2.siteid && ip != getApp().socketTask2.ip) {
              if (uni.getStorageSync('localAddress') !== ip) uni.setStorageSync('localAddress', ip)
              getApp().socketTask2.close()
              getApp().socketTask2 = new websocket(`http://${ip}`, true, name, getApp().siteId)
              getApp().socketTask2.onLogin = (event) => {
                getApp().sockeDataLogin(event, true)
              }
              getApp().socketTask2.onChat = (event) => {
                getApp().sockeDataMsg(event, true)
              }
              getApp().socketTask2.onNotify = (event) => {
                getApp().sockeDataNotify(event, true)
              }
              getApp().socketTask2.onRevoke = (event) => {
                getApp().sockeDataRevoke(event.response.data, event.seq, true)
              }
            }
          } else {
            if (uni.getStorageSync('localAddress') !== ip) uni.setStorageSync('localAddress', ip)
            getApp().socketTask2 = new websocket(`http://${ip}`, true, name, getApp().siteId)
            getApp().socketTask2.onLogin = (event) => {
              getApp().sockeDataLogin(event, true)
            }
            getApp().socketTask2.onChat = (event) => {
              getApp().sockeDataMsg(event, true)
            }
            getApp().socketTask2.onNotify = (event) => {
              getApp().sockeDataNotify(event, true)
            }
            getApp().socketTask2.onRevoke = (event) => {
              getApp().sockeDataRevoke(event.response.data, event.seq, true)
            }
          }
        }
      }
    )
    // #endif
  }
}
