const Binance = require("node-binance-api");
const moment = require("moment");
const express = require("express");
const today = moment();
const _ = require("lodash");

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
let mainLoopLogic;
let loopGetMA;
let current_market_price = 100;
let ma_price = 0;
let isOnOrder = false;
let dividedBuyNum = 10;
let buyMoneyPerOneTime = current_market_price / dividedBuyNum;
let avgPrice = 0;
let nextBuyingPrice = 0;
let positionMoney = 0;
let position = "";
let finishPrice = 0;
let buyingCount = 0;
let quantity = 0;
let stop = false;
let lastOrderTime = Date.now();
const TARGET_SYMBOL = "ETHUSDT";
const long_diff_price_ma_ratio = 0.17;
const short_diff_price_ma_ratio = 0.17;
const finish_short_position_ratio = 0.2 / 100;
const finish_long_position_ratio = 0.2 / 100;
const add_more_buying_ratio = 0.17 / 100;
const deley_after_sell = 4 * 60 * 1000;
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

// For test
// let binance = new Binance().options({
//   APIKEY: "DUoxxp9nuFuqQzP10C3MkFHHuqXIJ0Dwb091XYV9lNj8GbNTjSvrUfDTsGlD6BQn",
//   APISECRET: "XzXiEWbj9IQNWtTg67kqS0ZS7Ebx5mAGcvBahfVe96DQyNJJb5lRFddq16oA3YFu",
//   test: true,
//   useServerTime: true,
//   verbose: true,
//   urls: {
//     base: "https://testnet.binance.vision/api/",
//     combineStream: "wss://testnet.binance.vision/stream?streams=",
//     stream: "wss://testnet.binance.vision/ws/",
//   },
// });

let binance = new Binance().options({
  APIKEY: "7OQYJ1Z2ZOrrwbEAiun46KxbY2HkLPav8Ojp01VkaWbz96MJkre3q1U9qXVLjV4E",
  APISECRET: "YAXTef9Lq8zXfILB7h0f8zHUC90CqcvJRRoveh1iFXvPPurTy7YVHe8Qbdd2YBV2",
});

