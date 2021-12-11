const helpers = require("../helpers/index.js");
const global = require("./globalState/index.js");
const subscribe = require("./subscribe/index.js");
const indicator = require("./indicator/index.js");
const strategy = require("./strategy/index.js");
const order = require("./order/index.js");
const deposit = require("./deposit/index.js");

const symbol = "ethusdt";

// 메인 로직
const startAutoBot = async () => {


  // 잔금 가져오는 부분 & 잔고 금액 init 
  await deposit.getCurrentBalance(helpers.logger, helpers.binance, symbol,true);

  subscribe.userOrderDataStream(helpers.logger, helpers.binance);
  subscribe.setCurrentMarketPrice(helpers.logger, helpers.binance, symbol);

  startInitValue();

  // MA_price setting 부분 10분동안의 평균값
  setInterval(async () => {
    indicator.setMAprice(helpers.logger, helpers.binance, symbol, 10);
  }, 2000);

  // 시작 부분
  global.mainLoopLogic = setInterval(async () => {
    if (!global.stop) {
      if (!global.isOnOrder || global.isFinishedOrderRequest) {
        try {
          if (strategy.isBuy(helpers.logger, helpers.binance, symbol)) {
            order.buy(
              helpers.logger,
              helpers.binance,
              symbol,
              parseFloat(global.current_market_price),
              order
            );
          }
        } catch (e) {
          console.log(e);
        }
      }
      if (!global.isOnOrder && strategy.isSell(helpers.logger)) {
        order.sell(
          helpers.logger,
          helpers.binance,
          symbol,
          parseFloat(global.current_market_price),
          order
        );
      }
    }
  }, 180);
};

/**
 * 현재시간 가져오는 부분 
 *   console.log(
    moment.utc(moment()).add(9, "hours").local().format("YYYY/MM/DD HH:mm:ss")
  );
 */

const startInitValue = () => {
  // init price
  global.leverage = 2;
  global.mainLoopLogic;
  global.loopGetMA;
  global.current_market_price = 0;
  global.ma_price = 0;
  global.isOnOrder = false;
  global.dividedBuyNum = 6; // 분할 횟수 ...
  global.avgPrice = 0;
  global.nextBuyingPrice = 0;
  global.positionMoney = 0; // 총 구매 금액(total price)
  global.position = "";
  global.finishPrice = 0;
  global.buyingCount = 0;
  global.quantity = 0;
  global.stop = false;
  global.lastOrderTime = Date.now();
  global.long_diff_price_ma_ratio = 0.2;
  global.short_diff_price_ma_ratio = 0.2;
  global.finish_short_position_ratio = 0.2 / 100;
  global.finish_long_position_ratio = 0.2 / 100;
  global.add_more_buying_ratio = 0.35 / 100;
  global.deley_after_sell = 4 * 60 * 1000;
  global.using_money = 80; // 굴릴 총 금액 분할 횟수에 나뉘어짐 
  global.isFinishedOrderRequest = true;
  global.minimum_order_price = 0.002;
  global.toFixed_price = 3;
  global.additional_price = 0.5;
};

startAutoBot();
