//app.js
App({
  onLaunch: function() {
    var that = this
    // 调用微信登录接口
    wx.getStorage({
      key: 'Biscuit',
      success: function (res) {
        console.log('has_cookie')
      },
      fail: function(res) {
        wx.login({
          success: function (res) {
            if (res.code) {
              // 请求登录
              wx.request({
                url: getApp().globalData.serverHost + 'onLogin.php',
                method: 'POST',
                data: { code: res.code },
                success: function (res) {
                  console.log(res.data)
                  wx.setStorage({
                    key: "Biscuit",
                    data: res.data
                  })
                }
              })
            } else {
              console.log('获取用户登录态失败！' + res.errMsg)
            }
          }
        });
      }
    })
  },
  globalData: {
    userInfo: null,
    card: null,
    // serverHost: 'http://localhost/applet/controller/'
    serverHost: 'https://alunch.uta0.cn/'
  }
})
