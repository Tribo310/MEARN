const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  password: String,
  imgUrl: String,
  userId: String,
});

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
