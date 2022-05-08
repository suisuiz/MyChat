<!--
 * @Descripttion: 联系人列表
 * @Author: SUI
 * @LastEditors: SUI
 * @LastEditTime: 2022-05-08 12:01:49
 * @FilePath: \MyChat\pages\contacts\contacts.vue
-->
<template>
  <view class="body" v-if="pageLoad">
    <!-- 点击右上角+ 仅 APP 编译-->
    <!-- #ifdef APP-PLUS -->
    <block v-if="isShow">
      <upper-right-plus :show="isShow" @childTap="childTap($event)"></upper-right-plus>
    </block>
    <!-- #endif -->

    <view class="other-wrap">
      <view class="line"></view>
      <view class="other uni-flex-ali" @click="newContact">
        <image class="img" src="/static/img/contact/new-contact.png" mode=""></image>
        <view class="name">新的好友</view>
      </view>
    </view>

    <!-- 联系人列表 -->
    <view class="contacts-list">
      <!-- 好友 -->
      <block v-if="contactsList.length != 0">
        <view v-for="(item, index) in contactsList" :key="'A' + index">
          <view class="contacts-list-letter" :class="'contacts-letter' + item.letter">{{ item.letter }} </view>
          <view class="contacts-list-box uni-flex-ali" v-for="(keys, i) in item.list" :key="'B' + i" @click="contactsClick(keys)" hover-class="bg-light">
            <!-- 联系人、设备头像 -->
            <image class="img" :src="keys.image" mode="" @error="imageError(keys)" v-if="keys.type !== 5"></image>

            <!-- 拼群聊头像 -->
            <view class="img_wrap" :class="keys.member.length == 2 ? 'uni-flex-ali' : keys.member.length > 2 ? 'img_wrap2' : ''" v-else>
              <block v-if="keys.member.length == 1">
                <image v-for="(values, ind) in keys.member" :key="ind" class="avatarImg" mode="aspectFill" :src="values.image" @error="imageError(values)"> </image>
              </block>
              <block v-for="(values, ind) in keys.member" :key="ind" v-else-if="keys.member.length == 2">
                <image class="avatarImg2" mode="aspectFill" :src="values.image" @error="imageError(values)"></image>
              </block>
              <block v-for="(values, ind) in keys.member" :key="ind" v-else-if="keys.member.length == 3">
                <image class="avatarImg3" mode="aspectFill" :src="values.image" @error="imageError(values)"></image>
              </block>
              <block v-for="(values, ind) in keys.member" :key="ind" v-else>
                <image class="avatarImg3" mode="aspectFill" :src="values.image" @error="imageError(values)"></image>
              </block>
            </view>

            <view class="name">{{ keys.name }}</view>
            <!-- <view class="spot" v-if="keys.type === 4" :class="spotObj[keys.status]"></view> -->
            <view class="spot" :class="spotObj[keys.status]"></view>
          </view>
        </view>
      </block>
      <!-- 空空如也 -->
      <view class="not-wrap uni-flex-center" v-else>
        <view class="not-box uni-column-center">
          <image class="img" src="/static/img/kong.png" mode=""></image>
          <text>暂无内容</text>
        </view>
      </view>
    </view>
    <!-- 字母索引 -->
    <view class="contacts-letter-box uni-column-center">
      <view v-for="(item, index) in letterList" :key="'C' + index" @tap="letterClick(item)">{{ item }} </view>
    </view>

    <!-- 弹出框 -->
    <uni-popup id="dialogInput" ref="dialogInput" type="dialog">
      <uni-popup-dialog mode="base" type="other" title=" " :content="text" @confirm="dialogInputConfirm"> </uni-popup-dialog>
    </uni-popup>
  </view>
</template>

<script>
// 引入接口
let app = require('@/common/common.js')
// 引入封装的 sqlite
import DB from '@/common/sqlite.js'
// 提示框
import uniPopup from '@/components/uni-popup/uni-popup.vue'
import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'

// 引入右上角自定义蒙版
import UpperRightPlus from '@/components/contents/UpperRightPlus/UpperRightPlus.vue'

