const global = require("../globalState/index.js");
const utils = require("../utils/index.js");

const sell = async (logger, binance, symbol, price, order) => {
  try {
    let res;

    global.isOnOrder = true;
    global.isFinishedOrderRequest = false;

    // 수량 계산하는 부분 => 이부분 request 불러 와야댐 ... (전체 다 팔기 위해서...)
    const buyMoneyPerOneTime = global.using_money / global.dividedBuyNum;

    // 이거.. 전부 다 팔아야되는데 ?
    const quantity = global.quantity;

    console.log(
      "❄️ Position 정리 요청 보냄 : ",
      price + global.additional_price
    );

    if (global.position === "LONG") {
      res = await binance.futuresOrder(
        "SELL",
        symbol,
        quantity.toFixed(global.toFixed_price),
        false,
        {
          type: "TAKE_PROFIT_MARKET",
          stopPrice: price + global.additional_price,
          positionSide: "LONG",
          closePosition: true,
        }
      );
    }
    if (global.position === "SHORT") {
      res = await binance.futuresOrder(
        "BUY",
        symbol,
        quantity.toFixed(global.toFixed_price),
        false,
        {
          type: "TAKE_PROFIT_MARKET",
          stopPrice: price - global.additional_price,
          positionSide: "SHORT",
          closePosition: true,
        }
      );
    }

    // 30초 내에 체결 안되면 state값 반영 x
    setTimeout(async () => {
      // ################ 체결이 안됬으면 ################
      console.log('주문 취소 알고리즘 들어감.');
      if (!global.isFinishedOrderRequest) {
        // TypeError: Cannot read property 'cancelAllOrder' of undefined
        // order.cancelAllOrder(logger, binance, symbol);

        try {
          const result = await binance.futuresOpenOrders();
          if (result.length === 0) {
            // 취소할거 없으면 리턴
          } else {
            result.forEach((e) => {
              console.log(
                "취소할 주문 포지션 : ",
                e.positionSide,
                "금액 : ",
                e.price,
                "수량 : ",
                e.origQty
              );
            });

            const res = await binance.futuresCancelAll(symbol);
            if (res.code == "200") {
              console.log("모든 주문이 취소 되었습니다.");
            }
          }
        } catch (e) {
          console.log(e);
        }

        utils.setIsOnderAfterDelay(50 * 1000);
        global.isFinishedOrderRequest = true;
        global.isOnOrder = false;
      } else {
        // ################ 체결이 됬으면 ... ################

        // subscribe 쪽에서 ...

        global.isFinishedOrderRequest = true;
        global.isOnOrder = false;
        // utils.setIsOnderAfterDelay(30 * 1000);
      }
    }, 30 * 1000);
  } catch (e) {
    console.log(e);
  }
};

module.exports = { sell };
