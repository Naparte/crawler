const log4js = require('log4js');

const { regionMap } = require("../const/index");

function getReginByCode(code) {
  return regionMap.find((item) => {
    return (item.code + '') === code;
  });
}


const logger = log4js.getLogger();
logger.level = "all"

// 记录日志
// logger.trace('This is a trace message.');
// logger.debug('This is a debug message.');
// logger.info('This is an info message.');
// logger.warn('This is a warning message.');
// logger.error('This is an error message.');


module.exports = {
  getReginByCode,
  logger
};
