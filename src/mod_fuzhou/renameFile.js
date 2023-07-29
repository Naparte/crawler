const glob = require("glob");
const fs = require("fs");
const path = require("path");

let files = glob.sync("./data/fuzhou_house/*.json");

files.forEach((file) => {
  const fileName = path.basename(file);
  const dirName = path.dirname(file);

  fs.mkdirSync(dirName + "/" + fileName.split("_")[0] || "", {
    recursive: true,
  });
  fs.renameSync(file, dirName + "/" + fileName.split("_").join("/") || "");
});
