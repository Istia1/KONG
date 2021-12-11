const helpers = require("../helpers/index.js");
const global = require("./globalState/index.js");
const subscribe = require("./subscribe/index.js");
const indicator = require("./indicator/index.js");
const strategy = require("./strategy/index.js");
// const order = require("./order/index.js");

const moment = require("moment");
const symbol = "ethusdt";

const startAutoBot = async () => {
  // const query = "insert into user(user_id, is_admin, ip_address,name ) values ('aflhzv',1,'127.0.0.1','kkong');"

  // const res = helpers.mysql.query(query,() => { 

  // });
  // console.log(res);
  
  console.info( await helpers.binance.futuresAccount() );
  // const obj = await order.getPositionedOrder(helpers.binance, symbol);
  // global.quantity = obj.positionAmt;
  // global.avgPrice = obj.avgPrice;
  // global.positionMoney = global.quantity * global.avgPrice;
  // console.log(global.positionMoney);
  // helpers.slack.sendMessage("🌸 All Position Closed");
  // order.cancelAllOrder(helpers.logger, helpers.binance, symbol);
  // const res = await helpers.binance.futuresPositionRisk();
  // const resultObj = {};
  // res.forEach((element) => {
  //   if (
  //     element.symbol === symbol.toUpperCase() &&
  //     parseFloat(element.positionAmt) != 0
  //   ) {
  //     resultObj.positionAmt = element.positionAmt;
  //     resultObj.avgPrice = element.entryPrice;
  //   }
  // });
  // console.log(resultObj);
  // helpers.binance.websockets.userFutureData(balance_update, execution_update);
  // const res = await helpers.binance.exchangeInfo();
  // res.symbols.forEach((e) => {
  //   if (e.symbol === "ETHUSDT") {
  //     console.log(e);
  //   }
  // });
  // const res = await helpers.binance.futuresBuy(symbol, 0.002, 3907, {
  //   positionSide: "LONG",
  // });
  // console.log(res);
  // console.log(new Date().getTime());
  // const result = await helpers.binance.futuresAccount();
  // console.log(result);
  // if (side == "LONG")
  //   order = await binance.futuresMarketSell(obj.symbol, amount, {
  //     reduceOnly: true,
  //   });
  // else
  //   order = await binance.futuresMarketBuy(obj.symbol, amount, {
  //     reduceOnly: true,
  //   });
  /**
   * {
      eventType: 'ACCOUNT_UPDATE',
      eventTime: 1634447705682,
      transaction: 1634447705676,
      updateData: {
        eventReasonType: 'ORDER',
        balances: [ [Object] ],
        positions: [ [Object], [Object] ]
      }
    }
   * 
   */
  // const res1 = await helpers.binance.futuresAccount();
  // const {
  //   totalInitialMargin, // 포지션에 들어가 있는 금액
  //   totalWalletBalance, // 총 내 재산
  //   totalUnrealizedProfit, // 실현 이익(따고있는 금액) ..
  //   totalMarginBalance, // 재산 + 실현 이익
  //   availableBalance, // 남은 금액 내가 사용할 수 있는
  // } = res;
  // console.log(res1);
  // console.log(
  //   moment.utc(moment()).add(9, "hours").local().format("YYYY/MM/DD HH:mm:ss")
  // );
  /**
   * {
      "clientOrderId": "testOrder",
      "cumQty": "0",
      "cumQuote": "0",
      "executedQty": "0",
      "orderId": 22542179,
      "avgPrice": "0.00000",    // 평단가 
      "origQty": "10",
      "price": "0",             // 구매 금액 
      "reduceOnly": false,
      "side": "BUY",            // 구매
      "positionSide": "SHORT",  // position
      "status": "NEW",
      "stopPrice": "9300",        // please ignore when order type is TRAILING_STOP_MARKET
      "closePosition": false,   // if Close-All
      "symbol": "BTCUSDT",
      "timeInForce": "GTC",
      "type": "TRAILING_STOP_MARKET",
      "origType": "TRAILING_STOP_MARKET",
      "activatePrice": "9020",    // activation price, only return with TRAILING_STOP_MARKET order
      "priceRate": "0.3",         // callback rate, only return with TRAILING_STOP_MARKET order
      "updateTime": 1566818724722,
      "workingType": "CONTRACT_PRICE",
      "priceProtect": false            // if conditional order trigger is protected   
    }
   * 
   */
  // futuresOrderStatus => 현재 걸어놓은 주문을 알려줌
  /**
   * {
        "avgPrice": "0.00000",
        "clientOrderId": "abc",
        "cumQuote": "0",
        "executedQty": "0",
        "orderId": 1917641,
        "origQty": "0.40",
        "origType": "TRAILING_STOP_MARKET",
        "price": "0",
        "reduceOnly": false,
        "side": "BUY",
        "positionSide": "SHORT",
        "status": "NEW",
        "stopPrice": "9300",                // please ignore when order type is TRAILING_STOP_MARKET
        "closePosition": false,   // if Close-All
        "symbol": "BTCUSDT",
        "time": 1579276756075,              // order time
        "timeInForce": "GTC",
        "type": "TRAILING_STOP_MARKET",
        "activatePrice": "9020",            // activation price, only return with TRAILING_STOP_MARKET order
        "priceRate": "0.3",                 // callback rate, only return with TRAILING_STOP_MARKET order
        "updateTime": 1579276756075,        // update time
        "workingType": "CONTRACT_PRICE",
        "priceProtect": false            // if conditional order trigger is protected   
    }
   * 
   */
  // 레버리지 조절
  // const res0 = await helpers.binance.futuresLeverage( symbol, leverage, params = {})
  // 판매 주문 테스트
  // 거래 완료 시 Stream으로 알람오는거 테스트
  // subscribe.userOrderDataStream(helpers.logger, helpers.binance);
  // 내 현재 잔고 계좌 얼마인지 테스트
  // const res = await helpers.binance.futuresAccount();
  // console.log(res.availableBalance);
  // console.log(test);
  // console.log(moment.utc(1633439581004).local().format("YYYY/MM/DD HH:mm:ss"));
  /**
   *       
    "feeTier": 0,       // account commisssion tier 
    "canTrade": true,   // if can trade
    "canDeposit": true,     // if can transfer in asset
    "canWithdraw": true,    // if can transfer out asset
    "updateTime": 0,
    "totalInitialMargin": "0.00000000",    // total initial margin required with current mark price (useless with isolated positions), only for USDT asset
    "totalMaintMargin": "0.00000000",     // total maintenance margin required, only for USDT asset
    "totalWalletBalance": "23.72469206",     // total wallet balance, only for USDT asset
    "totalUnrealizedProfit": "0.00000000",   // total unrealized profit, only for USDT asset
    "totalMarginBalance": "23.72469206",     // total margin balance, only for USDT asset
    "totalPositionInitialMargin": "0.00000000",    // initial margin required for positions with current mark price, only for USDT asset
    "totalOpenOrderInitialMargin": "0.00000000",   // initial margin required for open orders with current mark price, only for USDT asset
    "totalCrossWalletBalance": "23.72469206",      // crossed wallet balance, only for USDT asset
    "totalCrossUnPnl": "0.00000000",      // unrealized profit of crossed positions, only for USDT asset
    "availableBalance": "23.72469206",       // available balance, only for USDT asset
    "maxWithdrawAmount": "23.72469206"     // maximum amount for transfer out, only for USDT asset
    "assets": [
        {
            "asset": "USDT",            // asset name
            "walletBalance": "23.72469206",      // wallet balance
            "unrealizedProfit": "0.00000000",    // unrealized profit
            "marginBalance": "23.72469206",      // margin balance
            "maintMargin": "0.00000000",        // maintenance margin required
            "initialMargin": "0.00000000",    // total initial margin required with current mark price 
            "positionInitialMargin": "0.00000000",    //initial margin required for positions with current mark price
            "openOrderInitialMargin": "0.00000000",   // initial margin required for open orders with current mark price
            "crossWalletBalance": "23.72469206",      // crossed wallet balance
            "crossUnPnl": "0.00000000"       // unrealized profit of crossed positions
            "availableBalance": "23.72469206",       // available balance
            "maxWithdrawAmount": "23.72469206",     // maximum amount for transfer out
            "marginAvailable": true,    // whether the asset can be used as margin in Multi-Assets mode
            "updateTime": 1625474304765 // last update time 
        },
      ],
    "positions": [  // positions of all symbols in the market are returned
        // only "BOTH" positions will be returned with One-way mode
        // only "LONG" and "SHORT" positions will be returned with Hedge mode
        {
            "symbol": "BTCUSDT",    // symbol name
            "initialMargin": "0",   // initial margin required with current mark price 
            "maintMargin": "0",     // maintenance margin required
            "unrealizedProfit": "0.00000000",  // unrealized profit
            "positionInitialMargin": "0",      // initial margin required for positions with current mark price
            "openOrderInitialMargin": "0",     // initial margin required for open orders with current mark price
            "leverage": "100",      // current initial leverage
            "isolated": true,       // if the position is isolated
            "entryPrice": "0.00000",    // average entry price
            "maxNotional": "250000",    // maximum available notional with current leverage
            "positionSide": "BOTH",     // position side
            "positionAmt": "0",         // position amount
            "updateTime": 0           // last update time
        }
    ]
}
   */
};

