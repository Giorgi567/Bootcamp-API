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

const router = express.Router();

router
  .route("/")
  .get(
    advancedResults(CourseModel, {
      path: "bootcamp",
      select: "name description",
    }),
    getCourses
  )
  .post(createCourse);

router.route("/:id").get(getCourse).put(updateCourse).delete(deleteCourse);

module.exports = router;
