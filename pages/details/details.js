// 详情页
// solved 返回主页按钮，判断back是否成功来跳转 星星显示不对 
var app = getApp()
Page({
  // 分享
  onShareAppMessage: function (e) {
    var that = this
    return {
      // title: that.data.card.n,
      title: '我们去这里吃：' + that.data.card.n,
      path: '/pages/details/details?' + that.contructQueryString(),
      success: function (res) {
        console.log('/pages/details/details?' + that.contructQueryString())
      }
    }
  },
  data: {
    card: {}
  },
  // 返回主页
  backHome: function () {
    if (getCurrentPages().length > 1) {
      wx.navigateBack({
        delta: 1
      })
    }
    else {
      wx.redirectTo({
        url: '../index/index'
      })
    }
  },
  // 点击电话拨打
  makeCall: function (event) {
    console.log(event)
    var telNum = event.target.dataset.tel
    wx.makePhoneCall({
      phoneNumber: telNum
    })
  },
  // Remove result
  deleteItem: function (event) {
    var that = this
    wx.showModal({
      title: '屏蔽该餐厅',
      content: '一个星期内不再出现在结果中',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: getApp().globalData.serverHost + 'remove.php',
            header: {
              'Biscuit': wx.getStorageSync('Biscuit'),
              'content-type': 'application/json'
            },
            data: {
              id: that.data.card.pid,
              name: that.data.card.n
            },
            method: 'POST',
            success: function(res) {
              that.backHome()
            },
            fail: function(res) { }
          })
        } else if (res.cancel) {
          console.log('cancel')
        }
      }
    })
  },
  // 点击地址导航
  getLoc: function (event) {
    console.log('getLoc')
    var lat = event.target.dataset.lat
    var lon = event.target.dataset.lon
    var name = event.target.dataset.name
    console.log(name)
    wx.openLocation({
      latitude: parseFloat(lat),
      longitude: parseFloat(lon),
      name: name,
      scale: 18
    })
  },
  onLoad: function (e) {
    var that = this
    // url解码转json
    var card = JSON.parse(decodeURI(JSON.stringify(e)))
    console.log(card)
    that.setData({
      card: card
    })
  },
  // 根据内容，构造url参数
  contructQueryString: function() {
    var queryStr = ''
    var options = getCurrentPages()[getCurrentPages().length - 1].options
    for (var i in options) {
      queryStr += i + '=' + options[i] + '&'
    }
    return encodeURI(queryStr)
  }
})
