const Product = require("../../models/product.model");
// controller handle to client product page
module.exports.index = async (req, res) => {
  const products = await Product.find({
    status: "active",
    deleted: false,
  }).sort({ position: "desc" });

  //create a var of product information after change
  const newProducts = products.map((item) => {
    item.priceNew = (
      (item.price * (100 - item.discountPercentage)) /
      100
    ).toFixed(0);
    return item;
  });

  console.log(newProducts);
  // controller handle client product page
  res.render("client/pages/products/index", {
    pageTitle: "Trang san pham",
    products: newProducts,
  });
};

//[GET] /product/:slug
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      slug: req.params.slug,
      status: "active",
    };
    const product = await Product.findOne(find);
    res.render("client/pages/products/detail", {
      pageTitle: product.title,
      product: product,
    });
    // console.log(product);
  } catch (error) {
    res.redirect(`/product`);
  }
};
