const db = wx.cloud.database()
const app = getApp()
Page({
  data: {
    xingBie: '',
    qQ: '',
    daXue: '',
    nianJi: '',
    zhuanYe: '',
    jieShao: '',
    idg: '',
  },

  onLoad: function(){
    var that = this;
    var intervalId = setInterval(function(){
      that.loadinformation();
    }, 100);
    var timeId = setTimeout(function(){
      clearInterval(intervalId);
    }, 1500)
  },

  loadinformation: function(){
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
          jieShao: res.result.reso.data[0].jieShao,
          idg: res.result.reso.data[0]._id,
        });
      },
      fail: function (res) {
        console.log("fail");
      }
    });
  },

  formInformation(event) {
    var value = event.detail.value;
    if (value.xingBie != '男' && value.xingBie != '女'){
      wx.showToast({
        title: '请填写正确的性别',
        icon: 'none',
        duration: 1000,
      });
      return;
    }
    var qQQ = parseInt(value.qQ);
    if (value.qQ.length <= 5 || isNaN(qQQ)) {
      wx.showToast({
        title: '请填写正确的QQ',
        icon: 'none',
        duration: 1000,
      });
      return;
    }
    if (value.nianJi == '' || value.zhuanYe == '') {
      wx.showToast({
        title: '请将信息填写完整',
        icon: 'none',
        duration: 1000,
      });
      return;
    }
    
    if (value.jieShao == ''){
      wx.showToast({
        title: '填一点个人介绍能让别人多了解你哦',
        icon: 'none',
        duration: 1000,
      });
      return;
    }
    if(this.data.idg == ''){
      db.collection('geRenXinXi').add({
        data: {
          xingBie: event.detail.value.xingBie,
          qQ: event.detail.value.qQ,
          daXue: event.detail.value.daXue,
          nianJi: event.detail.value.nianJi,
          zhuanYe: event.detail.value.zhuanYe,
          jieShao: event.detail.value.jieShao,
          touXiang: app.globalData.userInfo.avatarUrl,
          mingZi: app.globalData.userInfo.nickName,
        },
        success: function (res) {
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 1500,
         });

        },
        fail: function (res) {
          wx.showToast({
            title: '修改失败',
            icon: 'none',
            duration: 1500,
          });
        }
      });
    }
    else{
      
      var that = this;
      db.collection('geRenXinXi').doc(that.data.id).update({
        data: {
          xingBie: event.detail.value.xingBie,
          qQ: event.detail.value.qQ,
          daXue: event.detail.value.daXue,
          nianJi: event.detail.value.nianJi,
          zhuanYe: event.detail.value.zhuanYe,
          jieShao: event.detail.value.jieShao,
          mingZi: app.globalData.userInfo.nickName,
        },
        success: function(res){
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 1500,
          });
        },
        fail: function(res){
          wx.showToast({
            title: '修改失败',
            icon: 'none',
            duration: 1500,
          });
        }
      });
    }

  }
})