// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();


// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  var res_m = null;
  await db.collection('geRenXinXi').where({
    _openid: wxContext.OPENID
  }).get().then(res => {
    res_m = res
  });
  return {
    reso: res_m
  }
}