const Bootcamp = require("../models/bootcamp.model.js");
const errorResponse = require("../utils/errorResponse.js");
const asyncHandler = require("../middleware/async.js");
// @desc  Get All BootCamps
// @route Get /api/bootcamps
// @access Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query;

  const reqQuery = { ...req.query };
  // Fields to exculde
  const removeFields = ["select", "sort"];

  removeFields.forEach((param) => delete reqQuery[param]);

  let queryStr = JSON.stringify(reqQuery);

  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  query = Bootcamp.find(JSON.parse(queryStr));

  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  const bootcamps = await query;

  if (!bootcamps) {
    return res.status(400).json({ success: false });
  }
  res.status(200).json({
    success: true,
    totalBootcamps: bootcamps.length,
    Data: bootcamps,
  });
});

// @desc  Get  BootCamp
// @route Get /api/bootcamps/:id
// @access Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return new errorResponse(
      `Could not find bootcamp with id of ${req.params.id}`,
      404
    );
  }

  res.status(200).json({ success: true, Data: bootcamp });
});

// @desc  Create  BootCamp
// @route Post /api/bootcamps
// @access Private
exports.createBootacmp = asyncHandler(async (req, res, next) => {
  const newBootcamp = await Bootcamp.create(req.body);

  res.status(201).json({ success: true, Data: newBootcamp });
});

// @desc  Update  BootCamp
// @route Put /api/bootcamps/:id
// @access Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const updatedBootcamp = await Bootcamp.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!updatedBootcamp) {
    return res.status(400).json({ success: false });
  }

  res.status(200).json({ success: true, Data: updatedBootcamp });
});

// @desc  Delete  BootCamp
// @route Delete /api/bootcamps/:id
// @access Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const requestedBootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

  if (!requestedBootcamp) {
    return res.status(400).json({ success: false });
  }

  res.status(200).json({ success: true });
});
