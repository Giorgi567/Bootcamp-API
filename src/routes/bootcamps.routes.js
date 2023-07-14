const express = require("express");
const {
  getBootcamp,
  getBootcamps,
  createBootacmp,
  deleteBootcamp,
  updateBootcamp,
  bootcampFotoUpload,
} = require("../controllers/bootcamps.controller");
const { getBootcampCourses } = require("../controllers/course.controller");

const bootcampModel = require("../models/bootcamp.model");
const advancedResults = require("../middleware/advancedFiltering");
const { protect, Authorize } = require("../middleware/auth.middleware");

const router = express.Router();

router
  .route("/")
  .get(advancedResults(bootcampModel, "courses"), getBootcamps)
  .post(protect, Authorize("Publisher", "Admin"), createBootacmp);

router
  .route("/:id")
  .get(getBootcamp)
  .put(protect, Authorize("Publisher", "Admin"), updateBootcamp)
  .delete(protect, Authorize("Publisher", "Admin"), deleteBootcamp);

router.route("/:id/photo").put(protect, bootcampFotoUpload);

router.route("/:bootcampId/courses").get(getBootcampCourses);

module.exports = router;
