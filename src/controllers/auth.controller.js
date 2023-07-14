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

  sendTokenResponse(newUser, 200, res);
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

  sendTokenResponse(user, 200, res);
});

// Get Token From Model, Create Cookie And Send Response

const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }
  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, token });
};

// @desc  Get Current  user
// @route Get /api/v1/auth/me
// @access Private

exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});
