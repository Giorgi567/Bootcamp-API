const express = require("express");
const Reviews = require("../models/reviews.model");
const {
  getReviews,
  getAllReviews,
  createReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviews.controller");

const advancedFilteringFunc = require("../middleware/advancedFiltering");
const { protect, Authorize } = require("../middleware/auth.middleware");

const router = express.Router();

router.route("/").get(
  advancedFilteringFunc(Reviews, {
    path: "bootcamp",
    select: "name description",
  }),
  getAllReviews
);

router.route("/:bootcampId").get(getReviews);

router
  .route("/:id")
  .put(protect, Authorize("User", "Admin"), updateReview)
  .delete(protect, Authorize("User", "Admin"), deleteReview);

router
  .route("/:bootcampId/reviews")
  .post(protect, Authorize("User", "Admin"), createReview);

module.exports = router;
