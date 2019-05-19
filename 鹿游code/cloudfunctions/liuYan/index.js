// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  var id = event.idg;
  var liuYan = event.liuYan;
  await db.collection('huoDong').doc(id).update({
    data: {
      liuYan: liuYan
    }
  });

  var res_m = null;
  await db.collection('huoDong').doc(event.idg).get().then(res => {
    res_m = res
  });


  return {
    reso: res_m
  }
}