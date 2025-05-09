const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema({
  placeName: String,
  placeDescription: String,
  placeImgUrl: String,
  placeAddress: String,
  createdUserID: String, // Хэрэглэгчийн ID холбох
});

const placeModel = mongoose.model("Place", placeSchema);
module.exports = placeModel;
