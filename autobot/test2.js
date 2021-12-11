const testClass = require('./test3Class.js');


const test = testClass.create('BTC','long',100)

console.log(test.getSymbol(), test.getSide(),test.getAmount() );

test.setSymbol('test');
console.log(test.getSymbol(), test.getSide(),test.getAmount() );

