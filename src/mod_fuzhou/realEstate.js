const fs = require("fs");
const path = require("path");

const { getRealEstateInfo } = require("../request/getFuzhou");

const { regionMap } = require("../const/index");
const { log } = require("console");

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

_creteaRealEstate();
