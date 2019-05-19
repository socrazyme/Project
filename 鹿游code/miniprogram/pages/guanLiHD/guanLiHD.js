const db = wx.cloud.database();
const app = getApp();
Page({
  data: {
    tuiChuOrNot: [],
    start: 1,
    allData: null,
    id: null,
    liuYan: '',
    canJiaOrNot: [],
    geRenData: null,
    tuiChu_onlyOne: 'true'
  },

  onLoad: function () {

    var that = this;
    /*db.collection('huoDong').where({
    
    }).get({
      success: function(res){
        that.setData({
          allData: res
        });

      }
    })*/
    wx.cloud.callFunction({
      name: 'addgeren',
      success: function (res) {
        that.setData({
          allData: res.result.reso
        });
      },
      fail: function (res) {
        console.log("fail");
      }
    });

    var timeId = setInterval(function(){
      wx.cloud.callFunction({
        name: 'addgeren',
        success: function (res) {
          that.setData({
            allData: res.result.reso
          });
        },
        fail: function (res) {
          console.log("fail");
        }
      });
    }, 2000);
    var that = this;
    if (this.data.tuiChu_onlyOne == 'true'){
      console.log("设置退出启动");
      var timer = setTimeout(function () {
      that.addtuiChu();
      }, 1500);
      that.setData({
        tuiChu_onlyOne: 'false'
      });
    }
  },

  onShow: function () {
    
  },

  button: function (event) {
    if (event.currentTarget.dataset.id != null){
      this.setData({
        id: event.currentTarget.dataset.id
      });
      return;
    }
    wx.cloud.callFunction({
      name: 'addgeren',
      success: function (res) {
        that.setData({
          allData: res.result.reso
        });
      },
      fail: function (res) {
        console.log("fail");
      }
    })
    var that = this;
    wx.showToast({
      title: '发送中',
      icon: 'loading',
      duration: 1000,
    });
    setTimeout(function () {
      console.log("setTimeStart");
      that.liuYan(event);
      that.setData({
        id: null,
        liuYan: null
      });
    }, 1500);
    
  },

  addtuiChu: function(){
    //关于退出和未退出的转变先设置全部为退出 只设置一次
      var tuiChuOrNot = [];
      for (var i = 0; i < this.data.allData.data.length; ++i) {
        tuiChuOrNot[i] = '退出'
      }
      this.setData({
        tuiChuOrNot: tuiChuOrNot,
      });
      console.log(this.data.tuiChuOrNot);
  },

  liuYan: function(event){
    
    var that = this;
    console.log(this.data.allData);
    var id = this.data.id;
    var data = this.data.allData;
    
    data.data[id].liuYan[data.data[id].liuYan.length] = {
      chengYuanTouXiang: app.globalData.userInfo.avatarUrl,
      chengYuanMingZi: app.globalData.userInfo.nickName,
      liuYan: event.detail.value.liuYan
    }
    this.setData({
      allData: data
    });

    wx.cloud.callFunction({
      name: 'liuYan',
      data: {
        idg: that.data.allData.data[id]._id,
        liuYan: that.data.allData.data[id].liuYan,
      },
      success: function (res) {
        console.log(res);
        console.log("成功");
      },
      fail: function (res) {
        console.log(res);
        console.log("失败");
      },
    });
    console.log("云函数结束");

    /*db.collection('huoDong').doc(that.data.allData.data[id]._id).update({
      data: {
        liuYan: that.data.allData.data[id].liuYan
      },
      success: function (res) {
        console.log(res);
      },
      fail: function (res) {
        console.log("fail");
      }
    });*/

  },

  viewTap: function () {
    var data = this.data.allData.data;
    var data_length = data.length;
    for (var i = 0; i < data_length; ++i) {
      for (var j = 0; j < data[i].chengYuan.length; ++j) {
        if (data[i].chengYuan[j].openid == app.globalData.openid) {
          var m_canJiaOrNot = this.data.canJiaOrNot;
          m_canJiaOrNot[i] = 0;
          
          this.setData({
            canJiaOrNot: m_canJiaOrNot
          });
        }
        else {
          var m_canJiaOrNot = this.data.canJiaOrNot;
          m_canJiaOrNot[i] = 0;
          this.setData({
            canJiaOrNot: m_canJiaOrNot
          });
        }
      }
    }
    console.log(this.data.canJiaOrNot);
  },


  viewTap: function () {
    var data = this.data.allData.data;
    var data_length = data.length;
    for (var i = 0; i < data_length; ++i) {
      for (var j = 0; j < data[i].chengYuan.length; ++j) {
        if (data[i].chengYuan[j].openid == app.globalData.openid) {
          var m_canJiaOrNot = this.data.canJiaOrNot;
          m_canJiaOrNot[i] = 1;
          this.setData({
            canJiaOrNot: m_canJiaOrNot
          });
        }
        else {
          var m_canJiaOrNot = this.data.canJiaOrNot;
          m_canJiaOrNot[i] = 0;
          this.setData({
            canJiaOrNot: m_canJiaOrNot
          });
        }
      }
    }
    console.log(this.data.canJiaOrNot);
  },

  huoQu_navi: function(){
    console.log(this.data.geRenData);
    let geRenData=JSON.stringify(this.data.geRenData);
    console.log(geRenData);
    wx.navigateTo({
      url: '../geRenXinXi/geRenXinXi?jsongeRenXinXi='+geRenData,
      success: function (res) {
        console.log("跳转成功");
    },
      fail: function (res) {
        console.log("跳转失败");
      }
    });
  },

  duiYouXinXi: function(event){
    var id = event.currentTarget.dataset.id;
    var chengYuanId = [];
    for (var i = 0; i < this.data.allData.data[id].chengYuan.length; ++i){
      chengYuanId[i] = this.data.allData.data[id].chengYuan[i].openid;
    }
    var that = this;
    wx.cloud.callFunction({
      name: 'findgeren',
      data: {
        chengYuanId: chengYuanId
      },
      success: function (res) {
        that.setData({
          geRenData: res.result.reso.data
        })
        
      },
      fail: function (res) {
        console.log("fail");
      }
    });
    var that = this;
    var timeId = setTimeout(function(){
      that.huoQu_navi();
    }, 1500);
  },

  tuiChu: function(event){
    var id = event.currentTarget.dataset.id;
    var that = this;
    var tuiChuOrNot = this.data.tuiChuOrNot;
    tuiChuOrNot[id] = '已退';
    this.setData({
      tuiChuOrNot: tuiChuOrNot
    });
    if (app.globalData.openid == this.data.allData.data[id]._openid){
      db.collection('huoDong').doc(that.data.allData.data[id]._id).remove({
        success: function(res){
          console.log("删除成功");
        },
        fail: function(){
          console.log("删除失败");
        }
      });
    }
    else {
      wx.cloud.callFunction({
        name: 'shanchu',
        data: {
          idg: that.data.allData.data[id]._id
        },
        success: function(res){
           console.log(res);
          console.log("成员删除成功");
        },
        fail: function(res){
          console.log(res);
          console.log("成员删除失败");
        }
      });
    }
    wx.showToast({
      title: '退出成功',
      icon: 'success',
      duration: 1500,
    })
  }
  
})