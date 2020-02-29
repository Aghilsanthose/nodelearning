const getDb = require("../util/database").getDb;
const mongodb = require("mongodb");
class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart;
    this._id = id
  }

  save() {
    const db = getDb();
    return db.collection("user").insertOne(this);
  }

  static findById(userId) {
    const db = getDb();
    return db.collection("user")
    .findOne({_id : new mongodb.ObjectId(userId)})
    .then(user => {
      return user;
    })
    .catch(err => console.log(err))
  }

 addToCart(product) {
   let updatedCart;
   let quantity = 1;
   if (typeof this.cart === 'undefined' || this.cart === null) {
    updatedCart = {items : [{id :product._id , quantity : quantity}]} 
   }
   else {
      const itemExist = this.cart.items.findIndex(obj =>{
        return obj.id.toString() === product._id.toString()
      });
  
      let updatedCartItems = [...this.cart.items]
      if(itemExist>=0) {
        quantity = this.cart.items[itemExist].quantity + quantity;
        updatedCartItems[itemExist].quantity = quantity
      } else {
      updatedCartItems.push({id :new mongodb.ObjectId(product._id) , quantity : quantity});
      }
     updatedCart = {
       items : updatedCartItems
     }
   }
       
   const db = getDb();
   return db.collection("user").updateOne({_id : new mongodb.ObjectId(this._id)}, 
    {$set : {cart : updatedCart} })

  }

  getCart() {
    const db = getDb();
    const productIds = this.cart.items.map(i => {
      return i.id;
    })
    return db.collection("product")
    .find({_id : {$in : productIds}})
    .toArray()
    .then(products => {
     return products.map(product => {
       return {...product, 
        quantity: this.cart.items.
        find(c => {
          return c.id.toString() === product._id.toString();
        })
        .quantity
       }
      })
    }).catch (err => console.log(err))
  }

  deleteCartItem(productId) {
    const  updatedCartItems = this.cart.items.filter(item => {
      return item.id.toString() !== productId.toString();
    });
    const db = getDb();
    return db.collection("user").updateOne({_id : new mongodb.ObjectId(this._id)}, 
    {$set : {cart : {items: updatedCartItems}} })
  }

  addOrder() {
    const db = getDb();
    return this.getCart().then(products => {
      const orders = {
        items: products,
        user :{
          name : this.name,
          id : this._id
        } 
               
      }
      return db.collection("orders").insertOne(orders)
    }).then(result => {
      this.cart.items = [];
     return  db.collection("user").updateOne({_id : new mongodb.ObjectId(this._id)}, 
      {$set : {cart : this.cart }
    })
  }).catch(err => console.log(err))
  }    

getOrders() {
  const db = getDb();
  return db.collection("orders")
  .find({ "user.id": new mongodb.ObjectId(this._id)})
  .toArray()
  .then(result => {
    console.log(result)
    return result;
  }
     )
  .catch(err => console.log(err))
}
}



// const Sequelize = require("sequelize");
// const sequelize = require("../util/database");

// const User = sequelize.define("users", {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     primaryKey: true,
//     allowNull: false
//   },
//   name: {
//     type: Sequelize.STRING,
//     allowNull: false
//   },
//   email: {
//     type: Sequelize.STRING,
//     allowNull: false
//   }
// });

module.exports = User;
