const global = require("../globalState/index.js");
const utils = require("../utils/index.js");

/**
 * Buying Algoridm
 *
 * @param {Object} logger
 * @param {Object} binance
 * @param {string} symbol
 * @param {string} 몇분 평균가?
 * @returns {Boolean} true/false
 */

const isBuy = (logger, binance, symbol) => {
  if (global.current_market_price === 0 || global.ma_price === 0) return;
  const diff_price_ma = utils.convertPrice2Percent(
    global.current_market_price,
    global.ma_price
  );
  // @@@@@@@@@@@@@ 첫 포지션 진입 부분 @@@@@@@@@@@@@
  if (
    diff_price_ma > global.short_diff_price_ma_ratio &&
    !global.isOnOrder &&
    global.buyingCount === 0
  ) {
    global.position = "SHORT";
    return true;
    // sendOrder(current_market_price, position);
  }
  if (
    diff_price_ma < -global.long_diff_price_ma_ratio &&
    !global.isOnOrder &&
    global.buyingCount === 0
  ) {
    global.position = "LONG";
    // sendOrder(current_market_price, position);
    return true;
  }
  // @@@@@@@@@@@@ 첫 포지션 진입 부분 @@@@@@@@@@@@@

  // @@@@@@@@@@@@ 추가 매수 부분  @@@@@@@@@@@@
  if (
    global.buyingCount > 0 &&
    global.position === "SHORT" &&
    global.current_market_price > global.nextBuyingPrice &&
    !global.isOnOrder
  ) {
    // 추가 매수 부분
    // sendOrder(current_market_price, position);
    return true;
  }
  if (
    global.buyingCount > 0 &&
    global.position === "LONG" &&
    global.current_market_price < global.nextBuyingPrice &&
    !global.isOnOrder
  ) {
    // 추가 매수 부분

    return true;
    // sendOrder(current_market_price, position);
  }
  // @@@@@@@@@@@@ 추가 매수 부분  @@@@@@@@@@@@
  return false;
};

const buyingAlgorithm = () => {
  // 구매 알고리즘 따로 빼기 ..
  // 꾸준히 상승하는 구간에 쑛잡는거 어떻게 해결할건지 ..
};

module.exports = { isBuy };
