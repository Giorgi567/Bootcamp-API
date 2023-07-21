const errorResponse = require("../utils/errorResponse.js");
const asyncHandler = require("../middleware/async.js");
const Review = require("../models/reviews.model.js");
const Bootcamp = require("../models/bootcamp.model.js");
// @desc Get All Review
// @route Get api/v1/reviews
// @access Public
exports.getAllReviews = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc Get Review
// @route Get api/v1/reviews/:bootcampId
// @access Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  const review = await Review.find({
    bootcamp: req.params.bootcampId,
  })
    .populate({ path: "User", select: "name" })
    .populate({ path: "bootcamp", select: "name" });

  if (!review) {
    next(
      new errorResponse(`No review found with this id ${req.params.bootcampId}`)
    );
  }
  res.status(200).json({
    success: true,
    count: review.length,
    review,
  });
});

// @desc Create A Review
// @route Post api/v1/reviews/:bootcampId/reviews
// @access Private
exports.createReview = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.User = req.user.id;

  const reqBootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!reqBootcamp) {
    return next(
      new errorResponse(`Bootcamp not found id of ${req.params.bootcampId}`)
    );
  }

  const review = await Review.create(req.body);

  res.status(200).json({
    success: true,
    review,
  });
});

// @desc Update A Review
// @route Put api/v1/reviews/:id
// @access Private
exports.updateReview = asyncHandler(async (req, res, next) => {
  const reqreview = await Review.findById(req.params.id);

  if (!reqreview) {
    return next(new errorResponse(`Review not found id of ${req.params.id}`));
  }

  if (
    String(req.user.id) !== String(reqreview.User) &&
    req.user.role !== "Admin"
  ) {
    return next(new errorResponse("Not Authorized to update this Review", 401));
  }

  const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    review,
  });
});

// @desc Delete A Review
// @route Delete api/v1/reviews/:id
// @access Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const reqreview = await Review.findById(req.params.id);

  if (!reqreview) {
    return next(new errorResponse(`Review not found id of ${req.params.id}`));
  }

  if (
    String(req.user.id) !== String(reqreview.User) &&
    req.user.role !== "Admin"
  ) {
    return next(new errorResponse("Not Authorized to delete this Review", 401));
  }

  await Review.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
  });
});
