const express = require("express");
const dotenv = require("dotenv");
const bootcampRoutes = require("./routes/bootcamps.routes.js");
const courseRouter = require("./routes/courses.routes.js");
const morgan = require("morgan");
const errorHandler = require("./middleware/error.js");

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
app.use("/api/v1/courses", courseRouter);

app.use(errorHandler);

app.listen(process.env.PORT || 2000, () => {
  console.log(
    `Server running on ${process.env.NODE_ENV} mode on port ${process.env.PORT}`
      .yellow.bold
  );
});
