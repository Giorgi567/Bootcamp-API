const User = require("../models/User.model.js");
const errorResponse = require("../utils/errorResponse.js");
const asyncHandler = require("../middleware/async.js");

// @desc  Registrers the user
// @route Post /api/v1/auth
// @access Public
exports.registrer = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const newUser = await User.create({
    name: name,
    email: email,
    password: password,
    role: role,
  });

  const token = newUser.getSignedJwtToken();
  res.status(200).json({
    success: true,
    token,
  });
});

// @desc  login the user
// @route Post /api/v1/auth/login
// @access Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new errorResponse("Please provide email and password", 400));
  }

  const user = await User.findOne({ email: email }).select("+password");
  console.log(user);
  if (!user) {
    return next(new errorResponse(`invalid credentials`, 401));
  }

  const isMatch = await user.comparePasswods(password);

  if (!isMatch) {
    return next(new errorResponse(`invalid credentials`, 401));
  }

  const token = user.getSignedJwtToken();
  res.status(200).json({
    success: true,
    token,
  });
});
