// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();


// 云函数入口函数
exports.main = async (event, context) => {
  var chengYuanId = event.chengYuanId;
  //const wxContext = cloud.getWXContext();
  var returnl = {
    data: []
  };
  var res_m = null;
  await db.collection('geRenXinXi').where({
  }).get().then(res => {
    res_m = res
  });

  var res_ml = null; 
  await db.collection('geRenXinXi').where({
    xingBie: '',
    qQ: '',
    daXue: '',
    nianJi: '',
    zhuanYe: '',
    jieShao: '',
    idg: '',
  }).get().then(res => {
    res_ml = res
  });//如果有属性全为零的则查询一次表里面是否有相同的，有的话就删掉他



  var index = 0;
  var xuShanChu = [];
  var xuShanChu_index = 0;
  for (var i = 0; i < res_m.data.length; ++i) {
    for (var j = 0; j < chengYuanId.length; ++j) {
      if (res_m.data[i]._openid == chengYuanId[j]) {
        returnl.data[index++] = res_m.data[i];
        break;
      }
    }
    var queRenShanChu = true;
    for (var k = 0; k < res_ml.data.length; ++k){
      if (res_ml.data[k]._openid == )
    }
  }

  return {
    reso: returnl
  }
}