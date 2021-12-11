const express = require("express");
const router = express.Router();
const helper = require("./db/queryhelper");
// const api = require('./api');

router.get("/test", async function (req, res, next) {
  const result = await helper.get_userinfo(4);
  console.log(result);
});

module.exports = router;
