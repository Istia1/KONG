const global = require("../globalState/index.js");
const helpers = require("../../helpers/index.js");
/**
 * get Current deposit
 *
 * @param {Object} logger
 * @param {Object} binance
 * @param {string} symbol
 */
const getCurrentBalance = async (logger, binance, symbol, isSlackMsg = false) => {

  const { totalMarginBalance, totalCrossUnPnl,availableBalance, assets } = await binance.futuresAccount();
  global.using_money = parseFloat(availableBalance);

  const positionList = [];
  // 현재 포지션 가지고 있는지 체크
  assets.filter(el => el.initialMargin != 0).map(el => {
    positionList.push({
      asset: el.asset, // 코인 이름
      positionInitialMargin: el.positionInitialMargin, // 얼마 들어갔는지 
      unrealizedProfit: el.unrealizedProfit // 미 실현 수익 
    })
  })

    let msg = 
      '🧰 잔고 조회 진행\n' +
      `🧰 선물에 있는 총 금액 : ${totalMarginBalance} \n` +
      `🧰 미실현 금액 : ${totalCrossUnPnl}\n` + 
      `🧰 사용할 수 있는 금액 : ${availableBalance}\n`
    if (positionList.length > 0) {
      positionList.forEach((value,idx)=> {
        msg = msg + `💈${idx+1}. 코인명: ${value.asset}, 구매한 금액: ${value.positionInitialMargin}, 수익 금액: ${value.unrealizedProfit}\n`
      });
    }
    if (isSlackMsg) helpers.slack.sendMessage(msg);
    console.log(msg)
}

module.exports = {
  getCurrentBalance,
};
