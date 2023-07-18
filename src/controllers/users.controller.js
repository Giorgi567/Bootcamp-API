const User = require("../models/User.model");
const asyncHandler = require("../middleware/async");
const errorResponse = require("../utils/errorResponse.js");

// @desc  Get All Users
// @route Get /api/v1/auth/users
// @access Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc  Get User
// @route Get /api/v1/auth/users/:id
// @access Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  res.status(200).json({
    success: true,
    user,
  });
});

// @desc  Create User
// @route Post /api/v1/auth
// @access Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(200).json({
    success: true,
    user,
  });
});

// @desc  Update User
// @route Put /api/v1/auth/users/:id
// @access Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

// @desc  Delete User
// @route Delete /api/v1/auth/users/:id
// @access Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  await User.findOneAndDelete(req.params.id);

  res.status(200).json({
    success: true,
  });
});
