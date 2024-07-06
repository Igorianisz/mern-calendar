const mongoose = require("mongoose");

const dbconnection = async () => {
  try {
    mongoose.connect(process.env.DB_CONNECTION_STRING);
    console.log("logged db");
  } catch (err) {
    console.log(err);
    throw new Error("Error in connecting to database");
  }
};

module.exports = dbconnection;
