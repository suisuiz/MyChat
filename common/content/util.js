/*
 * @Descripttion: 公共js
 * @Author: SUI
 * @LastEditTime: 2023-03-15 10:39:48
 * @FilePath: \things\common\content\util.js
 */
// 时间戳转年月日
function formatDate(data, type) {
  if (!data) data = new Date().getTime()
  let now = new Date(data) // 表示当前系统时间的Date对象
  let year = now.getFullYear() // 当前系统时间的完整年份值 取得4位数的年份
  let month = now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1 // 当前月份值
  let monthString = now.toDateString().split(' ')[1] // 当前月份字符串
  let date = now.getDate() < 10 ? '0' + now.getDate() : now.getDate() // 当前月份中的日
  let day = now.getDay() // 当前时间的星期值
  let weeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  let week = weeks[day] // 根据星期值，从数组中获取对应的星期字符串
  let hour = now.getHours() < 10 ? '0' + now.getHours() : now.getHours() // 当前时间的小时值
  let minute = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes() // 当前的分钟值
  let second = now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds() // 当前的秒钟值
  let milliSeconds = now.getMilliseconds() < 100 ? (now.getMilliseconds() < 10 ? '00' + now.getMilliseconds() : '0' + now.getMilliseconds()) : now.getMilliseconds()
  let obj = { year, month, monthString, date, week }
  const typeArr = ['year', 'month', 'monthString', 'date', 'week']
  if (typeArr.includes(type)) return obj[type]
  else return `${year}-${month}-${date} ${hour}:${minute}:${second}.${milliSeconds}`
}

// 根据年月份 获取 当月天数 和 对应的星期
function getMonthDays(year, month) {
  let stratDate = new Date(year, month - 1, 1),
    endData = new Date(year, month, 1)
  let days = (endData - stratDate) / (1000 * 60 * 60 * 24)
  let list = []
  for (let i = 1; i <= days; i++) {
    // const day = i
    const day = i > 9 ? i : '0' + i
    // const date = month + '-' + day
    const week =
      new Date(month + '/' + i + '/' + year).getDay() == 0
        ? '周日'
        : new Date(month + '/' + i + '/' + year).getDay() == 1
        ? '周一'
        : new Date(month + '/' + i + '/' + year).getDay() == 2
        ? '周二'
        : new Date(month + '/' + i + '/' + year).getDay() == 3
        ? '周三'
        : new Date(month + '/' + i + '/' + year).getDay() == 4
        ? '周四'
        : new Date(month + '/' + i + '/' + year).getDay() == 5
        ? '周五'
        : new Date(month + '/' + i + '/' + year).getDay() == 6
        ? '周六'
        : ''
    list.push({
      // date,
      bol: false,
      week,
      day
    })
  }
  return list
}

// 日期转时间戳
function getDateFromString(str) {
  str = str.replace(/[-]/g, '/')
  return new Date(str).getTime()
}

// 生成随机数
function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}

// 生成序列号
function sendId() {
  let timeStamp = new Date().getTime()
  let randId = randomNumber(100000, 999999)
  let id = timeStamp + '-' + randId
  return id
}

// 处理聊天时间显示
function getTimeText(timeS) {
  if (timeS.length === 23) timeS = timeS.slice(0, -4)
  let todayT = '' //
  let yestodayT = ''
  let month = timeS.slice(5, 11)
  let timeCha = getTimeS(timeS)
  timeS = timeS.slice(-8)
  todayT = new Date().getHours() * 60 * 60 * 1000 + new Date().getMinutes() * 60 * 1000 + new Date().getSeconds() * 1000
  yestodayT = todayT + 24 * 60 * 60 * 1000
  // 其他时间
  if (timeCha > yestodayT) {
  }
  // 昨天
  if (timeCha > todayT && timeCha < yestodayT) month = '昨天 '
  // 当天
  if (timeCha < todayT) month = ' '
  return timeS.slice(0, 2) > 12 ? month + '下午 ' + (timeS.slice(0, 2) == 12 ? 12 : timeS.slice(0, 2) - 12) + timeS.slice(2, 5) : month + '上午 ' + timeS.slice(0, 5)
}

// 处理 图片、视频、H5 的显示问题 (云端和边缘端 地址)
function getSrc(appid, siteid, src, type) {
  let reg = /((([a-f0-9]{2}:){5})|(([a-f0-9]{2}-){5}))[a-f0-9]{2}/gi
  let parameter = ''
  if (reg.test(src)) {
    parameter = ''
  } else {
    if (type === 'request') parameter = `/${siteid}/${appid}`
    else parameter = `/${siteid}`
  }
  // console.log('parameter==', parameter)
  let newSrc = `${getIP(siteid)}${parameter}${src}`
  return newSrc
}

