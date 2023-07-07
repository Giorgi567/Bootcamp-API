const express = require("express");
const dotenv = require("dotenv");
const bootcampRoutes = require("./routes/bootcamps.js");
const morgan = require("morgan");
const colors = require("colors");
dotenv.config({ path: "./config/config.env" });
const connectDB = require("./config/db.js");

const app = express();

// Parses data comming from body
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

connectDB();

app.use("/api/v1/bootcamps", bootcampRoutes);

app.listen(process.env.PORT || 2000, () => {
  console.log(
    `Server running on ${process.env.NODE_ENV} mode on port ${process.env.PORT}`
      .yellow.bold
  );
});
