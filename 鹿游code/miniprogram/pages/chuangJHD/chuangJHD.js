const db = wx.cloud.database()
const app = getApp()
wx.cloud.init()

Page({
  data: {
    mingCheng: '',
    kaiShi: '',
    jieShu: '',
    diDian: '',
    yaoQiu: '',
    gaiKuang: '',
    liuYan: '',
    renShu: '',
    canOrNot: true,
    event: null
  },

  faSongXiaoXi: function(){
    console.log("发送开始");
    console.log(this.data.canOrNot);
    if (this.data.canOrNot == false) {
      wx.showToast({
        title: '您已经发布超过三个活动，请删除后再发布',
        icon: 'none',
        duration: 1500,
      });
      return;
    }
    var chengYuan = [{
      openid: app.globalData.openid,
      chengYuanTouXiang: app.globalData.userInfo.avatarUrl,
      chengYuanMingZi: app.globalData.userInfo.nickName
    }];
    console.log(chengYuan);
    var value = this.data.event.detail.value;
    var renShu = parseInt(value.renShu);
    if (isNaN(renShu) || renShu > 12){
      wx.showToast({
        title: '请输入正确的人数',
        icon: 'none',
        duration: 1000,
      });
      return;
    }
    for (var i = 1; i < (12 - renShu + 1); ++i){
      chengYuan[i] = {};
    }
    console.log(chengYuan);
    db.collection('huoDong').add({
      data: {
        mingCheng: value.mingCheng,
        faQiRenTouXiang: app.globalData.userInfo.avatarUrl,
        faQiRen: app.globalData.userInfo.nickName,
        kaiShi: value.kaiShi,
        jieShu: value.jieShu,
        yaoQiu: value.yaoQiu,
        diDian: value.diDian,
        gaiKuang: value.gaiKuang,
        chengYuan: chengYuan,
        liuYan: [],
      },
      success: function (res) {
        wx.showToast({
          title: '发布成功',
          icon: 'success',
          duration: 1500,
        });

      },
      fail: function (res) {
        console.log("biao_dan_chuan_song_fail");
      }
    })
    this.setData({
      mingCheng: '',
      kaiShi: '',
      jieShu: '',
      diDian: '',
      yaoQiu: '',
      gaiKuang: '',
      renShu: '',
    })
  },

  formInformation(event){
    var value = event.detail.value;
   if (value.mingCheng == '' || value.kaiShi == '' || value.jieShu == '' || value.yaoQiu == '' || value.diDian == '' || value.gaiKuang == ''){
      wx.showToast({
        title: '请将信息填写完整',
        icon: 'none',
        duration: 1500,
      })
      return;
    }
    var that = this;
    wx.cloud.callFunction({
      name: 'dingyiHDshuliang',
      success: function(res){
        console.log("收到暗示");
        console.log(res);
        that.setData({
          canOrNot: res.result.canOrNot
        });
      },
      fail:function(res){
        console.log("没有收到暗示");
        console.log(res);
        
      }
    });
    wx.showToast({
      title: '发布中',
      icon: 'loading',
      duration: 1500,
    })
    var that = this;
    this.setData({
      event: event
    });
    var timeId = setTimeout(function(){
      that.faSongXiaoXi();     
    }, 2000);
  }
})