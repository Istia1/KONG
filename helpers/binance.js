process.env["NODE_CONFIG_DIR"] = "../config";
const Binance = require("node-binance-api");
const config = require("config");

const binanceOptions = {};

if (config.get("mode") === "live") {
  binanceOptions.APIKEY = config.get("binance.live.apiKey");
  binanceOptions.APISECRET = config.get("binance.live.secretKey");
  binanceOptions.hedgeMode = true;
} else {
  binanceOptions.BASE = "https://testnet.binance.vision";
  binanceOptions.APIKEY = config.get("binance.test.apiKey");
  binanceOptions.APISECRET = config.get("binance.test.secretKey");
}

const binance = Binance(binanceOptions);

module.exports = binance;