const convertSeconds2Time = (ms) => {
  // 한국 시간으로 변환 하여 반환
  // format("DD/MM/YYYY HH:mm:ss");
  return moment.utc(ms).local().format("DD/MM/YYYY HH:mm:ss");
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

const getMA = async (min) => {
  /*
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
  try {
    const result = await binance.futuresCandles(TARGET_SYMBOL, "1m");
    const slicedList = result.slice(result.length - min, result.length);

    // 급등 or 급락 했을 경우, 거래 정지 => amplitude가 0.3 이상일때 5분 휴식
    if (!stop) {
      const checkLastCandle1 =
        slicedList[slicedList.length - 1][2] /
          slicedList[slicedList.length - 1][3] -
        1;
      const checkLastCandle2 =
        slicedList[slicedList.length - 2][2] /
          slicedList[slicedList.length - 2][3] -
        1;
      if (checkLastCandle1 < 0 || checkLastCandle2 < 0) {
        return;
      } else {
        if (
          checkLastCandle2 > 0.006 ||
          (checkLastCandle1 > 0.003 && checkLastCandle2 > 0.003)
        ) {
          console.log("😶‍🌎 AMPLITUDE가 0.3%가 넘어서 3분 대기. ");
          stop = true;
          setTimeout(() => {
            stop = false;
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
    ma_price = avgPricePerMin.reduce((a, b) => a + b, 0) / min;
  } catch (e) {
    console.log(e);
  }
};

const initParams = () => {
  isOnOrder = false;
  dividedBuyNum = 8;
  positionMoney = 0;
  finishPrice = 0;
  buyingCount = 0;
  position = "";
  quantity = 0;
  avgPrice = 0;
  nextBuyingPrice = 0;
};

const isFinishPosition = (symbol, quantity, price) => {
  if (finishPrice === 0) return;
  if (position === "LONG") {
    if (current_market_price > finishPrice) {
      console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
      console.log(
        getCurrentTime(),
        "🐋 롱포지션 판매 완료 - 가격 : ",
        current_market_price,
        ", 평단가 : ",
        avgPrice
      );
      console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
      initParams();

      stop = true;

      setTimeout(() => {
        stop = false;
      }, deley_after_sell);
    }
  }
  if (position === "SHORT") {
    if (current_market_price < finishPrice) {
      console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
      console.log(
        getCurrentTime(),
        "😶‍🌫️ 숏포지션 판매 완료 - 가격 : ",
        current_market_price,
        ", 평단가 : ",
        avgPrice
      );
      console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
      initParams();

      stop = true;

      setTimeout(() => {
        stop = false;
      }, deley_after_sell);
    }
  }
};

const sendOrder = (price, pos, cancelTime = false) => {
  if (dividedBuyNum > 0) {
    if (buyingCount > 0) {
      if (Math.abs(price - nextBuyingPrice) < 2) {
        return;
      }
    }

    isOnOrder = true;

    //평단가 구하는곳
    buyingCount = buyingCount + 1;
    quantity = quantity + price / buyMoneyPerOneTime;
    if (positionMoney === 0) {
      avgPrice = price;
    } else {
      avgPrice =
        (avgPrice * quantity + (price * price) / buyMoneyPerOneTime) /
        (quantity + price / buyMoneyPerOneTime);
    }

    positionMoney = positionMoney + buyMoneyPerOneTime;

    // 판매할 가격 부분 && 추가 구매할 가격 책정하는 부분
    if (position === "LONG") {
      if (buyingCount === 1) {
        finishPrice = price * (1 + finish_long_position_ratio);
        nextBuyingPrice = price * (1 - add_more_buying_ratio);
      } else {
        // 추매 부분
        finishPrice = avgPrice * (1 + finish_long_position_ratio);
        nextBuyingPrice = price * (1 - add_more_buying_ratio);
      }
    }
    if (position === "SHORT") {
      if (buyingCount === 1) {
        finishPrice = price * (1 - finish_short_position_ratio);
        nextBuyingPrice = price * (1 + add_more_buying_ratio);
      } else {
        // 추매 부분
        finishPrice = avgPrice * (1 - finish_long_position_ratio);
        nextBuyingPrice = price * (1 + add_more_buying_ratio);
      }
    }

    /* 
      binance 구매 부분 
          try {
      const res = await binance.futuresBuy(symbol, quantity, price);
      lastOrderTime = Date.now();

      // 8초 이내에 응답이 없으면 그냥 다 취소 
      if (cancelTime) {
        setTimeout(() => {
          if (!res) cancelAllOrder(symbol);
        }, cancelTime);
      }
    } catch (e) {
      console.log(e);
    }
    */

    console.log(
      getCurrentTime(),
      pos,
      "주문 하였습니다. 평단 - ",
      avgPrice,
      ", 주문 금액 - ",
      price,
      ", 총 구매 금액 - ",
      positionMoney
    );

    console.log(
      "판매 할 가격 : ",
      finishPrice,
      "다음 추매할 가격 : ",
      nextBuyingPrice
    );
    dividedBuyNum -= 1;
  } else {
    console.log(
      getCurrentTime(),
      " - 보유중인 돈을 모두 사용했습니다.",
      ", 현재가 - ",
      current_market_price,
      " , 처리할 가격 - ",
      finishPrice
    );
  }
};

const getCurrentTime = () => {
  return "시간 : " + moment().format("HH시 mm분 ss초");
};

const setIsOnderAfterDelay = (ms) => {
  setTimeout(() => {
    isOnOrder = false;
  }, ms);
};

const isOrder = async () => {
  if (current_market_price === 0 || ma_price === 0) return;
  const diff_price_ma = convertPrice2Percent(current_market_price, ma_price);
  // @@@@@@@@@@@@@ 첫 포지션 진입 부분 @@@@@@@@@@@@@
  if (
    diff_price_ma > short_diff_price_ma_ratio &&
    !isOnOrder &&
    buyingCount === 0
  ) {
    position = "SHORT";
    sendOrder(current_market_price, position);

    setIsOnderAfterDelay(20000);
  }
  if (
    diff_price_ma < -long_diff_price_ma_ratio &&
    !isOnOrder &&
    buyingCount === 0
  ) {
    position = "LONG";
    sendOrder(current_market_price, position);

    setIsOnderAfterDelay(20000);
  }
  // @@@@@@@@@@@@ 첫 포지션 진입 부분 @@@@@@@@@@@@@

  // @@@@@@@@@@@@ 추가 매수 부분  @@@@@@@@@@@@
  if (
    buyingCount > 0 &&
    position === "SHORT" &&
    current_market_price > nextBuyingPrice &&
    !isOnOrder
  ) {
    // 추가 매수 부분
    sendOrder(current_market_price, position);

    setIsOnderAfterDelay(20000);
  }
  if (
    buyingCount > 0 &&
    position === "LONG" &&
    current_market_price < nextBuyingPrice &&
    !isOnOrder
  ) {
    // 추가 매수 부분
    position = "LONG";
    sendOrder(current_market_price, position);

    setIsOnderAfterDelay(20000);
  }
  // @@@@@@@@@@@@ 추가 매수 부분  @@@@@@@@@@@@
};

