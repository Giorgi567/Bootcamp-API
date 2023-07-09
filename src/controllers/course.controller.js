const Course = require("../models/course.model.js");
const errorResponse = require("../utils/errorResponse.js");
const asyncHandler = require("../middleware/async.js");

// @Routes: Get /api/v1/courses
// @Desc: Gets all Courses
// @Access: Public

exports.getCourses = asyncHandler(async (req, res, next) => {
  const courses = await Course.find();

  res.status(200).json({
    success: true,
    bootcamCount: courses.length,
    courses,
  });
});

// @Routes: Get /api/v1/bootcamps/:bootcampId/courses
// @Desc: Gets Spicific Bootcamp Courses
// @Access: Public

exports.getBootcampCourses = asyncHandler(async (req, res, next) => {
  const CourseBootcamps = await Course.find({
    bootcamp: req.params.bootcampId,
  });

  if (!CourseBootcamps) {
    return res.status(200).json({
      success: true,
      message: "This Bootcamp does not have any courses",
      CourseBootcamps,
    });
  }
  res.status(200).json({
    success: true,
    bootcamCount: CourseBootcamps.length,
    CourseBootcamps,
  });
});

// @Routes: Get /api/v1/bootcamps/:courseId
// @Desc: Gets a single Course
// @Access: Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const getCourse = await Course.find({ _id: req.params.courseId });
  console.log(req);
  console.log(req.params);

  if (!getCourse) {
    return res.status(400).json({ success: false });
  }

  res.status(200).json({
    success: true,
    getCourse,
  });
});
