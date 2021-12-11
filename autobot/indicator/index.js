const global = require("../globalState/index.js");
/**
 * get MA
 *
 * @param {Object} logger
 * @param {Object} binance
 * @param {string} symbol
 * @param {string} 몇분 평균가?
 * @returns {float} MA price
 */
const setMAprice = async (logger, binance, symbol, min) => {
  try {
    const result = await binance.futuresCandles(symbol, `1m`);
    const slicedList = result.slice(result.length - min, result.length);

    // 급등 or 급락 했을 경우, 거래 정지 => amplitude가 0.3 이상일때 5분 휴식
    if (!global.stop) {
      const checkLastCandleMinus1 =
        slicedList[slicedList.length - 1][2] /
          slicedList[slicedList.length - 1][3] -
        1;
      const checkLastCandleMinus2 =
        slicedList[slicedList.length - 2][2] /
          slicedList[slicedList.length - 2][3] -
        1;
      if (checkLastCandleMinus1 < 0 || checkLastCandleMinus2 < 0) {
        return;
      } else {
        if (
          checkLastCandleMinus2 > 0.006 ||
          (checkLastCandleMinus1 > 0.003 && checkLastCandleMinus2 > 0.003)
        ) {
          logger.info("😶‍🌎 AMPLITUDE가 0.3%가 넘어서 3분 대기. ");
          global.stop = true;
          setTimeout(() => {
            global.stop = false;
          }, 3 * 60 * 1000);
        }
      }
    }

    // 시가, 종가의 평균을 day로 나눈다
    const avgPricePerMin = [];
    slicedList.forEach((e) => {
      avgPricePerMin.push((parseFloat(e[1]) + parseFloat(e[4])) / 2);
    });
    // console.info(avgPricePerMin.reduce((a, b) => a + b, 0) / min);
    global.ma_price = avgPricePerMin.reduce((a, b) => a + b, 0) / min;
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  setMAprice,
};

/**
    [
      [
        1499040000000,      // Open time [0]
        "0.01634790",       // Open [1]
        "0.80000000",       // High [2]
        "0.01575800",       // Low [3]
        "0.01577100",       // Close [4]
        "148976.11427815",  // Volume [5]
        1499644799999,      // Close time [6]
        "2434.19055334",    // Quote asset volume [7]
        308,                // Number of trades [8]
        "1756.87402397",    // Taker buy base asset volume
        "28.46694368",      // Taker buy quote asset volume
        "17928899.62484339" // Ignore.
      ]
    ] 
 */
