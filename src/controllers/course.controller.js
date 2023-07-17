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

// @Routes: Post /api/v1/:bootcampId/courses
// @Desc: Creates a single Course
// @Access: Private
exports.createCourse = asyncHandler(async (req, res, next) => {
  const requestedBootcamp = await Bootcamp.findById(req.params.bootcampId);
  req.body.bootcamp = req.params.bootcampId;
  req.body.User = req.user.id;

  if (!requestedBootcamp) {
    return new errorResponse(
      `Can not find Bootcamp with the id of ${req.body.bootcampId}`
    );
  }
  if (
    String(requestedBootcamp.User) !== req.user.id &&
    req.user.role !== "Admin"
  ) {
    return next(
      new errorResponse(
        `User ${req.user.name} is not authorized to add a course to bootcamp ${requestedBootcamp.name}`,
        401
      )
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

  if (String(currCourse.User) !== req.user.id && req.user.role !== "Admin") {
    return next(
      new errorResponse(
        `User ${req.user.name} is not authorized to Update a course to bootcamp ${currCourse.name}`,
        401
      )
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

  if (String(reqCourse.User) !== req.user.id && req.user.role !== "Admin") {
    return next(
      new errorResponse(
        `User ${req.user.name} is not authorized to delete a course to bootcamp ${reqCourse.name}`,
        401
      )
    );
  }

  await Course.findByIdAndDelete(reqCourse._id);

  res.status(200).json({
    success: true,
  });
});
