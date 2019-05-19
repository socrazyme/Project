// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();


// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  var res_m = null;
  await db.collection('huoDong').doc(event.idg).get().then(res => {
    res_m = res
  });
  var index = 0;
  var chengYuan = [];
  for (var j = 0; j < res_m.data.chengYuan.length; ++j) {
    if (res_m.data.chengYuan[j].openid != wxContext.OPENID) {
      chengYuan[index++] = res_m.data.chengYuan[j];
    }
  }
  await db.collection('huoDong').doc(event.idg).update({
    data: {
      chengYuan: chengYuan
    }
  });

  await db.collection('huoDong').doc(event.idg).get().then(res => {
    res_m = res
  });

  return {
    reso: res_m
  }
}