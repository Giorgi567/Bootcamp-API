const express = require("express");
const dotenv = require("dotenv");
const fileUpload = require("express-fileupload");
const morgan = require("morgan");
const errorHandler = require("./middleware/error.js");
const path = require("path");
const connectDB = require("./config/db.js");
dotenv.config({ path: "./config/config.env" });

// ------------------Route Files -------------------------//
const bootcampRoutes = require("./routes/bootcamps.routes.js");
const courseRouter = require("./routes/courses.routes.js");
const authRouter = require("./routes/auth.routes.js");

// app
const app = express();

// Parses data comming from body
app.use(express.json());

// Getting request type url statuscode and time it took
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// File Upload
app.use(fileUpload());

// Setting folder to static
app.use(express.static(path.join(__dirname, "public")));

// DataBase Connect
connectDB();

// Mount Routers
app.use("/api/v1/bootcamps", bootcampRoutes);
app.use("/api/v1/courses", courseRouter);
app.use("/api/v1/auth", authRouter);

// eroor handling for commmon errors
app.use(errorHandler);

app.listen(process.env.PORT || 2000, () => {
  console.log(
    `Server running on ${process.env.NODE_ENV} mode on port ${process.env.PORT}`
      .yellow.bold
  );
});