// 获取 IP
function getIP(siteid) {
  // 默认云端
  let ip = getApp().apiHost
  if (siteid) {
    // 判断云端还是边缘端  true  边缘端   false  云端
    let sendBol = false
    if (getApp().socketTask2 != null && getApp().socketTask2.loginok) sendBol = true
    if (siteid === getApp().mdns_siteId && sendBol) {
      ip = `http://${uni.getStorageSync('localAddress')}`
    }
  } else {
    // 判断云端还是边缘端  true  边缘端   false  云端
    let sendBol = false
    if (getApp().socketTask2 != null && getApp().socketTask2.loginok) sendBol = true
    if (sendBol) ip = `http://${uni.getStorageSync('localAddress')}`
  }
  return ip
}

// 长按聊天消息弹出选项
function getPopData(item) {
  let { content: item_content, userid } = item
  console.log('getPopData', item_content)
  let { type, subtype, content, subclass, ticid } = item_content
  // if (type === '18') return

  let user_id = uni.getStorageSync('userId')
  let popButton = []
  // 文档不删除、只撤回
  // if (!(type === '9' || type === '16') || ((type === '9' || type === '16') && userid !== user_id)) {
  if (!(type === '9' || type === '16') || type === '9' || type === '16') {
    popButton = [
      {
        type: 'delete',
        name: '删除'
      }
    ]
  }
  if (content === '此消息已撤回') {
    return popButton
  } else {
    switch (type) {
      case '1': {
        if (subtype !== '8') {
          popButton.unshift({
            type: 'share',
            name: '转发'
          })
        }
        // type 1  subtype  1 || 11
        if (subtype === '1') {
          popButton.unshift({
            type: 'copy',
            name: '复制'
          })
        } else if (subtype === '11') {
          popButton.unshift({
            type: 'copy',
            name: '复制'
          })
          popButton.push({
            type: 'keyboard',
            name: '键盘'
          })
        } else if (subtype === '2') {
          popButton = [
            {
              type: 'delete',
              name: '删除'
            }
          ]
        }
        break
      }
      case '9':
      case '16': {
        if (ticid) {
          if (subclass === 'notes' && userid === user_id) {
            popButton.push({
              type: 'edit',
              name: '编辑'
            })
          }
          popButton.push(
            {
              type: 'share',
              name: '转发'
            },
            {
              type: 'comment',
              name: '评论'
            }
          )
        }
        break
      }
      case '11': {
        popButton.unshift(
          {
            type: 'collect',
            name: '收藏'
          },
          {
            type: 'share',
            name: '转发'
          },
          {
            type: 'forward',
            name: '分享'
          }
        )
        break
      }
      case '15': {
        popButton.unshift({
          type: 'share',
          name: '转发'
        })
        break
      }
      case '19': {
        if (subtype === '1') {
          popButton.unshift({
            type: 'share',
            name: '转发'
          })
        }
        break
      }
      default:
        break
    }
    // 判断是否自己发的消息 加撤回
    if ((type !== '9' || type !== '16') && userid === user_id) {
      popButton.push({
        type: 'withdraw',
        name: '撤回'
      })
    }
    return popButton
  }
}

// 时间戳获取
function getTimeS(timeS) {
  timeS = timeS.replace(/[-]/g, '/')
  return new Date().getTime() - new Date(timeS).getTime() - 1000 //有一秒的误差
}

function formatTime(time) {
  if (typeof time !== 'number' || time < 0) {
    return time
  }

  var hour = parseInt(time / 3600)
  time = time % 3600
  var minute = parseInt(time / 60)
  time = time % 60
  var second = time

  return [hour, minute, second]
    .map(function (n) {
      n = n.toString()
      return n[1] ? n : '0' + n
    })
    .join(':')
}

function formatLocation(longitude, latitude) {
  if (typeof longitude === 'string' && typeof latitude === 'string') {
    longitude = parseFloat(longitude)
    latitude = parseFloat(latitude)
  }

  longitude = longitude.toFixed(2)
  latitude = latitude.toFixed(2)

  return {
    longitude: longitude.toString().split('.'),
    latitude: latitude.toString().split('.')
  }
}

