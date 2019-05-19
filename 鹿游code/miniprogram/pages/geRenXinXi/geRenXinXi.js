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
    geRenData: [],
  },

  onLoad: function (options) {
    var that = this;
    var timeId = setTimeout(function(){
      let object = JSON.parse(options.jsongeRenXinXi);
      that.setData({
        geRenData: object,
      });
      console.log(that.data.geRenData);
    }, 1000);
  },

  formInformation(event) {
    if (this.data.id == '') {
      db.collection('geRenXinXi').add({
        data: {
          xingBie: event.detail.value.xingBie,
          qQ: event.detail.value.qQ,
          daXue: event.detail.value.daXue,
          nianJi: event.detail.value.nianJi,
          zhuanYe: event.detail.value.zhuanYe,
          jieShao: event.detail.value.jieShao
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
    else {

      var that = this;
      db.collection('geRenXinXi').doc(that.data.id).update({
        data: {
          xingBie: event.detail.value.xingBie,
          qQ: event.detail.value.qQ,
          daXue: event.detail.value.daXue,
          nianJi: event.detail.value.nianJi,
          zhuanYe: event.detail.value.zhuanYe,
          jieShao: event.detail.value.jieShao
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

  }
})