const isSellAll = () => {
  // 청산 가격 부분
  if (finishPrice === 0) return;
  if (position === "LONG") {
    if (current_market_price < finishPrice * 0.977) {
      console.log("@ 청산 방지... 모두 손절.. ");
      initParams();
    }
  }
  if (position === "SHORT") {
    if (current_market_price > finishPrice * 1.027) {
      console.log("@ 청산 방지... 모두 손절.. ");
      initParams();
    }
  }
  // 갑자기 급등 급락했을 경우

  // 손절쳐서 팔기
  if (position === "LONG") {
    if (price * percent > current_market_price) {
    }
  }
  if (position === "SHORT") {
    if (price * percent < current_market_price) {
    }
  }
};

const buyingAlgorithm = () => {
  // 구매 알고리즘 따로 빼기 ..
  // 꾸준히 상승하는 구간에 쑛잡는거 어떻게 해결할건지 ..
};

// 주문 모두 취소
const cancelAllOrder = async (symbol) => {
  // 주문 요청 보내고 5초 내에 거래 안되면 취소하기

  const res = await binance.futuresCancelAll(symbol);
  console.log(res);
};

const startSubscribeToBinance = async () => {
  console.log("server start!");
  try {
    binance.futuresSubscribe("ethusdt@aggTrade", (o) => {
      // 가격 불러오는 부분 하나 더 추가
      current_market_price = parseFloat(o.p);
    });

    binance.futuresSubscribe("ethusdt@kline_4h", (o) => {
      // 가격 불러오는 부분 하나 더 추가
      // console.log("🍎 종목명  -", o.k.s);
      // console.log("🌈 시간  -", convertSeconds2Time(o.k.t));
      // console.log(
      //   "⛄️ 현재가  -",
      //   o.k.c,
      //   `(${convertPrice2Percent(o.k.c, o.k.o)}%)`
      // );
      current_market_price = parseFloat(o.k.c);
    });

    // 이동평균선 계산
    loopGetMA = setInterval(async () => {
      getMA(10);
    }, 2000);

    // 시작 부분
    mainLoopLogic = setInterval(async () => {
      if (!stop) {
        if (!isOnOrder) {
          try {
            await isOrder();
          } catch (e) {
            console.log(e);
          }
        }
        isFinishPosition();
      }
    }, 100);
  } catch (e) {
    console.log(e);
    binance.futuresTerminate("ethusdt@kline_4h");
    binance.futuresTerminate("ethusdt@aggTrade");

    // stop loop logic
    clearTimeout(mainLoopLogic);
    clearTimeout(loopGetMA);

    // re-connect
    binance = new Binance().options({
      APIKEY:
        "7OQYJ1Z2ZOrrwbEAiun46KxbY2HkLPav8Ojp01VkaWbz96MJkre3q1U9qXVLjV4E",
      APISECRET:
        "YAXTef9Lq8zXfILB7h0f8zHUC90CqcvJRRoveh1iFXvPPurTy7YVHe8Qbdd2YBV2",
    });

    mainLoopLogic = setInterval(async () => {
      if (!stop) {
        if (isOnOrder) {
          try {
            await isOrder();
          } catch (e) {
            console.log(e);
          }
        }
        isFinishPosition();
      }
    }, 100);

    loopGetMA = setInterval(async () => {
      getMA(10);
    }, 2000);
    mainLoopLogic();
    loopGetMA();
  }
};

// 잔고... 
const getCurrentBalance = async (symbol) => {
  // margin 부분이랑 잔고 부분 수정해야댐 ...
  const { availableBalance, assets } = await binance.futuresAccount();
  assets.forEach((obj) => {
    if (obj.asset === symbol) {
      console.log(obj);
    }
  });
};

const getActivatedOrder = async (symbol) => {
  await binance.futuresOpenOrders(symbol);
};

const balance_update = (data) => {
  console.log("Balance Update");
  for (let obj of data.B) {
    let { a: asset, f: available, l: onOrder } = obj;
    if (available == "0.00000000") continue;
    console.log(
      asset + "\tavailable: " + available + " (" + onOrder + " on order)"
    );
  }
};

