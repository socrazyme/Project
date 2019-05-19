const db = wx.cloud.database();
const app = getApp();
Page({
  data: {
    start: 1,
    allData: null,
    weiCanJia: '点击参加',
    yiCanJia: '已参加',
    canJiaOrNot: [],
    viewTap_one: 'false',
    zhongzhiOrNOt: 'false'
  },

  

  onLoad: function () {
    console.log("onLoad 启动");
    var that = this;
    /*db.collection('huoDong').where({
    
    }).get({
      success: function(res){
        that.setData({
          allData: res
        });

      }
    })*/
    var m_canJia = [];
    for (var i = 0; i < 1000; ++i) {
      m_canJia[i] = '点击参加';
    }
    console.log(m_canJia);
    this.setData({
      canJiaOrNot: m_canJia
    });
   

    wx.cloud.callFunction({
      name: 'addInfo',
      success: function (res) {
        that.setData({
          allData: res.result.reso
        });
      },
      fail: function (res) {
        console.log("fail");
      }
    })
   
    var timer = setInterval(function(){
      that.setData({
        viewTap_one: 'true'
      });
      that.viewTap();
    }, 100);
    setTimeout(function(){
      var that = this;
      console.log("定时器启动");
    }, 1500);
  },

  onShow: function() {
    this.onLoad();
    console.log("显示调用");
    console.log("onshow启动");
    var that = this;
    /*db.collection('huoDong').where({
    
    }).get({
      success: function(res){
        that.setData({
          allData: res
        });

      }
    })*/
    var m_canJiaOrNot = [];
    
    console.log(this.data.canJiaOrNot);

    wx.cloud.callFunction({
      name: 'addInfo',
      success: function (res) {
        that.setData({
          allData: res.result.reso
        });
      },
      fail: function (res) {
        console.log("fail");
      }
    });

    //改为data里的变量，否则会提示不存在var zhongzhiOrNOt = 'false';//检测是否重置全部为“点击参加”

    var that = this;
    var timer = setInterval(function () {
      if (that.data.zhongzhiOrNot == 'false'){
        var m_canJiaOrNot = [];
        for (var i = 0; i < 1000; ++i) {
          m_canJiaOrNot[i] = '点击参加';
        }
        that.setData({
          canJiaOrNot: m_canJiaOrNot
        });
        var shiFou = true;
        m_canJiaOrNot = that.data.canJiaOrNot;
        for (var j = 0; j < m_canJiaOrNot.length; ++j){
          if (m_canJiaOrNot[j] != '点击参加'){
            shiFou = false;
          }
        }
        if (shiFou == true){
          that.setData({
            zhongzhiOrNot: 'true'
          });
          
        }
      }
      if (that.data.zhongzhiOrNot == 'true'){
        that.setData({
          viewTap_one: 'true'//这个是多余的 请不要介意他
        });
      that.viewTap();}
    }, 100);
    setTimeout(function () {
      clearInterval(timer);
    }, 1700);
  },

  button: function (event) {
    //this.viewTap();
    console.log("按钮触发");
    var id = event.currentTarget.dataset.id;
    if (this.data.canJiaOrNot[id] == '已参加'){
      wx.showToast({
        title: '您已参加此活动',
        icon: 'none',
        duration: 1000
      });
      return;
    }
   
    
    var that = this;
    if (this.data.canJiaOrNot[id] == '活动已满员') {
      wx.showToast({
        title: '此活动已满员',
        icon: 'none',
        duration: 1000
      });
      return;
    }
    wx.showToast({
      title: '您加入了此活动',
      icon: 'none',
      duration: 1000
    });
    var data = this.data.allData;
    data.data[id].chengYuan[data.data[id].chengYuan.length] = {
      openid: app.globalData.openid,
      chengYuanTouXiang: app.globalData.userInfo.avatarUrl,
      chengYuanMingZi: app.globalData.userInfo.nickName,
    }
    this.setData({
      allData: data
    });
    console.log(data.data[id].chengYuan);

    wx.cloud.callFunction({
      name: 'addInfo',
      success: function (res) {
        that.setData({
          allData: res.result.reso
        });
      },
      fail: function (res) {
        console.log("fail");
      }
    });

    var that = this;
    this.setData({
      viewTap_one: 'true'
    }); 
    this.viewTap();
    console.log("云函数调用");
    console.log(that.data.allData.data[id].chengYuan);
    wx.cloud.callFunction({
      name: 'tianJiaChengYuan',
      data: {
        idg: that.data.allData.data[id]._id,
        chengYuan: that.data.allData.data[id].chengYuan,
      },
      success: function(res){
        console.log(res);
        console.log("成功");
      },
      fail: function(res){
        console.log(res);
        console.log("失败");
      }
    });
    console.log("云函数结束");
    
  },

  guanLiHD: function(){
    wx.navigateTo({
      url: '../guanLiHD/guanLiHD',
    });
  },

  viewTap: function () {
    if (this.data.viewTap_one == 'true')
    {
    var data = this.data.allData.data;
    var data_length = data.length;
    for (var i = 0; i < data_length; ++i) {
      var m_canJiaOrNot = this.data.canJiaOrNot;
      if (this.data.canJiaOrNot[i] == '已参加'){
        continue;
      }
      for (var j = 0; j < data[i].chengYuan.length; ++j) {
        if (data[i].chengYuan[j].openid == app.globalData.openid) {
          m_canJiaOrNot[i] = "已参加";
          break;
        }
        else{
          m_canJiaOrNot[i] = '点击参加';
        }
      }
      if (data[i].chengYuan.length == 12 && m_canJiaOrNot[i] != '已参加') {
        m_canJiaOrNot[i] = '活动已满员';
      }
      this.setData({
        canJiaOrNot: m_canJiaOrNot,
        viewTap_one: 'false'
      });
      }
      
    }
    
  },

  onPullDownRefresh() {
    this.onLoad();
    wx.stopPullDownRefresh();
  },
})//版权所有 小鹿