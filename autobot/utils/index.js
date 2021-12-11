const moment = require("moment");
const global = require("../globalState/index.js");

const convertSeconds2Time = (ms) => {
  // 한국 시간으로 변환 하여 반환
  // format("DD/MM/YYYY HH:mm:ss");
  return moment.utc(ms).add(9, "hours").local().format("YYYY/MM/DD HH:mm:ss");
};

const convertPrice2Percent = (currentPrice, openPrice) => {
  const current_price = parseFloat(currentPrice);
  const compared_price = parseFloat(openPrice);
  if (current_price < compared_price) {
    return -1 * (1 - current_price / compared_price) * 100;
  } else {
    return (1 - compared_price / current_price) * 100;
  }
};

const convertPositionName = (side) => {
  return side === "BUY" ? "LONG" : "SHORT";
};

const getCurrentTime = () => {
  return "시간 : " + moment().format("HH시 mm분 ss초");
};

const setIsOnderAfterDelay = (ms) => {
  setTimeout(() => {
    global.isOnOrder = false;
  }, ms);
};

module.exports = {
  convertSeconds2Time,
  convertPrice2Percent,
  convertPositionName,
  getCurrentTime,
  setIsOnderAfterDelay,
};
