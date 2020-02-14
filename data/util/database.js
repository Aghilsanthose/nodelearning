const Sequelize = require("sequelize");

const sequelize = new Sequelize("flipkart", "root", "gowri07071997", {
  dialect: "mysql",
  host: "localhost"
});

module.exports = sequelize;
// const mysql = require("mysql2");

// const pool = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   password: "gowri07071997",
//   database: "flipkart"
// });

// module.exports = pool.promise();
