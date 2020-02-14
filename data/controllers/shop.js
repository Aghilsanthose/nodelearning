const Product = require("../models/product");
const Order = require("../models/order");

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products"
      });
    })
    .catch(err => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findByPk(prodId)
    .then(product => {
      res.render("shop/product-detail", {
        pageTitle: product.title,
        product: product,
        path: "shop/product-detail"
      });
    })
    .catch(err => console.log(err));
  //res.redirect('/');
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/"
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then(cart => {
      return cart
        .getProducts()
        .then(products => {
          res.render("shop/cart", {
            path: "/cart",
            pageTitle: "Your Cart",
            products: products
          });
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productid;
  let fetchedCart;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: productId } });
    })
    .then(products => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }
      let newQuantity = 1;
      if (product) {
        const oldQuantity = product.cartItem.quantity;
        console.log(oldQuantity);
        newQuantity = oldQuantity + 1;
        return fetchedCart.addProduct(product, {
          through: { quantity: newQuantity }
        });
      }
      return Product.findByPk(productId)
        .then(product => {
          return fetchedCart.addProduct(product, {
            through: { quantity: newQuantity }
          });
        })
        .catch(err => console.log(err));
    })
    .then(() => res.redirect("/cart"))
    .catch(err => console.log(err));
  // Product.findById(productId, product => {
  //   Cart.addCartProduct(productId, product.price);
  // });
  // console.log(productId);
  // res.redirect("/cart");
};

exports.postDeleteCart = (req, res, next) => {
  const productId = req.body.productId;
  req.user
    .getCart()
    .then(cart => {
      return cart.getProducts({ where: { id: productId } });
    })
    .then(products => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then(result => res.redirect("/cart"))
    .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then(products => {
      return req.user.createOrder().then(order => {
        order.addProducts(
          products.map(product => {
            product.orderItem = { quantity: product.cartItem.quantity };
            return product;
          })
        );
      });
    })
    .then(result => {
      fetchedCart.setProducts(null);
      return res.redirect("/orders");
    })
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  req.user.getOrders({ include: ["products"] }).then(orders => {
    console.log(orders);
    res.render("shop/orders", {
      path: "/orders",
      pageTitle: "Your Orders",
      orders: orders
    });
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout"
  });
};
