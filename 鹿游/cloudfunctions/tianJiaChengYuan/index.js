// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  var id = event.idg;
  var lchengYuan = event.chengYuan;
  await db.collection('huoDong').doc(id).update({
    data: {
      chengYuan: lchengYuan
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