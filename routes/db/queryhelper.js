const mysql = require("mysql");
const config = require("../config/db_config.json");

const pool = mysql.createPool(config);

const escape = function (query) {
  return mysql.escape(query);
};

const insert = function (query) {
  return new Promise((res, rej) => {
    console.log("### INSERT ###");
    console.log(query);
    console.log("##############");
    pool.query(query, (err, row) => {
      if (err) {
        rej(err);
      } else {
        res("ok");
      }
    });
  });
};

const get_userinfo = function (id) {
  console.log(`##### GET_USERINFO - id : ${id} #####`);
  return new Promise((res, rej) => {
    const query = `select * from user where user_id = ${id}`;
    pool.query(query, (err, row) => {
      if (err) {
        rej(err);
      } else {
        res(row[0]);
      }
    });
  });
};

const get_data = function (query) {
  console.log("##### GET_DATA #####");
  console.log(query);
  console.log("##############");
  return new Promise((res, rej) => {
    pool.query(query, (err, row) => {
      if (err) {
        console.log(err);
        rej(err);
      } else if (_.isEmpty(row)) {
        res("no data");
      } else {
        res(row);
      }
    });
  });
};

module.exports = {
  escape,
  insert,
  get_userinfo,
  get_data,
};
