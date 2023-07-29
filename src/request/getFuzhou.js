const axios = require("axios");
const cheerio = require("cheerio");

const { regionMap } = require("../const/index");
const { logger } = require("../mod_fuzhou/util");

// 获取各个地级市楼盘信息
function getRealEstateInfo(id = 361001) {
  let temp = regionMap.find((item) => {
    return (item.code = id);
  });
  if (!temp) {
    logger.warn("未识别的ID", id);
  }
  logger.info(`正在获取${temp.name}--${id}数据 `);

  return axios
    .get(`http://www.jxfzfdc.cn/xqxxListByCode?page=1&limit=10000&code=${id}`)
    .then(function (response) {
      // 处理成功情况

      let { data } = response;
      logger.info(`获取${temp.name}--${id}数据成功`, data);

      return data;
    })
    .catch(function (error) {
      // 处理错误情况
      logger.error(`获取${temp.name}--${id}数据失败`, error);
      return null;
    });
}

// 楼盘信息中每一栋的链接
function getHouseUrlInfo(options) {
  let url = `http://www.jxfzfdc.cn/roomDetail?view=statisticsTable&col=announce&xmxxXmbh=&xmxxId=${options.id}`;
  let base = "http://www.jxfzfdc.cn";

  logger.info(`正在获取 ${options.xmxxxmmc} 楼盘信息...`);

  return axios
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
      logger.info(`${options.xmxxxmmc} 获取成功`);
      return result;
    })
    .catch(function (error) {
      logger.error(`${options.xmxxxmmc} 楼盘信息 获取失败`, error);
      return null;
    });
}

// 查询房间定价
function getRoomInfo(options) {
  return axios
    .get(options.href)
    .then(function (response) {
      let result = [];
      let { data } = response;

      let arr = data.match(/(var roomFh = '(.+?)';[\s\S]+?var szc = (.+?);)/g);

      arr.forEach((str) => {
        const regex = /var\s+(\w+)\s+=\s+([\d\.]+|'[\w\d-]+')/g;
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
      logger.error(`${options.href} 查询房间定价 获取失败`, error);
      return null;
    });
}

// 批量获取每个栋楼房间信息，count单次获取栋数
async function getBatchRoomInfo(options, count = 10) {
  let urls = await getHouseUrlInfo(options);
  for (const urlitem of urls) {
    let data = await getRoomInfo(urlitem);
    result[urlitem.text] = data;
  }
}
module.exports = {
  getRealEstateInfo,
  getHouseUrlInfo,
  getRoomInfo,
};
