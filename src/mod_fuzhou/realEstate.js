const fs = require("fs");
const path = require("path");
const glob = require("glob");

const { getRealEstateInfo, getBatchRoomInfo } = require("../request/getFuzhou");
const { regionMap } = require("../const/index");
const { getReginByCode } = require("./util");
const { logger, writeFileSync } = require("./util");

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
  let files = glob.sync("./data/fuzhou/*.json");

  files.forEach(async (file) => {
    let { list = [] } = require(path.resolve("./", file));
    if (!list.length) {
      return;
    }

    for (const item of list) {
      let { name = "" } = getReginByCode(item.id?.split("_")[0]) || {};
      let filePath = `./data/fuzhou_house/${name}`;
      let fileName = `${item.xmxxxmmc}.json`;

      if (fs.existsSync(path.resolve(filePath, fileName))) {
        logger.warn(`${name}_${item.xmxxxmmc}  已存在，跳过`);
        continue;
      }

      logger.info(
        `当前 ${name} 进度 ${list.indexOf(item) + 1} / ${list.length}`
      );
      logger.info(`正在获取 ${name}_${item.xmxxxmmc} ...`);

      let result = await getBatchRoomInfo(item);

      logger.info(`获取 ${name}_${item.xmxxxmmc} 成功，写入中...`);

      writeFileSync({
        filePath,
        fileName,
        jsonData: result,
      });

      logger.info(`写入 ${name}_${item.xmxxxmmc} 成功`);
    }
  });
}

formateInfo();
