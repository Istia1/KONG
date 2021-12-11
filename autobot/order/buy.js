const global = require("../globalState/index.js");
const utils = require("../utils/index.js");

/**
 * order buying
 *
 * @param {Object} logger
 * @param {Object} binance
 * @param {string} symbol
 * @param {float} price
 * @returns {Object} 응답 결과
 */

const buy = async (logger, binance, symbol, price, order) => {
  // 이거 종목바뀌면 꼭 수정해줘야댐 ..
  // 연속으로 거래 요청되는 현상 방지 
  if (Math.abs(price - global.nextBuyingPrice) < price * 0.0008) {
    return;
  }

  // loop 중지
  global.isOnOrder = true;

  // 주문 넣는 부분
  try {
    // 요청 보냄 ..
    global.isFinishedOrderRequest = false;

    buyingOrder(logger, binance, symbol, price);

    // 30초 내에 체결 안되면 state값 반영 x
    setTimeout(() => {
      // ################ 체결이 안됬으면 ################
      if (!global.isFinishedOrderRequest) {
        order.cancelAllOrder(logger, binance, symbol);
        utils.setIsOnderAfterDelay(50 * 1000);
        global.isFinishedOrderRequest = true;
        global.position = "";
      } else {
        // ################ 체결이 됬으면 ... ################
        // 수량(quantity), 평단가, 총 구매 금액 세팅
        setPriceValue(binance, symbol, price, order);

        // 판매할 가격 부분 && 추매 가격 책정하는 부분
        setSellingPrice(price);

        global.isFinishedOrderRequest = true;

        utils.setIsOnderAfterDelay(30 * 1000);
      }
    }, 30 * 1000);
  } catch (e) {
    console.log(e);
  }
};

const setSellingPrice = (price) => {
  if (global.position === "LONG") {
    if (global.buyingCount === 1) {
      global.finishPrice = price * (1 + global.finish_long_position_ratio);
      global.nextBuyingPrice = price * (1 - global.add_more_buying_ratio);
    } else {
      // 추매 부분
      global.finishPrice =
        global.avgPrice * (1 + global.finish_long_position_ratio);
      global.nextBuyingPrice = price * (1 - global.add_more_buying_ratio);
    }
  }
  if (global.position === "SHORT") {
    if (global.buyingCount === 1) {
      global.finishPrice = price * (1 - global.finish_short_position_ratio);
      global.nextBuyingPrice = price * (1 + global.add_more_buying_ratio);
    } else {
      // 추매 부분
      global.finishPrice =
        global.avgPrice * (1 - global.finish_long_position_ratio);
      global.nextBuyingPrice = price * (1 + global.add_more_buying_ratio);
    }
  }
  console.log("🌍 다음 추매할 금액 : ", global.nextBuyingPrice);
  console.log("🌏 포지션 처리할 금액 : ", global.finishPrice);
};

// 수량(quantity), 평단가, 총 구매 금액 세팅
const setPriceValue = async (binance, symbol, price, order) => {
  global.buyingCount = global.buyingCount + 1;

  // 평단가, 수량 다시 넣어주기
  try {
    const resultObj = await order.getPositionedOrder(binance, symbol);
    global.quantity = resultObj.positionAmt;
    global.avgPrice = resultObj.avgPrice;
    global.positionMoney = global.quantity * global.avgPrice;
  } catch (e) {
    console.log(e);
  }

  // 수량 계산..
  // const buyMoneyPerOneTime = global.using_money / global.dividedBuyNum;
  // const quantity =
  //   global.minimum_order_price > buyMoneyPerOneTime / price
  //     ? global.minimum_order_price
  //     : buyingMoney / buyingPrice;
  // global.quantity = global.quantity + quantity;
  // 평단 계산 ...
  // if (global.positionMoney === 0) {
  //   global.avgPrice = price;
  // } else {
  //   global.avgPrice =
  //     (global.avgPrice * global.quantity +
  //       (price * price) / buyMoneyPerOneTime) /
  //     (global.quantity + price / buyMoneyPerOneTime);
  // }
  // 포지션 머니 계산 ..
  // global.positionMoney = global.positionMoney + buyMoneyPerOneTime;
};

const buyingOrder = async (logger, binance, symbol, price) => {
  try {
    console.log("🐁 position 잡는 요청 보냄.. -", global.position);
    console.log("🐁 가격 : ", price);
    console.log("🐁 구매 횟수 : ", global.buyingCount + 1);

    global.isOnOrder = true;

    // 수량 계산하는 부분
    const buyMoneyPerOneTime = global.using_money / global.dividedBuyNum;
    const quantity =
      global.minimum_order_price > buyMoneyPerOneTime / price
        ? global.minimum_order_price
        : buyMoneyPerOneTime / price;

    if (global.position === "LONG") {
      res = await binance.futuresBuy(
        symbol,
        quantity.toFixed(global.toFixed_price),
        price - global.additional_price,
        {
          positionSide: "LONG",
        }
      );
    }
    if (global.position === "SHORT") {
      res = await binance.futuresSell(
        symbol,
        quantity.toFixed(global.toFixed_price),
        price + global.additional_price,
        {
          positionSide: "SHORT",
        }
      );
    }
  } catch (e) {
    console.log(e);
  }
};

/**
 * [Object: null prototype] {
  orderId: BigNumber { s: 1, e: 18, c: [ 83897, 65509087401148 ] },
  symbol: 'ETHUSDT',
  status: 'NEW',
  clientOrderId: 'sXboXRZvcQxZUdwqtwo3eX',
  price: '3885.88',
  avgPrice: '0.00000',
  origQty: '0.002',
  executedQty: '0',
  cumQty: '0',
  cumQuote: '0',
  timeInForce: 'GTX',
  type: 'LIMIT',
  reduceOnly: false,
  closePosition: false,
  side: 'SELL',
  positionSide: 'SHORT',
  stopPrice: '0',
  workingType: 'CONTRACT_PRICE',
  priceProtect: false,
  origType: 'LIMIT',
  updateTime: 1634451969146
}
 */

module.exports = { buy };
