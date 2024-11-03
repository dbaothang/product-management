const Product = require("../../models/product.model");
const systemConfig = require("./../../config/system");

const filterStatusHelper = require("./../../helpers/filterStatus");
const searchHelper = require("./../../helpers/search");
const paginationHelper = require("./../../helpers/pagination");
// [GET] /admin/products
module.exports.index = async (req, res) => {
  const filterStatus = filterStatusHelper(req.query);

  // default infor and check status product
  let find = {
    deleted: false,
  };
  if (req.query.status) {
    find.status = req.query.status;
  }

  const objectSearch = searchHelper(req.query);
  if (objectSearch.regax) {
    find.title = objectSearch.regax;
  }

  //pagination
  const countProduct = await Product.countDocuments(find);
  let objectPagination = paginationHelper(
    {
      limitItems: 4,
      currentPage: 1,
    },
    req.query,
    countProduct
  );

  //display products
  const products = await Product.find(find)
    .sort({ position: "desc" })
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);
  res.render("admin/pages/products/index", {
    pageTitle: "Danh sach san pham",
    products: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};

//[PATCH] /admin/product/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  console.log(req.params);
  const status = req.params.status;
  const id = req.params.id;

  await Product.updateOne({ _id: id }, { status: status });

  req.flash("success", "Cập nhật trạng thái thành công");

  res.redirect("back");
};

//[PATCH] /admin/product/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(",");

  console.log(ids);

  switch (type) {
    case "active":
      await Product.updateMany({ _id: { $in: ids } }, { status: "active" });
      req.flash(
        "success",
        `Cập nhật trạng thái ${ids.length} sản phẩm thành công`
      );
      break;

    case "inactive":
      await Product.updateMany({ _id: { $in: ids } }, { status: "inactive" });
      req.flash(
        "success",
        `Cập nhật trạng thái ${ids.length} sản phẩm thành công`
      );
      break;

    case "delete-all":
      await Product.updateMany(
        { _id: { $in: ids } },
        { deleted: true, deletedAt: new Date() }
      );
      req.flash("success", `Xóa ${ids.length} sản phẩm thành công`);
      break;

    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);
        await Product.updateOne({ _id: id }, { position: position });
      }
      req.flash("success", `Đổi vị trí ${ids.length} sản phẩm thành công`);
      break;

    default:
      break;
  }

  res.redirect("back");
};

//[DELETE] /admin/product/deleted/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;
  // await Product.deleteOne({ _id: id });  [DELETE PERMANENTLY]
  await Product.updateOne({ _id: id }, { deleted: true });
  req.flash("success", "Xóa sản phẩm thành công");
  res.redirect("back");
};

//[GET] /admin/product/create
module.exports.create = async (req, res) => {
  res.render("admin/pages/products/create", {
    pageTitle: "Thêm mới sản phẩm",
  });
};

//[POST] /admin/product/createPost
module.exports.createPost = async (req, res) => {
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);
  if (req.body.position == "") {
    const countProducts = await Product.countDocuments();
    req.body.position = countProducts + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }
  if (req.file) {
    req.body.thumbnail = `/uploads/${req.file.filename}`;
  }

  const product = new Product(req.body);
  await product.save();
  res.redirect(`${systemConfig.prefixAdmin}/product`);
};

//[GET] /admin/product/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };
    const product = await Product.findOne(find);
    res.render("admin/pages/products/edit", {
      pageTitle: "Chỉnh sửa sản phẩm",
      product: product,
    });
  } catch (error) {
    req.flash("error", "sản phẩm không tìm thấy");
    res.redirect(`${systemConfig.prefixAdmin}/product`);
  }
};

//[PATCH] /admin/product/edit/:id
module.exports.editPatch = async (req, res) => {
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);
  req.body.position = parseInt(req.body.position);
  if (req.file) {
    req.body.thumbnail = `/uploads/${req.file.filename}`;
  }

  try {
    await Product.updateOne({ _id: req.params.id }, req.body);
    req.flash("success", "sản phẩm cập nhật thành công");
  } catch (error) {
    req.flash("error", "sản phẩm cập nhật không thành công");
  }
  res.redirect("back");
};

//[GET] /admin/product/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };
    const product = await Product.findOne(find);
    res.render("admin/pages/products/detail", {
      pageTitle: product.title,
      product: product,
    });
    // console.log(product);
  } catch (error) {
    req.flash("error", "sản phẩm không tìm thấy");
    res.redirect(`${systemConfig.prefixAdmin}/product`);
  }
};
