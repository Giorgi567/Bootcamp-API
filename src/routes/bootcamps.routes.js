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
const router = express.Router();

router.route("/").get(getBootcamps).post(createBootacmp);

router
  .route("/:id")
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

router.route("/:id/photo").put(bootcampFotoUpload);

router.route("/:bootcampId/courses").get(getBootcampCourses);

module.exports = router;
