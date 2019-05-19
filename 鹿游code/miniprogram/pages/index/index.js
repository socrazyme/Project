//index.js
const app = getApp()
const db = wx.cloud.database();

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    xingBie: '',
    daXue: '',
    nianJi: '',
    zhuanYe: '',
    qQ: '',
    geRenJieShao: '',
    idg: ''
  },

  onLoad: function () {
    
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })

      return
    }


    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              app.globalData.userInfo = res.userInfo;
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo,
                huaMing: res.userInfo.nickName
              })
            }
          })
        }
      }
    });

    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
      },
    });

  },

  guanLiHD: function () {
    wx.navigateTo({
      url: '../guanLiHD/guanLiHD',
    });
  },

  onGetUserInfo: function (e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
    console.log(this.data.avatarUrl);
  },

  onGetOpenid: function () {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },



  onShow: function () {
    var that = this;
    wx.cloud.callFunction({
      name: 'addxinxi',
      success: function (res) {
        console.log(res.result.reso);
        that.setData({
          xingBie: res.result.reso.data[0].xingBie,
          qQ: res.result.reso.data[0].qQ,
          daXue: res.result.reso.data[0].daXue,
          nianJi: res.result.reso.data[0].nianJi,
          zhuanYe: res.result.reso.data[0].zhuanYe,
          geRenJieShao: res.result.reso.data[0].jieShao,
          idg: res.result.reso.data[0]._id,
        });
      },
      fail: function (res) {
        console.log("fail");
      }
    });
    var that = this;
    var timeId = setTimeout(function(){
      //用于第一次时发出个人的一些信息个给数据库
      if (that.data.idg == '') {
        db.collection('geRenXinXi').add({
          data: {
            xingBie: '',
            qQ: '',
            daXue: '',
            nianJi: '',
            zhuanYe: '',
            jieShao: '',
            touXiang: app.globalData.userInfo.avatarUrl,
            mingZi: app.globalData.userInfo.nickName,
          },
          success: function (res) {
          },
          fail: function (res){
          }
        });
      }
    }, 1500);
  },


  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]

        // 上传图片
        const cloudPath = 'fengJing-shu' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath

            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

  bianJiXinXi: function () {
    wx.navigateTo({
      url: '../bianJiShuXing/bianJiShuXing'
    });
  }


})
