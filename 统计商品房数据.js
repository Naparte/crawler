// 统计市区商品房总数

const fs = require("fs");
const path = require("path");
const glob = require("glob");
const { log } = require("console");

// 定义要查找的JSON文件的路径模式
// data/fuzhou_house/市本级/ 汝水花园.json
// const pattern = "./data/fuzhou_house/市本级/*.json";
const pattern = "./data/fuzhou_house/临川区/*.json";
let count = 0;
let files = glob.sync(pattern);
files.forEach((file) => {
  let data = fs.readFileSync(
    path.join(__dirname, file),
    "utf8",
    (err, data) => {
      if (err) {
        console.error("Error reading file:", err);
        return;
      }
    }
  );

  // 将读取到的字符串内容解析为JSON对象
  const jsonData = JSON.parse(data);

  // 统计并输出每个数组key的长度
  let temp = 0;
  for (const key in jsonData) {
    if (Array.isArray(jsonData[key])) {
      temp += jsonData[key].length;
    }
  }

  count += temp;

  log(file, temp, count);
});
