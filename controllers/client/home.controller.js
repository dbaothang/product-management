// controller handle to client home page
module.exports.index = (req, res) => {
  res.render("client/pages/home/index", {
    pageTitle: "Trang Chu",
  });
};
