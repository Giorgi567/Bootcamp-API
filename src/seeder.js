// IMPORTANT: Only use this file to import data from _data folder into your mongo database incase my current database
// gets closed or something. and make sure to modify "MONGO_DB_URL" to your mongoDB url.
// To import data type "node seeder -i" in Terminal
// To delete data type "node seeder -d" in Terminal
// MAKE SURE THAT YOU ARE INSIDE OF A SRC DIRECTORY
// If while importing there was timeoute errors just comment out 28 and 29-th lines of code and import it one by one instead of all at once

const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dontenv = require("dotenv");
const Bootcamp = require("./models/bootcamp.model");
const Course = require("./models/course.model");
const User = require("./models/User.model");
dontenv.config({ path: "./config/config.env" });

mongoose.connect(process.env.MONGO_DB_URL);

const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, `utf-8`)
);

const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, `utf-8`)
);

const Users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, `utf-8`)
);

const importData = async () => {
  try {
    // await Bootcamp.create(bootcamps);
    await Course.create(courses);
    await User.create(Users);

    console.log(` bootcamp documents imported`.green);
    console.log(` course documents imported`.green);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit();
  }
};

const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    await User.deleteMany();

    console.log(`Data Destroyed`.red);
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit();
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