const execution_update = (data) => {
  let {
    x: executionType,
    s: symbol,
    p: price,
    q: quantity,
    S: side,
    o: orderType,
    i: orderId,
    X: orderStatus,
  } = data;
  if (executionType == "NEW") {
    if (orderStatus == "REJECTED") {
      console.log("Order Failed! Reason: " + data.r);
    }
    console.log(
      symbol +
        " " +
        side +
        " " +
        orderType +
        " ORDER #" +
        orderId +
        " (" +
        orderStatus +
        ")"
    );
    console.log("..price: " + price + ", quantity: " + quantity);
    return;
  }
  //NEW, CANCELED, REPLACED, REJECTED, TRADE, EXPIRED
  console.log(
    symbol +
      "\t" +
      side +
      " " +
      executionType +
      " " +
      orderType +
      " ORDER #" +
      orderId
  );
};

const userDataStream = () => {
  // futuresKeepDataStream
  // futuresGetDataStream

  // 상태 업데이트 있을때 알람이 옴.
  binance.websockets.userData(balance_update, execution_update);

  // 유저 데이터 스트리밍은 1시간이면 세션이 끊켜서 유지 시켜 줘야댐
  setInterval(() => {
    binance.futuresKeepDataStream();
  }, 40 * 60 * 1000);
};

const sellingOrder = (symbol, quantity, price) => {
  try {
    const res = await binance.futuresSell( symbol, quantity, price );
    
    // 체결 됬는지 안됬는지 check.. 해야댐 .. 

  } catch(e) {
    console.log(e)
  }
};

const buyingOrder = async (symbol, position, buyingPrice, buyingMoney) => {
  //   {
  //     "clientOrderId": "testOrder",
  //     "cumQty": "0",
  //     "cumQuote": "0",
  //     "executedQty": "0",
  //     "orderId": 22542179,
  //     "avgPrice": "0.00000",
  //     "origQty": "10",
  //     "price": "0",
  //     "reduceOnly": false,
  //     "side": "BUY",
  //     "positionSide": "SHORT",
  //     "status": "NEW",
  //     "stopPrice": "9300",        // please ignore when order type is TRAILING_STOP_MARKET
  //     "closePosition": false,   // if Close-All
  //     "symbol": "BTCUSDT",
  //     "timeInForce": "GTC",
  //     "type": "TRAILING_STOP_MARKET",
  //     "origType": "TRAILING_STOP_MARKET",
  //     "activatePrice": "9020",    // activation price, only return with TRAILING_STOP_MARKET order
  //     "priceRate": "0.3",         // callback rate, only return with TRAILING_STOP_MARKET order
  //     "updateTime": 1566818724722,
  //     "workingType": "CONTRACT_PRICE",
  //     "priceProtect": false            // if conditional order trigger is protected
  // }
  //

  try {
    let res;
    // 수량 계산하는 부분
    const quantity = buyingMoney / buyingPrice;
    if (position === "LONG") {
      res = await binance.futuresBuy(symbol, quantity, buyingPrice, {
        positionSide: "LONG",
      });
    }
    if (position === "SHORT") {
      res = await binance.futuresBuy(symbol, quantity, buyingPrice, {
        positionSide: "SHORT",
      });
    }
  } catch (e) {
    console.log(e);
  }
};

const doTest = async () => {
  // startSubscribeToBinance();
  // console.log(await binance.futuresBuy(TARGET_SYMBOL, 3395, 0.000001));
  // console.info(await binance.futuresMarketBuy(TARGET_SYMBOL, 0.01));
  // 시작 부분
  // console.log(binance.getOptions());
  // startSubscribeToBinance();
  // getCurrentBalance();
  try {
    console.info(await binance.futuresBuy("BTCUSDT", 0.0001, 55235.85));
  } catch (e) {} // console.info(await binance.futuresAccount());
  //userDataStream();
};

doTest();

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

// const express = require("express");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");
// const indexRoute = require("./routes/index");
// const app = express();

// const options = {
//   maxAge: 86400,
// };

// app.use(require("body-parser").urlencoded({ extended: true }));
// app.use(cors(options));
// app.use(cookieParser());
// app.use(express.json());

// app.use("/", indexRoute);

// app.get("/", (req, res) => {
//   res.send("server ongoing");
// });

// app.listen(5000);
