// 주문 모두 취소
const cancelAllOrder = async (logger, binance, symbol) => {
  // 모든 주문 취소...

  try {
    const result = await binance.futuresOpenOrders();
    if (result.length === 0) {
      // 취소할거 없으면 리턴
      return;
    } else {
      result.forEach((e) => {
        logger.info(
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
        logger.info("모든 주문이 취소 되었습니다.");
      }
    }
  } catch (e) {
    logger.info(e);
  }
};

module.exports = { cancelAllOrder };
