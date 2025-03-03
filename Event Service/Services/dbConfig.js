const mongoose = require("mongoose");

const connectDB = (url) => {
  try {
    console.log("Connecting to the database...");
    return mongoose.connect(url);
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error;
  }
};

module.exports = connectDB;
