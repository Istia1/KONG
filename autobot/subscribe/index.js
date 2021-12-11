const global = require("../globalState/index.js");
const helpers = require("../../helpers/index.js");
const utils = require("../utils/index.js");
/**
 * get currentPrice from binance
 *
 * @param {Object} logger
 * @param {Object} binance
 * @param {string} symbol
 * @returns {Object} keys: availableBalance, assets
 */
const setCurrentMarketPrice = (logger, binance, symbol) => {
  logger.info("코인 실시간 가격 web Socket 연결 ... ");
  try {
    // 현재가 받아오는 부분 속도 ...
    binance.futuresSubscribe(`${symbol}@aggTrade`, (o) => {
      global.current_market_price = parseFloat(o.p);
    });

    binance.futuresSubscribe(`${symbol}@kline_4h`, (o) => {
      global.current_market_price = parseFloat(o.k.c);
    });
  } catch (e) {
    console.log(e);
    // 에러 발생 시 재시작 해줘야 되는데...
  }
};

// 이건 거래에서 작동이 안댐 ...
function balance_update(data) {
  console.log("### balance_update ###");
  console.log(data);
  // console.log(
  //   "Update 시간 : ",
  //   moment
  //     .utc(data.transaction)
  //     .add(9, "hours")
  //     .local()
  //     .format("YYYY/MM/DD HH:mm:ss")
  // );
  // console.log("@@@@ updateData.balances @@@@");
  // console.log(data.updateData.balances);

  // console.log("@@@@ updateData.positions @@@@");
  // console.log(data.updateData.positions);
}

// 작동 되는 녀석
async function execution_update(data) {
  // 주문에 대한 결과 인지 check
  if (data.updateData.eventReasonType === "ORDER") {

    // 포지션 다 팔렸는지 체크 ...
    let positionAmount = 0;
    data.updateData.positions.forEach((e) => {
      positionAmount = positionAmount + parseFloat(e.positionAmount);
    });

    // 모두 팔린거임 ....
    if (positionAmount == 0) {
      const msg = 
      "🌸 All Position Closed\n" +
      `🌸 현재 가지고 있는 금액($) : ${data.updateData.balances[0].walletBalance}`
      helpers.slack.sendMessage(msg);
      utils.setIsOnderAfterDelay(global.deley_after_sell);
      initPriceValue();
      global.isFinishedOrderRequest = true;
    } else {
      // ####### 포지션을 들어간거임 ..
      let entryPrice;
      console.log("############# execution_update ###############");
      console.log('### 주문 요청 체결 되었음.')
      console.log("############# execution_update ###############");


      // 최초 진입
      if (global.buyingCount === 1) {
        const msg = 
          `🔥 Position Start - ${global.position} 포지션\n` +
          `🔥 평균 단가($) : ${global.avgPrice}\n` +
          `🔥 판매할 가격($) : ${global.finishPrice}\n` +
          `🔥 다음 추매 가격($) : ${global.nextBuyingPrice}`
        setTimeout(() => {
          helpers.slack.sendMessage(msg);
        }, 60 * 1000);
      } else {
        setTimeout(() => {
          const msg = 
          `🐉 추매 진행 - ${global.buyingCount}번 구매\n` +
          `🐉 현재 포지션 : ${global.position}\n` +
          `🐉 평균 단가($) : ${global.avgPrice}\n` + 
          `🐉 판매할 가격($) : ${global.finishPrice}\n` + 
          `🐉 다음 추매 가격($) : ${global.nextBuyingPrice}`
          helpers.slack.sendMessage(msg);
        }, 60 * 1000);
      }
      // 레버리지 조절 부분 binance 가져 와야댐 .. 
      // await binance.futuresLeverage( symbol, global.leverage );
      global.isFinishedOrderRequest = true;
    }
  }

  global.isFinishedOrderRequest = true;
}
/**
 * get currentPrice from binance
 *
 * @param {Object} logger
 * @param {Object} binance
 */

const userOrderDataStream = (logger, binance) => {
  // 상태 업데이트 있을때 알람이 옴.
  logger.info("User Stream Start..");
  binance.websockets.userFutureData(balance_update, execution_update);
  // 유저 데이터 스트리밍은 1시간이면 세션이 끊켜서 유지 시켜 줘야댐
  // setInterval(() => {
  //   binance.futuresKeepDataStream();
  // }, 40 * 60 * 1000);
};

const initPriceValue = () => {
  global.isOnOrder = false;
  global.positionMoney = 0;
  global.finishPrice = 0;
  global.buyingCount = 0;
  global.position = "";
  global.quantity = 0;
  global.avgPrice = 0;
  global.nextBuyingPrice = 0;
};

module.exports = { setCurrentMarketPrice, userOrderDataStream };
