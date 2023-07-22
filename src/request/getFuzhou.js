const axios = require("axios");

const { regionMap } = require("../const/index");

// 获取各个地级市楼盘信息
function getRealEstateInfo(id = 361001) {
  let temp = regionMap.find((item) => {
    return (item.code = id);
  });
  if (!temp) {
    console.log("未识别的ID", id);
  }
  console.log(`正在获取${temp.name}--${id}数据 `);

  return axios
    .get(`http://www.jxfzfdc.cn/xqxxListByCode?page=1&limit=10000&code=${id}`)
    .then(function (response) {
      // 处理成功情况

      let { data } = response;
      console.log(`获取${temp.name}--${id}数据成功`, data);

      return data;
    })
    .catch(function (error) {
      // 处理错误情况
      console.error(`获取${temp.name}--${id}数据失败`, error);
      return null;
    });
}

module.exports = {
  getRealEstateInfo,
};
