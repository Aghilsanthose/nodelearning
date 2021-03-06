const mongodb = require("mongodb");
const getDb = require("./../util/database").getDb;

class Product {
  constructor(title, imageUrl, description, price, id, userId) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
    this._id = id ? new mongodb.ObjectId(id) : null ;
    this.userId = userId;
  }
  save() {
    const db = getDb();
    let dbOp;
    if(this._id) {
      dbOp =  db.collection("product").updateOne({ _id :this._id}, {$set : this});
    } else {
      dbOp =  db.collection("product").insertOne(this);
    }
    return dbOp
    .then(result => console.log(result))
    .catch(err => console.log(err))
  }

 static fetchAll() {
    const db = getDb();
    return db.collection("product").find().toArray().then(products => {
      return products;
    }).catch(err => console.log(err))
  }

  static findById(prodId) {
    const db = getDb();
    return db.collection("product")
    .find({_id : new mongodb.ObjectId(prodId)})
    .next()
    .then(product =>{
      console.log(product);
      return product;
    })
    .catch(err => console.log(err))
  }

  static deleteById(prodId){
    const db = getDb();
    return db.collection("product")
    .deleteOne({_id : new mongodb.ObjectId(prodId)})
    .then(() => console.log("Deleted"))
    .catch(err => console.log(err))
  }
 
}
// const Sequelize = require("sequelize");

// const sequelize = require("../util/database");

// const Product = sequelize.define("product", {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true
//   },

//   title: {
//     type: Sequelize.STRING,
//     allowNull: false
//   },

//   imageurl: {
//     type: Sequelize.STRING,
//     allowNull: false
//   },

//   price: {
//     type: Sequelize.DOUBLE,
//     allowNull: false
//   },

//   description: {
//     type: Sequelize.STRING,
//     allowNull: false
//   }
// });

module.exports = Product;
