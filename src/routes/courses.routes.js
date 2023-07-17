const express = require("express");
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/course.controller");

const CourseModel = require("../models/course.model");
const advancedResults = require("../middleware/advancedFiltering");
const { protect, Authorize } = require("../middleware/auth.middleware");

const router = express.Router();

router.route("/").get(
  advancedResults(CourseModel, {
    path: "bootcamp",
    select: "name description",
  }),
  getCourses
);

router
  .route("/:bootcampId/course")
  .post(protect, Authorize("Publisher", "Admin"), createCourse);

router
  .route("/:id")
  .get(getCourse)
  .put(protect, Authorize("Publisher", "Admin"), updateCourse)
  .delete(protect, Authorize("Publisher", "Admin"), deleteCourse);

module.exports = router;