var dateUtils = {
  UNITS: {
    年: 31557600000,
    月: 2629800000,
    天: 86400000,
    小时: 3600000,
    分钟: 60000,
    秒: 1000
  },
  humanize(milliseconds) {
    var humanize = ''
    for (var key in this.UNITS) {
      if (milliseconds >= this.UNITS[key]) {
        humanize = Math.floor(milliseconds / this.UNITS[key]) + key + '前'
        break
      }
    }
    return humanize || '刚刚'
  },
  format(dateStr) {
    var date = this.parse(dateStr)
    var diff = Date.now() - date.getTime()
    if (diff < this.UNITS['天']) {
      return this.humanize(diff)
    }
    var _format = (number) => {
      return number < 10 ? '0' + number : number
    }
    return date.getFullYear() + '/' + _format(date.getMonth() + 1) + '/' + _format(date.getDate()) + '-' + _format(date.getHours()) + ':' + _format(date.getMinutes())
  },
  parse(str) {
    //将"yyyy-mm-dd HH:MM:ss"格式的字符串，转化为一个Date对象
    var a = str.split(/[^0-9]/)
    return new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5])
  }
}

// 缓存文件地址
function getFileCache(filename) {
  return new Promise((resolve, reject) => {
    // 文件缓存key值
    let storageKey = 'FILE_CACHE_INFO_' + filename
    // 首先获取本地存储的数据，查询是否有对应文件路径，如果有缓存内容，直接返回
    const cacheFileInfo = uni.getStorageSync(storageKey)
    if (cacheFileInfo) {
      // console.log('缓存地址为：' + cacheFileInfo)
      resolve(cacheFileInfo)
    } else {
      console.log('未缓存,进行下载保存', filename)
      // 如果没有，执行下载，并存储起来
      uni.downloadFile({
        url: filename,
        success(res) {
          if (res.statusCode === 200) {
            console.log('下载成功')
            // 进行本地保存
            uni.saveFile({
              tempFilePath: res.tempFilePath,
              success(res2) {
                console.log(res2.savedFilePath)
                uni.setStorageSync(storageKey, res2.savedFilePath)
                resolve(res2.savedFilePath)
              },
              fail(res2) {
                console.error('保存文件失败', res2)
                resolve(filename)
              }
            })
          } else {
            console.error('下载文件失败 statusCode!==200')
            resolve(filename)
          }
        },
        fail(res) {
          console.error('下载文件失败', res)
          resolve(filename)
        }
      })
    }
  })
}

// 处理浮点数 保留 4 位小数 结果是 String 字符串
function formatNum(num) {
  const accuracyNum = Math.pow(10, 4)
  return parseFloat(Math.round((num + Number.EPSILON) * accuracyNum) / accuracyNum).toFixed(4)
}

// 获取用户姓名头像
function getUserInfo(siteid, value) {
  let app = require('@/common/common.js')
  return new Promise((resolve, reject) => {
    app.get_userinfo(siteid, value, (res) => {
      // console.log('util.js==getUserInfo==', res)
      resolve(res)
    })
  })
}

function getImageCache(filePath, fileKey) {
  // 图片缓存key值
  let storageKey = 'IMAGE_CACHE_INFO_' + fileKey
  // 首先获取本地存储的数据，查询是否有对应文件路径，如果有缓存内容，直接返回
  const cacheFileInfo = uni.getStorageSync(storageKey)
  if (cacheFileInfo) {
    // console.log('缓存地址为：' + cacheFileInfo)
    return cacheFileInfo
  } else {
    console.log('未缓存,进行下载保存', filePath)
    // 如果没有，执行下载，并存储起来
    uni.downloadFile({
      url: filePath,
      success(res) {
        if (res.statusCode === 200) {
          console.log('下载成功')
          // 进行本地保存
          uni.saveFile({
            tempFilePath: res.tempFilePath,
            success(res2) {
              console.log(res2.savedFilePath)
              uni.setStorageSync(storageKey, res2.savedFilePath)
              return res2.savedFilePath
            },
            fail(res2) {
              console.error('保存文件失败', res2)
              return filePath
            }
          })
        } else {
          console.error('下载文件失败 statusCode!==200')
          return filePath
        }
      },
      fail(res) {
        console.error('下载文件失败', res)
        return filePath
      }
    })
  }
  // 获取本地已保存的文件列表。
  uni.getSavedFileList({
    success(res) {
      console.log('获取本地已保存的文件列表', res.fileList)
    }
  })
}

function uuid() {
  var s = []
  var x = '0123456789abcdef'
  for (var i = 0; i < 36; i++) {
    s[i] = x.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[14] = '4'
  s[19] = x.substr((s[19] & 0x3) | 0x8, 1)
  s[8] = s[13] = s[18] = s[23] = '-'

  var uuid = s.join('')
  return uuid
}

module.exports = {
  formatDate,
  getMonthDays,
  randomNumber,
  sendId,
  getTimeText,
  getSrc,
  getIP,
  getPopData,
  formatTime,
  formatLocation,
  dateUtils,
  getFileCache,
  formatNum,
  getUserInfo,
  getDateFromString,
  getImageCache,
  uuid
}
