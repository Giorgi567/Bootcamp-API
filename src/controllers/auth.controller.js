const User = require("../models/User.model.js");
const errorResponse = require("../utils/errorResponse.js");
const asyncHandler = require("../middleware/async.js");
const emailSend = require("../utils/send.email.js");
const sendEmail = require("../utils/send.email.js");
const crypto = require("crypto");
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

// @desc  Forgot Password
// @route POST /api/v1/auth/forgotPassword
// @access Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(
      new errorResponse(
        `Can not find the user with this email ${req.body.email}`
      )
    );
  }

  const resetToken = await user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/resetPassword/${resetToken}`;

  const message = `You are reciving this email because you or someone else has requested reset of a password. please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: req.body.email,
      subject: `Password Reset Request`,
      message,
    });
    return res.status(200).json({ success: true, message: "Email Sent" });
  } catch (err) {
    console.log(err);
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;

    await user.save({ validateBeforeSave: false });
    return next(new errorResponse("Email could not be sent", 500));
  }
});

// @desc  Reset Password
// @route Put /api/v1/auth/resetPassword/:resetToken
// @access Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // get hashed token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: resetPasswordToken,
    resetPasswordExpire: { $gte: Date.now() },
  });

  if (!user) {
    return next(new errorResponse("invalid token", 400));
  }

  user.password = req.body.password;
  user.resetPasswordExpire = undefined;
  user.resetPasswordToken = undefined;

  user.save({ runValidators: true });

  sendTokenResponse(user, 200, res);
});