export default {
  components: {
    uniPopup,
    uniPopupDialog,
    UpperRightPlus
  },
  data() {
    return {
      pageLoad: false, // 页面显示
      // 右上角显示
      isShow: false,
      // 联系人列表
      contactsList: [],
      text: '', // 添加好友弹出框文字
      deviceData: [], // 存放NFC设备数据
      letterList: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '#'], // 右边索引
      // 设备状态对象
      spotObj: { 1: 'spot-green', 2: 'spot-gray', 3: 'spot-red' }
    }
  },
  onLoad() {},
  onShow() {
    let that = this
    that.isShow = false

    if (uni.getStorageSync('sqliteBol')) {
      // console.log("第一次");
      // 进页面打开数据库 仅 APP-PLUS 编译
      // #ifdef APP-PLUS
      that.getSqliteData()
      // #endif
    } else {
      setTimeout(() => {
        if (uni.getStorageSync('sqliteBol')) {
          // console.log("第2次");
          // 进页面打开数据库 仅 APP-PLUS 编译
          // #ifdef APP-PLUS
          that.getSqliteData()
          // #endif
        } else {
          // console.log('失败')
        }
      }, 500)
    }

    // 更新联系人
    uni.$on('update_list', (obj) => {
      if (obj) {
        // #ifdef APP-PLUS
        // 更新联系人
        that.getSqliteData()
        // #endif
      }
    })

    uni.$on('addDevice', (obj) => {
      console.log('监听到事件来自addDevice' + JSON.stringify(obj))
      if (obj.bol) {
        that.deviceData = obj.data
        that.text = `是否添加${obj.data.name}为联系人`
        setTimeout(() => {
          that.diaType = 'else'
          that.$refs.dialogInput.open()
        }, 500)
      } else {
        that.$refs.dialogInput.close()
      }
    })
  },
  onHide() {
    uni.removeStorageSync('content_tabIndex')
    app.hideLoading()
    uni.$off('addDevice')
    uni.$off('update_list')
    if (this.pageLoad) {
      this.$refs.dialogInput.close()
    }
  },
  onUnload() {
    uni.removeStorageSync('content_tabIndex')
    app.hideLoading()
    uni.$off('addDevice')
    uni.$off('update_list')
    if (this.pageLoad) {
      this.$refs.dialogInput.close()
    }
  },
  onPullDownRefresh() {
    this.pageData()
    setTimeout(() => {
      uni.stopPullDownRefresh()
    }, 1000)
  },
  methods: {
    // 获取联系人 APP端主动执行
    getSqliteData() {
      app.showLoading()
      let that = this
      let open = DB.isOpen() // 这个是查询有没有打开数据库
      // console.log("数据库状态", open ? "开启" : "关闭");
      if (!open) {
        app.hideLoading()
        DB.openSqlite()
          .then((res) => {
            // console.log('联系人==数据库已打开')
            that.getSqliteData()
            return
          })
          .catch((error) => {
            // console.log('数据库开启失败')
            that.getSqliteData()
            return
          })
      } else {
        // 查询数据库数据
        DB.selectTableData('contact')
          .then((res) => {
            // console.log('数据', res);
            if (res.length != 0) {
              let tableData = JSON.parse(res[0].contact)

              // console.log('本地联系人列表', tableData)
              this.contactsList = tableData
              this.pageLoad = true
              setTimeout(() => {
                app.hideLoading()
              }, 10)
            }
          })
          .catch((error) => {
            // console.log('查询失败', error)
            // 建表
            let data = '"contact" text'
            // 创建表 DB.createTable(表名, 表的列)
            DB.createTable('contact', data)
              .then((res) => {
                // console.log("创建或者打开表成功");
                // 获取联系人列表
                that.pageData()
              })
              .catch((error) => {
                app.hideLoading()
                // console.log('创建表失败')
              })
          })
      }
    },

    // 获取联系人 APP端不主动执行
    pageData(dbdata) {
      let tableData = {}
      if (!dbdata) {
        // 查询表数据 DB.selectTableData(表名,查询条件列名,查询条件列值)
        // #ifdef APP-PLUS
        DB.selectTableData('contact')
          .then((res) => {
            // console.log("建表后查询表数据", res);
            if (res.length != 0) {
              // console.log('表数据', JSON.parse(res[0].contact))
              tableData = JSON.parse(res[0].contact)
            }
          })
          .catch((error) => {
            app.hideLoading()
            // console.log('查询失败', error)
          })
        // #endif
      } else {
        if (dbdata.length != 0) {
          tableData = JSON.parse(dbdata[0].contact)
        }
      }

      app.contactList2({}, (res) => {
        if (res.code == 0) {
          // #ifdef APP-PLUS
          if (JSON.stringify(tableData) != '{}') {
            // 修改表数据 DB.updateTableData(表名, 要修改的列名=修改后列值, 修改条件的列名, 修改条件的列值)
            let data = `contact = '${JSON.stringify(res.data)}'`
            // console.log(data);
            this.modifyInformation(data)
          } else {
            // 插入数据
            let data = JSON.stringify(res.data)
            // console.log(data);
            this.insertChatRow(data)
          }
          // #endif
          console.log('联系人列表', res.data)
          this.contactsList = res.data
          this.pageLoad = true
          setTimeout(() => {
            app.hideLoading()
          }, 10)
        } else if (res.code == 'skulk away') {
          console.log('读取本地', tableData)
          this.contactsList = tableData
          this.pageLoad = true
          setTimeout(() => {
            app.hideLoading()
          }, 10)
        } else {
          app.showToast(res.message)
        }
      })
    },

    /********************** sqlite 开始 *****************************/
    // 新增数据
    async insertChatRow(data) {
      // 新增/插入数据 DB.insertTableData(表名, 对应表头列的数据)
      try {
        const res = await DB.insertTableData('contact', data)
        // console.log('新增成功', res)
        this.selectSql()
      } catch (error) {
        // console.log('新增失败', error)
      }
    },

    // 查询数据
    async selectSql() {
      // 查询表 DB.selectTableData(表名,查询条件列名,查询条件列值)
      try {
        const res = await DB.selectTableData('contact')
        // console.log('新增或修改后的表数据', res)
      } catch (error) {
        // console.log('查询失败', error)
      }
    },

    // 修改表数据
    async modifyInformation(data) {
      // 修改表数据 DB.updateTableData(表名, 要修改的列名=修改后列值, 修改条件的列名, 修改条件的列值)
      try {
        await DB.updateTableData('contact', data)
        // console.log('更新成功')
        this.selectSql()
      } catch (error) {
        // console.log('修改失败', error)
      }
    },

    /********************** sqlite 结束 *****************************/

    imageError(item, index) {
      this.$set(item, 'image', '/static/img/user.png')
    },

    // 右上角按钮
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

    // 接收右上角子组件消息
    childTap(e) {
      this.isShow = e
    },

    // NFC加联系人
    dialogInputConfirm(done, name) {
      let that = this
      let data = that.deviceData
      data.thing = that.deviceData.things
      app.add_contact(data, (res) => {
        if (res.code == 0) {
          var newObj = {
            bol: false
          }
          uni.$emit('addDevice', newObj)
          uni.showToast({
            title: '添加成功',
            success() {
              done()
              that.getSqliteData()
            }
          })
        } else {
          app.showToast(res.message)
        }
      })
    },

    // 点击联系人
    contactsClick(item) {
      // console.log(item)
      if (item.id) {
        if (item.type === 5) {
          // 点击群列表
          /**
           * 	roomid 聊天室ID
           * 	receiveid 接收人ID
           * 	chattype 聊天类型 1 人 4 设备 5 群
           */
          uni.navigateTo({
            url: `/pages/chat/room/chat?roomid=${item.id}&title=${item.name}&chattype=5&receiveid=${item.id}`
          })
        } else {
          // 点击好友/设备列表
          /**
           * 	peopleId 接收人ID
           * 	chattype 聊天类型 1 人 4 设备 5 群
           */
          uni.navigateTo({
            url: `/pages/contacts/card?peopleId=${item.id}&chattype=${item.type}`
          })
        }
      }
    },

    // 点击字母索引
    letterClick(letter) {
      this.contactsList.forEach((item) => {
        if (item.letter == letter) {
          uni
            .createSelectorQuery()
            .select('.contacts-letter' + letter)
            .boundingClientRect((data) => {
              //目标位置节点 类或者 id
              uni
                .createSelectorQuery()
                .select('.body')
                .boundingClientRect((res) => {
                  //最外层盒子节点类或者 id
                  uni.pageScrollTo({
                    duration: 200, //过渡时间
                    scrollTop: data.top - res.top //到达距离顶部的top值
                  })
                })
                .exec()
            })
            .exec()
        } else {
          return
        }
      })
    },

    // 新的好友
    newContact() {
      uni.navigateTo({
        url: '/pages/contacts/new_contact'
      })
    }
  }
}
</script>

