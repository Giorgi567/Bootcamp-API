const jwt = require("jsonwebtoken");
const errorResponse = require("../utils/errorResponse");
const User = require("../models/User.model");
const asyncHandlerMiddleWare = require("./async");

exports.protect = asyncHandlerMiddleWare(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new errorResponse("Not authorized to this route", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);

    next();
  } catch (error) {
    return next(new errorResponse("Not authorized to this route", 401));
  }
});

exports.Authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new errorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};
