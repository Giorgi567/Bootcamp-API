const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });
const fileUpload = require("express-fileupload");
const morgan = require("morgan");
const errorHandler = require("./middleware/error.js");
const path = require("path");
const connectDB = require("./config/db.js");
const cookieParser = require("cookie-parser");

// ------------------Security Modules -------------------------//
const mongoSanitze = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");

// ------------------Route Files -------------------------//
const bootcampRoutes = require("./routes/bootcamps.routes.js");
const courseRouter = require("./routes/courses.routes.js");
const authRouter = require("./routes/auth.routes.js");
const adminUserRoutes = require("./routes/users.routes.js");
const reveiwsRoutes = require("./routes/reveiws.routes.js");

// app
const app = express();

// Makes API able to communicate with Different domain
app.use(cors());

// Parses data comming from body
app.use(express.json());

// Cookie-Parser
app.use(cookieParser());

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

// Sanitize Data
app.use(mongoSanitze());

// Set Security Headers
app.use(helmet());

// Prevents Cross-Site Scripts in our database
app.use(xss());

// Request Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 min
  max: 100, //amout of request user can make with same IP withint 10 min(windowMs)
});
app.use(limiter);

//Prevents http param polution
app.use(hpp());

// Mount Routers
app.use("/api/v1/bootcamps", bootcampRoutes);
app.use("/api/v1/courses", courseRouter);
app.use("/api/v1/auth/users", adminUserRoutes);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/reviews", reveiwsRoutes);

// eroor handling for commmon errors
app.use(errorHandler);

app.listen(process.env.PORT || 2000, () => {
  console.log(
    `Server running on ${process.env.NODE_ENV} mode on port ${process.env.PORT}`
      .yellow.bold
  );
});
