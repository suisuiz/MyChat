<!--
 * @Descripttion: 新建群聊---聊天室操作
 * @Author: SUI
 * @LastEditors: SUI
 * @LastEditTime: 2022-05-08 12:02:42
 * @FilePath: \MyChat\pages\chat\creat.vue
-->
<template>
  <view class="body" v-if="pageLoad">
    <scroll-view scroll-y class="body_wrap">
      <!-- 建群/群加人 -->
      <block v-if="pageType != 'del'">
        <!-- 切换好友和设备 -->
        <view class="center-tab">
          <view class="tab-box" v-for="(item, index) in contactsTab" :key="'A' + index" @click="contabClick(index)">
            <view class="items" :class="conTab == index ? 'conCheck' : ''">{{ item }}</view>
          </view>
        </view>

        <!-- 联系人列表 -->
        <view class="contacts-list" v-if="contactsList.length != 0">
          <view v-for="(item, index) in contactsList" :key="'B' + index">
            <view class="contacts-list-letter" :class="'contacts-letter' + item.letter">{{ item.letter }}</view>
            <view class="contacts-list-box" v-for="(key, i) in item.list" :key="'C' + i" @click="bindClick(key)" hover-class="bg-light">
              <view class="contacts-list-box-box">
                <image class="img" :src="key.image" mode="" @error="imageError(key)"></image>
                <view class="name">{{ key.name }}</view>
              </view>
              <uni-icons v-if="!key.checked" type="checkbox-filled" color="#E2E2E2" size="18" />
              <block v-if="key.checked">
                <uni-icons v-if="!key.inroom" type="checkbox-filled" color="#EF4B5B" size="18" />
                <uni-icons style="opacity: 0.6" v-else type="checkbox-filled" color="#EF4B5B" size="18" />
              </block>
            </view>
          </view>
        </view>

        <!-- 空空如也 -->
        <view class="not-wrap uni-flex-center" v-else>
          <view class="not-box uni-column-center">
            <image class="img" src="/static/img/kong.png" mode=""></image>
            <text>暂无内容</text>
          </view>
        </view>
      </block>

      <!-- 群删人 -->
      <block v-else>
        <block v-if="delList.length != 0">
          <view class="del-list" v-for="(item, index) in delList" :key="'D' + index" @click="delClick(item)" hover-class="bg-light">
            <view class="del-list-box">
              <image class="img" :src="item.image" mode="" @error="imageError(item)"></image>
              <view class="name">{{ item.name }}</view>
            </view>
            <uni-icons v-if="item.checked" type="checkbox-filled" color="#EF4B5B" size="18" />
            <uni-icons v-if="!item.checked" type="checkbox-filled" color="#E2E2E2" size="18" />
          </view>
        </block>

        <!-- 空空如也 -->
        <view class="not-wrap uni-flex-center" v-else>
          <view class="not-box uni-column-center">
            <image class="img" src="/static/img/kong.png" mode=""></image>
            <text>暂无内容</text>
          </view>
        </view>
      </block>
    </scroll-view>

    <!-- 右下角按钮 -->
    <view class="complete_wrap">
      <!-- 建群 -->
      <view v-if="pageType == ''" :class="changeStyle ? 'complete1' : 'complete'" @click="confirmDialog('creat')"> 完成{{ selectarr.length != 0 ? selectarr.length : '' }} </view>
      <!-- 添加成员 -->
      <view v-if="pageType == 'add'" :class="changebtn ? 'complete1' : 'complete'" @click="complete_btn"> 添加 </view>
      <!-- 删除成员 -->
      <view v-if="pageType == 'del'" :class="changebtn ? 'complete_del1' : 'complete_del'" @click="delete_btn"> 确定删除 </view>
      <!-- 单聊转群聊 -->
      <view v-if="pageType == 'change'" :class="changebtn ? 'complete1' : 'complete'" @click="confirmDialog('change')"> 完成 </view>
    </view>
    <uni-popup id="dialogInput" ref="dialogInput" type="dialog">
      <uni-popup-dialog mode="input" title="群组命名" placeholder="请填写群组名称" @confirm="dialogInputConfirm"> </uni-popup-dialog>
    </uni-popup>
    <uni-popup id="deldialog" ref="deldialog" type="dialog">
      <uni-popup-dialog mode="base" type="other" title=" " content="确定删除吗?" @confirm="deldialog"> </uni-popup-dialog>
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
export default {
  components: {
    uniPopup,
    uniPopupDialog
  },
  data() {
    return {
      // 控制页面显示
      pageLoad: false,
      contactsTab: ['好友', '设备'],
      conTab: 0,
      // 控制按钮样式
      changeStyle: false,
      changebtn: false,
      // 判断入口 建群/添加成员/删除成员
      pageType: '',
      // 联系人列表
      allData: {
        contact: [],
        device: []
      },
      contactsList: [],
      // 获取删除成员列表
      delList: [],
      // 选择的成员
      selectarr: [],
      // 聊天室ID
      room_id: '',
      members: []
    }
  },
  onLoad({ id, type, member }) {
    // 只有群聊拉人删人才会传值
    this.room_id = id
    if (typeof type != 'undefined') {
      this.pageType = type
    }
    app.showLoading()
    switch (this.pageType) {
      case 'add':
        // 群聊添加成员
        this.contact_add()
        break
      case 'del':
        // 群聊删除成员
        this.contact_del()
        break
      case 'change':
        this.members = JSON.parse(member)
        // 单聊转群聊
        // #ifdef APP-PLUS
        this.getData('change')
        // #endif
        // 直接获取数据 除了 APP-PLUS 都编译
        // #ifndef APP-PLUS
        this.pageData([], 'change')
        // #endif
        break
      default:
        // 建群
        // #ifdef APP-PLUS
        this.getData()
        // #endif
        // 直接获取数据 除了 APP-PLUS 都编译
        // #ifndef APP-PLUS
        this.pageData()
        // #endif
        break
    }
  },

  methods: {
    // 点击tab
    contabClick(index) {
      this.conTab = index
      if (index == 0) {
        this.contactsList = this.allData.contact
      } else {
        this.contactsList = this.allData.device
      }
    },

    // 建群获取联系人
    async getData(from) {
      // 查询数据库数据
      try {
        let dbdata = await DB.selectTableData('contact')
        if (from) {
          this.pageData(dbdata, 'change')
        } else {
          this.pageData(dbdata)
        }
      } catch (error) {
        console.log('查询失败', error)
        if (from) {
          this.pageData([], 'change')
        } else {
          this.pageData()
        }
      }
    },

    // 获取联系人 APP端不主动执行
    pageData(dbdata, from) {
      let tableData = {}
      if (dbdata.length != 0) {
        tableData = JSON.parse(dbdata[0].contact)
      }
      let membersObj = this.members[0]
      app.showLoading()
      app.contactList({}, (res) => {
        if (res.code == 0) {
          // #ifdef APP-PLUS
          // console.log("tableData===", tableData)
          if (JSON.stringify(tableData) != '{}') {
            // 修改表数据 DB.updateTableData(表名, 要修改的列名=修改后列值, 修改条件的列名, 修改条件的列值)
            // let data = `contact = '${JSON.stringify(res.data)}'`
            // console.log(data);
            // this.modifyInformation(data)
          } else {
            // 插入数据
            // let data = JSON.stringify(res.data)
            // console.log(data);
            // this.insertChatRow(data)
          }
          // #endif

          let contact = res.data.contact
          let device = res.data.device
          contact.map((item) => {
            item.list.map((key) => {
              key.type = 1
              key.checked = false
              // 单聊转群聊特殊处理
              if (from) {
                key.inroom = false
                if (key.id == membersObj.userid) {
                  key.checked = true
                  key.inroom = true
                }
              }
            })
          })
          device.map((item) => {
            item.list.map((key) => {
              key.type = 4
              key.checked = false
              // 单聊转群聊特殊处理
              if (from) {
                key.inroom = false
                if (key.id == membersObj.userid) {
                  key.checked = true
                  key.inroom = true
                }
              }
            })
          })

          // console.log(res.data);
          this.allData = res.data
          this.contactsList = res.data.contact
          this.pageLoad = true
          setTimeout(() => {
            app.hideLoading()
          }, 10)
        } else if (res.code == 'skulk away') {
          console.log('读取本地', tableData)
          let contact = tableData.contact
          let device = tableData.device
          contact.map((item) => {
            item.list.map((key) => {
              key.type = 1
              key.checked = false
              // 单聊转群聊特殊处理
              if (from) {
                key.inroom = false
                if (key.id == membersObj.userid) {
                  key.checked = true
                  key.inroom = true
                }
              }
            })
          })
          device.map((item) => {
            item.list.map((key) => {
              key.type = 4
              key.checked = false
              // 单聊转群聊特殊处理
              if (from) {
                key.inroom = false
                if (key.id == membersObj.userid) {
                  key.checked = true
                  key.inroom = true
                }
              }
            })
          })
          this.allData = tableData
          this.contactsList = tableData.contact
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
        console.log('新增成功', res)
        this.selectSql()
      } catch (error) {
        console.log('新增失败', error)
      }
    },

    // 查询数据
    async selectSql() {
      // 查询表 DB.selectTableData(表名,查询条件列名,查询条件列值)
      try {
        const res = await DB.selectTableData('contact')
        // console.log('新增或修改后的表数据', res)
      } catch (error) {
        console.log('查询失败', error)
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
        console.log('修改失败', error)
      }
    },

    /********************** sqlite 结束 *****************************/

    imageError(item, index) {
      this.$set(item, 'image', '/static/img/user.png')
    },

    // 建群/拉人选择联系人
    bindClick(item) {
      if (!item.inroom) {
        var checked = !item.checked
        this.$set(item, 'checked', checked)
      }
      if (this.conTab == 0) {
        this.allData.contact = this.contactsList
      } else {
        this.allData.device = this.contactsList
      }
      let select = []
      let contact = this.allData.contact
      let device = this.allData.device
      contact.map((item) => {
        item.list.map((key) => {
          // 群聊加人、单聊转群聊特殊处理
          if (this.pageType != 'add' && this.pageType != 'change') {
            if (key.checked) {
              select.push(key)
            }
          } else {
            if (key.checked && !key.inroom) {
              select.push(key)
            }
          }
        })
      })
      device.map((item) => {
        item.list.map((key) => {
          // 群聊加人、单聊转群聊特殊处理
          if (this.pageType != 'add' && this.pageType != 'change') {
            if (key.checked) {
              select.push(key)
            }
          } else {
            if (key.checked && !key.inroom) {
              select.push(key)
            }
          }
        })
      })
      if (this.pageType == '') {
        if (select.length > 1) {
          this.changeStyle = true
        } else {
          this.changeStyle = false
        }
      } else {
        if (select.length > 0) {
          this.changebtn = true
        } else {
          this.changebtn = false
        }
      }
      // console.log(select);
      this.selectarr = select
    },

    // 完成建群按钮
    confirmDialog(e) {
      if (e == 'creat') {
        if (this.selectarr.length > 1) {
          this.$refs.dialogInput.open()
        }
      } else {
        if (this.selectarr.length > 0) {
          this.$refs.dialogInput.open()
        }
      }
    },

    // 联系人拉群
    dialogInputConfirm(done, name) {
      if (name == '') {
        app.showToast('请填写群组名称')
      } else {
        app.showLoading()
        let member = []
        this.selectarr.forEach((item) => {
          member.push({
            detailid: item.id,
            type: item.type
          })
        })
        // 单聊转群聊特殊处理
        if (this.pageType == 'change') {
          this.members.forEach((item) => {
            member.unshift({
              detailid: item.userid,
              type: parseInt(item.chatType)
            })
          })
        }
        let data = {
          name: name,
          member: member
        }
        // 联系人拉群
        app.createGroup(data, (res) => {
          if (res.code == 0) {
            uni.showToast({
              title: '创建成功',
              mask: true,
              success() {
                // 更新联系人列表
                getApp().getContactList('update')
                setTimeout(() => {
                  app.hideLoading()
                  // 跳转群聊
                  uni.redirectTo({
                    url: `/pages/chat/room/chat?roomid=${res.data}&title=${name}&chattype=5&receiveid=${res.data}`
                  })
                }, 1000)
              }
            })
          } else {
            app.showToast(res.message)
          }
        })
      }
    },

    // 聊天室-可进群列表
    contact_add() {
      app.showLoading()
      let data = {
        roomid: this.room_id
      }
      app.addable_member(data, (res) => {
        if (res.code == 0) {
          let arr = []
          // console.log(res.data);
          let contact = res.data.contact
          let device = res.data.device
          contact.map((item) => {
            item.list.map((key) => {
              key.type = 1
              if (key.inroom) {
                key.checked = true
              } else {
                key.checked = false
              }
            })
          })
          device.map((item) => {
            item.list.map((key) => {
              key.type = 4
              if (key.inroom) {
                key.checked = true
              } else {
                key.checked = false
              }
            })
          })
          // console.log(res.data);
          this.allData = res.data
          this.contactsList = res.data.contact
          this.pageLoad = true
          setTimeout(() => {
            app.hideLoading()
          }, 50)
        } else {
          app.showToast(res.message)
        }
      })
    },

    // 聊天室--可删除列表
    contact_del() {
      app.showLoading()
      let data = {
        roomid: this.room_id
      }
      app.deletable_member(data, (res) => {
        if (res.code == 0) {
          // console.log(res.data);
          res.data.map((item) => {
            item.checked = false
          })
          this.delList = res.data
          this.pageLoad = true
          setTimeout(() => {
            app.hideLoading()
          }, 500)
        } else {
          app.showToast(res.message)
        }
      })
    },

    // 删人选择联系人
    delClick(item) {
      var checked = !item.checked
      this.$set(item, 'checked', checked)
      let select = []
      let list = this.delList
      if (list.length > 0) {
        list.map((item) => {
          if (item.checked) {
            select.push(item)
          }
        })
      }
      if (select.length > 0) {
        this.changebtn = true
      } else {
        this.changebtn = false
      }
      this.selectarr = select
    },

    // 聊天室--确认进群
    complete_btn() {
      if (this.selectarr.length > 0) {
        app.showLoading()
        let member = []
        this.selectarr.forEach((item) => {
          member.push({
            detailid: item.id,
            type: item.type
          })
        })
        let data = {
          roomid: this.room_id,
          member: member
        }
        // console.log(data);
        app.add_member(data, (res) => {
          if (res.code == 0) {
            uni.showToast({
              title: '添加成功',
              mask: true,
              success() {
                setTimeout(() => {
                  app.hideLoading()
                  uni.navigateBack({
                    delta: 1
                  })
                }, 1000)
              }
            })
          } else {
            app.showToast(res.message)
          }
        })
      }
    },

    delete_btn() {
      if (this.selectarr.length > 0) {
        this.$refs.deldialog.open()
      }
    },

    // 聊天室--确认删除
    deldialog(done, name) {
      app.showLoading()
      let member = []
      this.selectarr.forEach((item) => {
        member.push(item.userid)
      })
      let data = {
        roomid: this.room_id,
        member: member
      }
      app.delete_member(data, (res) => {
        if (res.code == 0) {
          uni.showToast({
            title: '删除成功',
            mask: true,
            success() {
              setTimeout(() => {
                app.hideLoading()
                uni.navigateBack({
                  delta: 1
                })
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
.body {
  position: relative;
  height: 100vh;
  background: #f6f7fb;

  .body_wrap {
    height: calc(100% - 120rpx);
  }

  // 切换tab
  .center-tab {
    position: relative;
    display: flex;
    background: #fefefe;
    box-shadow: inset 0px -2rpx 8rpx 0px rgba(220, 220, 220, 0.3);

    .tab-box {
      flex: 1;
      position: relative;

      .items {
        color: #b8b8b8;
        font-size: 32rpx;
        text-align: center;
        height: 128rpx;
        line-height: 128rpx;
      }

      .conCheck {
        color: #2f2f2e;

        &:after {
          content: '';
          position: absolute;
          width: 60rpx;
          height: 6rpx;
          left: 42.2%;
          bottom: 36rpx;
          background-color: #694be1;
        }
      }
    }
  }

  /* 联系人列表 */
  .contacts-list {
    background: #ffffff;

    &-letter {
      padding: 0 40rpx;
      height: 70rpx;
      line-height: 70rpx;
      font-size: 28rpx;
      color: #232323;
      font-weight: 400;
      box-sizing: border-box;
    }

    &-box {
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 40rpx;
      box-sizing: border-box;
      height: 120rpx;

      &-box {
        display: flex;
        align-items: center;

        .img {
          width: 90rpx;
          height: 90rpx;
          margin-right: 30rpx;
          border-radius: 100%;
        }

        .name {
          flex: 1;
          margin-right: 40rpx;
          height: 120rpx;
          line-height: 120rpx;
          color: #2f2f2e;
          font-size: 32rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
      }
    }

    &-name_last {
      border: none;
    }

    .bg-light {
      background: $but-click-bg;
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

  // 删人列表
  .del-list {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 40rpx;
    box-sizing: border-box;
    height: 120rpx;

    &-box {
      display: flex;
      align-items: center;

      .img {
        width: 90rpx;
        height: 90rpx;
        margin-right: 30rpx;
        border-radius: 100%;
      }

      .name {
        flex: 1;
        height: 120rpx;
        line-height: 120rpx;
        color: #2f2f2e;
        font-size: 32rpx;
      }
    }
  }

  // 右下角按钮
  .complete_wrap {
    position: fixed;
    bottom: 20rpx;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 0 40rpx;
    box-sizing: border-box;
    width: 100%;
    height: 88rpx;
    z-index: 99;

    .complete {
      color: #fff;
      width: 118rpx;
      height: 50rpx;
      line-height: 50rpx;
      text-align: center;
      background: #ef4b5b;
      border-radius: 8rpx;
      opacity: 0.4;
    }

    .complete1 {
      color: #fff;
      width: 118rpx;
      height: 50rpx;
      line-height: 50rpx;
      text-align: center;
      background: #ef4b5b;
      border-radius: 8rpx;
      opacity: 1;
    }

    .complete_del {
      color: #fff;
      width: 140rpx;
      height: 60rpx;
      line-height: 60rpx;
      text-align: center;
      background: #ef4b5b;
      border-radius: 8rpx;
      opacity: 0.4;
    }

    .complete_del1 {
      color: #fff;
      width: 140rpx;
      height: 60rpx;
      line-height: 60rpx;
      text-align: center;
      background: #ef4b5b;
      border-radius: 8rpx;
      opacity: 1;
    }
  }
}
</style>
