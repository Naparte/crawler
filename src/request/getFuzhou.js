const axios = require("axios");
const cheerio = require("cheerio");

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

// 楼盘信息
async function getHouseUrlInfo(options) {
  let url = `http://www.jxfzfdc.cn/roomDetail?view=statisticsTable&col=announce&xmxxXmbh=&xmxxId=${options.id}`;
  let base = "http://www.jxfzfdc.cn";
  return await axios
    .get(url)
    .then(function (response) {
      let result = [];
      let { data } = response;
      const $ = cheerio.load(data);

      $(".static_roomNav a").each((index, item) => {
        result.push({
          text: $(item).text(),
          href: base + item.attribs.href,
        });
      });
      console.log(result);
      return result;
    })
    .catch(function (error) {
      console.error(`${url} 楼盘信息 获取失败`, error);
      return null;
    });
}

// 查询房间定价
async function getRoomInfo(options) {
  return await axios
    .get(options.href)
    .then(function (response) {
      let result = [];
      let { data } = response;
      debugger;
      console.log(result);

      let arr = data.match(/(var roomFh = '(.+?)';[\s\S]+?var szc = (.+?);)/g);

      arr.forEach((str) => {
        const regex = /var\s+(\w+)\s+=\s+([\d\.]+|'\w+'|\w+\+"")/g;
        let temp;
        const obj = {};
        while ((temp = regex.exec(str)) !== null) {
          obj[temp[1]] = temp[2];
        }
        result.push(obj);
      });
      return result;
    })
    .catch(function (error) {
      console.error(`${options.href} 查询房间定价 获取失败`, error);
      return null;
    });
}

module.exports = {
  getRealEstateInfo,
  getHouseUrlInfo,
  getRoomInfo,
};
