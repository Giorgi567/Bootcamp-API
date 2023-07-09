const express = require("express");
const {
  getCourses,
  getBootcampCourses,
  getCourse,
} = require("../controllers/course.controller");

const router = express.Router();

router.route("/").get(getCourses);

router.route("/:courseId").get(getCourse);

module.exports = router;
