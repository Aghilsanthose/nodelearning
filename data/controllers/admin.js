const Product = require("../models/product");
const mongodb = require("mongodb");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(title, imageUrl, description, price, null, req.user._id);
  product.save()
  .then((result) => {
    console.log(result);
    res.redirect("/products")
  })
  .catch(err => console.log(err));;

  // const product = new Product(null, title, imageUrl, description, price);
  // product
  //   .save()
  //   .then(() => res.redirect("/"))
  //   .catch(err => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  const editmode = req.query.edit;
  if (!editmode) {
    return res.redirect("/");
  }
  const productId = req.params.productId;
  Product.findById(productId)
 .then(product => {
    res.render("admin/edit-product", {
      pageTitle: "edit Product",
      path: "/admin/edit-product",
      editing: true,
      product: product
    });
  });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteById(prodId)
    .then(() => res.redirect("/products"))
    .catch(err => console.log(err));
};

exports.showEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  const product = new Product(updatedTitle, updatedImageUrl, updatedDesc, updatedPrice, prodId, req.user._id);
  product.save()
  // Product.findByPk(prodId)
  //   .then(product => {
  //     (product.title = updatedTitle),
  //       (product.price = updatedPrice),
  //       (product.imageurl = updatedImageUrl),
  //       (product.description = updatedDesc);
  //     return product.save();
  //   })
    .then(result => {
      res.redirect("/admin/products");
    })
    .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products"
      });
    })
    .catch(err => console.log(err));
};
