process.env["NODE_CONFIG_DIR"] = "../config";
const mysql = require("mysql");
const config = require("config");


const pool = mysql.createPool(config.mysql);

const escape = function (query) {
  return mysql.escape(query);
};




// const query = pool.query(qs,(err, result, fields) => {
//   if(err) return err;

//   console.log('results :', result);
//   console.log('fields :', fields);
// });

module.exports = { escape };
