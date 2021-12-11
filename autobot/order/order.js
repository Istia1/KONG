// 현재 활성된 주문들 ... ?
const getActivatedOrder = async (binance, symbol) => {
  const result = await binance.futuresOpenOrders();
  if (result.length === 0) {
    // 취소할거 없으면 리턴
    return false;
  } else {
    return true;
  }
};

const getPositionedOrder = async (binance, symbol) => {
  const res = await binance.futuresPositionRisk();
  if (res.length === 0) {
    return;
  }
  const resultObj = {};
  res.forEach((element) => {
    if (
      element.symbol === symbol.toUpperCase() &&
      parseFloat(element.positionAmt) != 0
    ) {
      resultObj.positionAmt = Math.abs(parseFloat(element.positionAmt));
      resultObj.avgPrice = parseFloat(element.entryPrice);
    }
  });
  return resultObj;
};

module.exports = { getActivatedOrder, getPositionedOrder };
