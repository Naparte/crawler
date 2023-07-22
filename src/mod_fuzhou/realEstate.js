const fs = require("fs");
const path = require("path");

const {
  getRealEstateInfo,
  getHouseInfo,
  getRoomInfo,
} = require("../request/getFuzhou");
const { regionMap } = require("../const/index");

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
    console.log(item);
    result.push(item);

    if (index === arr.length - 1) {
      console.log(result);
      fs.writeFileSync(
        path.resolve(`./data/fuzhou`, `total.json`),
        JSON.stringify(result, null, "\t")
      );
    }
  });
}

// _creteaRealEstate();

// getHouseInfo({
//   id: "361001_1466249726285312002",
//   kfsywzh: "91361002MA3AE9W068",
//   rownum_: 15,
//   xmxxaddtime: "2021-12-02 11:35:02",
//   xmxxghxkmj: "103373",
//   xmxxid: "1466249726285312002",
//   xmxxjtzl: "金柅大道以西、规划一路以北",
//   xmxxjzmj: "73527.22",
//   xmxxkfs: "抚州威鑫房地产开发有限公司",
//   xmxxxmbh: "1202",
//   xmxxxmmc: "时代艺境",
//   xmxxzds: 19,
// });
getRoomInfo({
  href: "http://www.jxfzfdc.cn/roomDetail?view=statisticsTable&col=announce&xmxxXmbh=&xmxxId=361001_1466249726285312002&xmxxLdid=1544950743897686017",
});
