//index.js
// solved 定位信息放缓存里
var app = getApp()
Page({
    data: {
        userinfo: {},
        loading: 'hide',
        footer: 1,
        isClicked: 0 
    },
    // 点击米饭
    startSearch: function() {
      var that = this
      if (that.data.isClicked == 1) // 防止重复点击
        return 
      that.displayDot(1)
      var now = Date.parse(new Date())/1000
      wx.getStorage({
        key: 'locCache',
        success: function(res) {
          var resfun = this
          if (res.data.time + 300 < now || res.data.time === undefined){ // 有缓存，过期了
            that.setLoc()
          }
          else {
            that.requestForLunch(res.data.latitude, res.data.longitude)
          }
        },
        fail: function () { // 没缓存
          that.setLoc()
        }
      })
    },
    // 点击底部信息
    egg: function (e) {
      if (this.data.footer == 1)
        this.setData({ footer: 0 })
      else
        this.setData({ footer: 1 })
    },
    // 请求服务器
    requestForLunch: function (latitude, longitude) {
      var that = this
      wx.request({
        url: getApp().globalData.serverHost + 'index.php',
        header: {
          'Biscuit': wx.getStorageSync('Biscuit'),
          'content-type': 'application/json'
        },
        data: {
          latitude: latitude,
          longitude: longitude
        },
        method: 'POST',
        success: function (res) {
          // console.log(res)
          if (res.data.status == 'success') {
            setTimeout(function () { // 有缓存，没过期
              wx.navigateTo({
                url: '../details/details?' + res.data.data
              })
              that.displayDot(0)
            }, 500)
          } else {
            that.displayDot(0)
            wx.showModal({
              title: '提示',
              content: res.data.status,
              showCancel: false
            })
          }
        },
        fail: function (res) { 
          wx.showModal({
            title: '提示',
            content: 'X^X 服务器无响应',
            showCancel: false
          })
          that.displayDot(0) 
        }
      })
    },
    // 显示米饭
    displayDot: function(action) {
      var that = this
      if (action == 1) {
        that.setData({ loading: 'show', isClicked: 1 })
      }
      else{
        that.setData({ loading: 'hide', isClicked: 0 })
      }
    },
    // 请求定位，写入缓存，
    setLoc: function() {
      var that = this
      var now = Date.parse(new Date()) / 1000
      wx.getLocation({
        type: 'gcj02',
        success: function (res) {
          var latitude = res.latitude
          var longitude = res.longitude
          wx.setStorage({
            key: 'locCache',
            data: { latitude: latitude, longitude: longitude, time: now }
          }),
          that.requestForLunch(latitude, longitude)
        },
        fail: function () {
          wx.showModal({
            title: '提示',
            content: '需要开启位置权限才能使用',
            showCancel: false,
            success: function (res) {
              wx.openSetting({})
            }
          })
          that.displayDot(0)
        }
      })
    }
})