const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const mongoConnect = require("./util/database").mongoConnect;
const User = require("./models/users")

const errorController = require("./controllers/error");

const app = express();

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("5e5a57646fe10b2f80d2796d")
    .then(user => {
      req.user = new User(user.name, user.email, user.cart, user._id);
      next();
    })
    .catch(err => console.log(err));
  //sequelize usage
  // User.findByPk(1)
  //   .then(user => {
  //     req.user = user;
  //     next();
  //   })
  //   .catch(err => console.log(err));
  //next();
});
//app.get('/favicon.ico', (req, res) => res.status(204));
 app.use("/admin", adminRoutes);
 app.use(shopRoutes);

mongoConnect(() => {
  app.listen(3000);
});

app.use(errorController.get404);




