const mongodb = require("mongodb");

const mongoClient = mongodb.MongoClient;

let db;

const mongoConnect = (callBack) => {
  mongoClient.connect("mongodb+srv://gowri:0j3gMcuksuZcNYDB@nodemongo-spzbc.mongodb.net/shop?retryWrites=true&w=majority")
  .then(result => {
    db = result.db();
    console.log("connected !")
    return callBack();
  })
  .catch(err => console.log(err))

}

const getDb = () => {
  if(db) {
    return db;
  }
  throw "database is not available";
}
exports.mongoConnect = mongoConnect;
exports.getDb = getDb;

// const Sequelize = require("sequelize");

// const sequelize = new Sequelize("flipkart", "root", "gowri07071997", {
//   dialect: "mysql",
//   host: "localhost"
// });

// module.exports = sequelize;


// const mysql = require("mysql2");

// const pool = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   password: "gowri07071997",
//   database: "flipkart"
// });

// module.exports = pool.promise();
