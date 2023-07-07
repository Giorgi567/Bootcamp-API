const Bootcamp = require("../models/bootcamp.model.js");

// @desc  Get All BootCamps
// @route Get /api/bootcamps
// @access Public
exports.getBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find();

    if (!bootcamps) {
      return res.status(400).json({ success: false });
    }
    res
      .status(200)
      .json({
        success: true,
        totalBootcamps: bootcamps.length,
        Data: bootcamps,
      });
  } catch (err) {
    res.status(400).json({ success: false, err: err });
  }
};

// @desc  Get  BootCamp
// @route Get /api/bootcamps/:id
// @access Public
exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json({ success: true, Data: bootcamp });
  } catch (err) {
    res.status(400).json({ success: false, err: err });
  }
};

// @desc  Create  BootCamp
// @route Post /api/bootcamps
// @access Private
exports.createBootacmp = async (req, res, next) => {
  try {
    const newBootcamp = await Bootcamp.create(req.body);

    res.status(201).json({ success: true, Data: newBootcamp });
  } catch (err) {
    res.status(500).json({ success: false, err: err });
  }
};

// @desc  Update  BootCamp
// @route Put /api/bootcamps/:id
// @access Private
exports.updateBootcamp = async (req, res, next) => {
  try {
    const updatedBootcamp = await Bootcamp.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedBootcamp) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json({ success: true, Data: updatedBootcamp });
  } catch (err) {
    res.status(400).json({ success: false, err: err });
  }
};

// @desc  Delete  BootCamp
// @route Delete /api/bootcamps/:id
// @access Private
exports.deleteBootcamp = async (req, res, next) => {
  try {
    const requestedBootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

    if (!requestedBootcamp) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, err: err });
  }
};