<style scoped lang="scss">
.body {
  position: relative;
  height: 100vh;
  background: #fefefe;

  .bg-light {
    background: $but-click-bg;
  }

  .other-wrap {
    margin-bottom: 20rpx;

    .line {
      height: 40rpx;
    }

    .other {
      position: relative;
      padding: 0 30rpx;
      box-sizing: border-box;

      .img {
        width: 90rpx;
        height: 90rpx;
        margin-right: 30rpx;
        border-radius: 100%;
      }

      .name {
        flex: 1;
        color: #252525;
        font-size: 32rpx;
      }
    }
  }

  /* 联系人列表 */
  .contacts-list {
    background: #ffffff;

    &-letter {
      padding: 0 40rpx;
      box-sizing: border-box;
      height: 50rpx;
      line-height: 50rpx;
      font-size: 28rpx;
      color: #232323;
      font-weight: 400;
      background: #f3f4f8;
    }

    &-box {
      position: relative;
      padding: 0 30rpx;
      box-sizing: border-box;
      height: 120rpx;

      .spot {
        position: absolute;
        left: 100rpx;
        bottom: 20rpx;
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

      // 联系人、设备头像
      .img {
        width: 90rpx;
        height: 90rpx;
        margin-right: 30rpx;
        border-radius: 100%;
      }

      // 拼头像
      .img_wrap {
        width: 90rpx;
        height: 90rpx;
        margin-right: 30rpx;
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

      .name {
        flex: 1;
        margin-right: 40rpx;
        height: 120rpx;
        line-height: 120rpx;
        color: #252525;
        font-size: 32rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }
    }

    .bg-light {
      background: $but-click-bg;
    }
  }

  /* 字母索引 */
  .contacts-letter-box {
    position: fixed;
    top: 15%;
    right: 10rpx;
    width: 50rpx;
    height: 70%;
    color: #8f8f8f;
    z-index: 999;

    view {
      line-height: 1.7;
      font-size: 22rpx;
    }
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
}
</style>
