const Course = require("../models/course.model.js");
const errorResponse = require("../utils/errorResponse.js");
const asyncHandler = require("../middleware/async.js");
const Bootcamp = require("../models/bootcamp.model.js");

// @Routes: Get /api/v1/courses
// @Desc: Gets all Courses
// @Access: Public

exports.getCourses = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @Routes: Get /api/v1/bootcamps/:bootcampId/courses
// @Desc: Gets Spicific Bootcamp Courses
// @Access: Public

exports.getBootcampCourses = asyncHandler(async (req, res, next) => {
  const CourseBootcamps = await Course.find({
    bootcamp: req.params.bootcampId,
  });

  if (!CourseBootcamps) {
    return new errorResponse(
      `Can not find Bootcamp with the id of ${req.params.bootcampId}`
    );
  }

  res.status(200).json({
    success: true,
    bootcamCount: CourseBootcamps.length,
    CourseBootcamps,
  });
});

// @Routes: Get /api/v1/:id
// @Desc: Gets a single Course
// @Access: Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const getSingleCourse = await Course.findById(req.params.id);

  if (!getSingleCourse) {
    return new errorResponse(
      `Can not find Bootcamp with the id of ${req.params.bootcamp}`
    );
  }

  res.status(200).json({
    success: true,
    getSingleCourse,
  });
});

// @Routes: Post /api/v1/courses
// @Desc: Creates a single Course
// @Access: Private
exports.createCourse = asyncHandler(async (req, res, next) => {
  const requestedBootcamp = await Bootcamp.findById(req.body.bootcamp);

  if (!requestedBootcamp) {
    return new errorResponse(
      `Can not find Bootcamp with the id of ${req.body.bootcamp}`
    );
  }
  const getCourse = await Course.create(req.body);

  res.status(201).json({
    success: true,
    getCourse,
  });
});

// @Routes: Post /api/v1/courses/:id
// @Desc: Updates a single Course
// @Access: Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  const currCourse = await Course.findById(req.params.id);

  if (!currCourse) {
    return next(
      new errorResponse(`Can not find crouse with the id of ${req.params.id}`)
    );
  }
  const getCourse = await Course.findByIdAndUpdate(currCourse._id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    getCourse,
  });
});

// @Routes: Delete /api/v1/courses/:id
// @Desc: Deletes a single Course
// @Access: Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const reqCourse = await Course.findById(req.params.id);

  if (!reqCourse) {
    return next(
      new errorResponse(`Can not find crouse with the id of ${req.params.id}`)
    );
  }
  reqCourse.remove();
  await Course.findByIdAndDelete(reqCourse._id);

  res.status(200).json({
    success: true,
  });
});
