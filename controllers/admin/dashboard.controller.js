// controller handle with admin dashboard page
module.exports.dashboard = (req, res) => {
  res.render("admin/pages/dashboard/index", {
    pageTitle: "Trang tong quan",
  });
};
