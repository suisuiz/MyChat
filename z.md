<!--
 * @Descripttion:
 * @Author: SUI
 * @Date: 2021-08-12 17:48:11
 * @LastEditors: SUI
 * @LastEditTime: 2021-08-25 15:31:08
 * @FilePath: \book\z.md
-->

```javascript
// 获取上一页数据
let pages = getCurrentPages()
let page = pages[pages.length - 2]
// 修改数据
page.$vm.xxx = `${xxx} `

// 获取元素的属性  类名 input-box
uni
  .createSelectorQuery()
  .select('.input-box')
  .boundingClientRect((data) => {
    // data - 各种参数
    console.log(data) // 获取元素属性
    console.log(data.height) // 获取元素宽度
  })
  .exec()

// 获取页面的属性
uni.getSystemInfo({
  success(res) {
    // 获取页面高度
    console.log(res.windowHeight)
  }
})

// 提示框跳转
uni.showToast({
  title: 'xxxx',
  mask: true,
  success() {
    setTimeout(() => {
      uni.navigateBack({
        delta: 1
      })
    }, 1000)
  }
})

// 关闭当前页面跳转
uni.redirectTo({
  url: `/pages/xxxx/xxxx`
})

// 正常跳转页面
uni.navigateTo({
  url: `/pages/xxxx/xxxx`
})

// 返回上一页
uni.navigateBack({
  delta: 1
})


uni-app 使用的ui建议使用
u-view
https://www.uviewui.com/
```
