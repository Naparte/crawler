const fs = require("fs");
const path = require("path");
const glob = require("glob");

const { getBatchRoomInfo } = require("./request/getFuzhou");
const { getReginByCode, writeFileSync, logger } = require("./mod_fuzhou/util");


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

/** 第二步：获取所有楼盘的信息 */
formateInfo();
