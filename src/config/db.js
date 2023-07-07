const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_DB_URL);

    console.log(`Mongo DB Connected:${connect.connection.host}`.blue.bold);
  } catch (err) {
    throw err;
  }
};

module.exports = connectDB;
