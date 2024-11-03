const mongoose = require("mongoose");
//start up mongoose
module.exports.connect = async () => {
  try {
    mongoose.connect(process.env.MONGO_URL);
    console.log("connect success");
  } catch (error) {
    console.log("connect error");
  }
};
