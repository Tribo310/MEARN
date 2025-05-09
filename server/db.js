const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      "mongodb+srv://Moojig2005:Moojig2005%23@cluster0.hnzaz1m.mongodb.net/testdb123?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("MongoDB Connected <3");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;
