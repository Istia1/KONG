const bunyan = require("bunyan");

process.env.TZ = "UTC";

const logger = bunyan.createLogger({
  name: "binance-api",
});
logger.info({ NODE_ENV: process.env.NODE_ENV }, "API logger loaded");

module.exports = logger;
