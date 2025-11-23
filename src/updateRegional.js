/** 更新各区域楼盘数据，输出到data目录下 */

const fs = require("fs");
const path = require("path");

const { getRealEstateInfo } = require("./request/getFuzhou");
const { regionMap } = require("./const/index");
const { logger } = require("./mod_fuzhou/util");

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


/** 第一步：先获取所有的小区数据 */
_creteaRealEstate();

