const fs = require("fs");
const path = require("path");

const {
  getRealEstateInfo,
  getHouseUrlInfo,
  getRoomInfo,
} = require("../request/getFuzhou");
const { regionMap } = require("../const/index");
const { getReginByCode } = require("./util");
const { logger } = require("./util");

// 扒取各个区的楼盘数据 保存json文件
function _creteaRealEstate() {
  let result = [];
  regionMap.forEach(async (item, index, arr) => {
    let { msg: { list = [], totalRow = 0 } = {} } = await getRealEstateInfo(
      item.code
    );
    item.totalRow = totalRow;
    fs.writeFileSync(
      path.resolve(`./data/fuzhou`, `${item.name}.json`),
      JSON.stringify({ list, totalRow }, null, "\t")
    );
    logger.info(item);
    result.push(item);

    if (index === arr.length - 1) {
      logger.info(result);
      fs.writeFileSync(
        path.resolve(`./data/fuzhou`, `total.json`),
        JSON.stringify(result, null, "\t")
      );
    }
  });
}

// _creteaRealEstate();

async function formateInfo() {
  let { list = [] } = require("../../data/fuzhou/高新区.json");

  for (const item of list) {
    let result = {};
    let { name = "" } = getReginByCode(item.id?.split("_")[0]) || {};

    if (
      fs.existsSync(
        path.resolve(`./data/fuzhou_house`, `${name}_${item.xmxxxmmc}.json`)
      )
    ) {
      logger.warn(`${name}_${item.xmxxxmmc}  已存在，跳过`);
      continue;
    }

    logger.info(`当前进度 ${list.indexOf(item) + 1} / ${list.length}`);
    logger.info(`正在获取 ${name}_${item.xmxxxmmc} ...`);

    let urls = await getHouseUrlInfo(item);
    for (const urlitem of urls) {
      let data = await getRoomInfo(urlitem);
      result[urlitem.text] = data;
    }

    logger.info(`获取 ${name}_${item.xmxxxmmc} 成功，写入中...`);

    fs.writeFileSync(
      path.resolve(`./data/fuzhou_house`, `${name}_${item.xmxxxmmc}.json`),
      JSON.stringify(result, null, "\t")
    );

    logger.info(`写入 ${name}_${item.xmxxxmmc} 成功`);
  }
}

formateInfo();
