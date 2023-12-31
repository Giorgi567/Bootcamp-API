const errorResponse = require("../utils/errorResponse");

const errorHandelr = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  if (err.name === "CastError") {
    const message = `Resource not found with the id of ${err.value}`;
    error = new errorResponse(message, 404);
  }

  if (err.code === 11000) {
    const message = `Duplicate filed value entered`;
    error = new errorResponse(message, 400);
  }

  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);

    error = new errorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || `Server Error`,
  });
  next();
};

module.exports = errorHandelr;
