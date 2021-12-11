module.exports = class Position {
  constructor(symbol, side, amount) {
    this.symbol = symbol;
    this.side = side;
    this.amount = amount;
  }
  getSymbol() {
    return this.symbol;
  }
  getSide() {
    return this.side;
  }
  getAmount() {
    return this.amount;
  }
  setSymbol(s) {
    this.symbol = s;
  }
  setSide(s) {
    this.side = s;
  }
  setAmount(amount) {
    this.amount= amount;
  }
  static create(symbol, side,amount) {
    return new Position(symbol, side,amount);
  }
}