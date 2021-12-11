const axios = require("axios");
process.env["NODE_CONFIG_DIR"] = "../config";
const config = require("config");
const logger = require("logger");

/**
 * Send slack message
 *
 * @param {String} text
 */
const sendMessage = (text) => {
  if (config.get("slack.enabled") !== true) {
    return Promise.resolve({});
  }

  return axios.post(config.get("slack.webhookUrl"), {
    channel: config.get("slack.channel"),
    username: `${config.get("slack.username")} - ${config.get("mode")}`,
    type: "mrkdwn",
    text,
  });
};

module.exports = { sendMessage };
