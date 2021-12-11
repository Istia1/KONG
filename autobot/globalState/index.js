// #################################################################
let mainLoopLogic;
let loopGetMA;
let current_market_price = 0;
let ma_price = 0;
let isOnOrder = false;
let dividedBuyNum = 10;
let avgPrice = 0;
let nextBuyingPrice = 0;
let positionMoney = 0; // 총 구매 금액(total price)
let position = "";
let finishPrice = 0;
let buyingCount = 0;
let quantity = 0;
let stop = false;
let lastOrderTime = Date.now();
let leverage = 2;
let isFinishedOrderRequest = true;
// #################################################################

// #################################################################
const TARGET_SYMBOL = "ETHUSDT";
const long_diff_price_ma_ratio = 0.17;
const short_diff_price_ma_ratio = 0.17;
const finish_short_position_ratio = 0.2 / 100;
const finish_long_position_ratio = 0.2 / 100;
const add_more_buying_ratio = 0.17 / 100;
const deley_after_sell = 4 * 60 * 1000;
const using_money = 100;
const minimum_order_price = 0.002;
const toFixed_price = 3; // 소수점 몇자리 까지 ?
const additional_price = 0.5;
// #################################################################

// module.exports = { mainLoopLogic,loop };
