// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();


// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  var returnl = {
    data: []
  };
  var res_m = null;
  await db.collection('huoDong').where({
  }).get().then(res => {
    res_m = res
  });
  var index = 0;
  for (var i = 0; i < res_m.data.length; ++i){
    for (var j = 0; j < res_m.data[i].chengYuan.length; ++j){
      if (res_m.data[i].chengYuan[j].openid == wxContext.OPENID){
        returnl.data[index++] = res_m.data[i];
        break;
      }
    }
  }


  return {
    reso: returnl
  }
}