function balance_update(data) {
  console.log("### balance_update ###");
  console.log(data);
  console.log(
    "Update 시간 : ",
    moment
      .utc(data.transaction)
      .add(9, "hours")
      .local()
      .format("YYYY/MM/DD HH:mm:ss")
  );
  console.log("@@@@ updateData.balances @@@@");
  console.log(data.updateData.balances);

  console.log("@@@@ updateData.positions @@@@");
  console.log(data.updateData.positions);
}

function execution_update(data) {
  global.isFinishedOrderRequest = true;
  console.log("### execution_update ###");
  console.log(data);
  console.log(
    "Update 시간 : ",
    moment
      .utc(data.transaction)
      .add(9, "hours")
      .local()
      .format("YYYY/MM/DD HH:mm:ss")
  );
  console.log("@@@@ updateData.balances @@@@");
  console.log(data.updateData.balances);

  console.log("@@@@ updateData.positions @@@@");
  console.log(data.updateData.positions);
}

/**
 * {
  eventType: 'ACCOUNT_UPDATE',
  eventTime: 1634448447921,
  transaction: 1634448447916,
  updateData: {
    eventReasonType: 'ORDER',
    balances: [ [Object] ],
    positions: [ [Object], [Object], [Object] ]
  }
}

@@@@ updateData.balances @@@@
[
  {
    asset: 'USDT',
    walletBalance: '38.25158160',
    crossWalletBalance: '38.25158160',
    balanceChange: '0'
  }
]

@@@@ updateData.positions @@@@
[
  {
    symbol: 'ETHUSDT',
    positionAmount: '0',
    entryPrice: '0.00000',
    accumulatedRealized: '98.82561977',
    unrealizedPnL: '0',
    marginType: 'cross',
    isolatedWallet: '0',
    positionSide: 'BOTH'
  },
  {
    symbol: 'ETHUSDT',
    positionAmount: '0.002',
    entryPrice: '3870.59000',
    accumulatedRealized: '-0.00272000',
    unrealizedPnL: '-0.00087079',
    marginType: 'cross',
    isolatedWallet: '0',
    positionSide: 'LONG'
  },
  {
    symbol: 'ETHUSDT',
    positionAmount: '0',
    entryPrice: '0.00000',
    accumulatedRealized: '-0.04400000',
    unrealizedPnL: '0',
    marginType: 'cross',
    isolatedWallet: '0',
    positionSide: 'SHORT'
  }
]

 */

const startInitValue = () => {
  // init price
  global.leverage = 2;
  global.mainLoopLogic;
  global.loopGetMA;
  global.current_market_price = 100;
  global.ma_price = 0;
  global.isOnOrder = false;
  global.dividedBuyNum = 10;
  global.avgPrice = 0;
  global.nextBuyingPrice = 0;
  global.positionMoney = 0; // 총 구매 금액(total price)
  global.position = "";
  global.finishPrice = 0;
  global.buyingCount = 0;
  global.quantity = 0;
  global.stop = false;
  global.lastOrderTime = Date.now();
  global.long_diff_price_ma_ratio = 0.16;
  global.short_diff_price_ma_ratio = 0.16;
  global.finish_short_position_ratio = 0.15 / 100;
  global.finish_long_position_ratio = 0.15 / 100;
  global.add_more_buying_ratio = 0.19 / 100;
  global.deley_after_sell = 4 * 60 * 1000;
  global.using_money = 100;
};

startAutoBot();
