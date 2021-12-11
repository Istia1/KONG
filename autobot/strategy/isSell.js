const global = require("../globalState/index.js");
const utils = require("../utils/index.js");

/**
 * Buying Algoridm
 *
 * @param {Object} logger
 * @param {string} 몇분 평균가?
 * @returns {Boolean} true/false
 */

const isSell = (logger) => {
  if (global.finishPrice === 0) return;
  if (global.position === "LONG") {
    if (global.current_market_price > global.finishPrice) {
      return true;
    }
  }
  if (global.position === "SHORT") {
    if (global.current_market_price < global.finishPrice) {
      return true;
    }
  }
  return false;
};

// const isSellAll = () => {
//   // 청산 가격 부분
//   if (global.finishPrice === 0) return;
//   if (global.position === "LONG") {
//     if (global.current_market_price < global.finishPrice * 0.977) {
//       console.log("@ 청산 방지... 모두 손절.. ");
//       initPriceValue();
//     }
//   }
//   if (global.position === "SHORT") {
//     if (global.current_market_price > global.finishPrice * 1.027) {
//       console.log("@ 청산 방지... 모두 손절.. ");
//       initPriceValue();
//     }
//   }
//   // 갑자기 급등 급락했을 경우

//   // 손절쳐서 팔기
//   if (position === "LONG") {
//     if (price * percent22222222 > current_market_price) {
//     }
//   }
//   if (position === "SHORT") {
//     if (price * percent22222222 < current_market_price) {
//     }
//   }
// };

module.exports = { isSell };
