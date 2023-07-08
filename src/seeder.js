// IMPORTANT: Only use this file to import data from _data folder into your mongo database incase my current database
// gets closed or something. and make sure to modify "MONGO_DB_URL" to your mongoDB url.
// To import data type "node seeder -i" in Terminal
// To delete data type "node seeder -d" in Terminal
// MAKE SURE THAT YOU ARE INSIDE OF A SRC DIRECTORY

const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dontenv = require("dotenv");
const Bootcamp = require("./models/bootcamp.model");
dontenv.config({ path: "./config/config.env" });

mongoose.connect(process.env.MONGO_DB_URL);

const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, `utf-8`)
);

const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    console.log(`${bootcamps.length} documents imported`.green);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    console.log(`Data Destroyed`.red);
    process.exit();
  } catch (err) {
    console.err(err);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
