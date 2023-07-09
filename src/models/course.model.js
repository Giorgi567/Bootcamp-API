const { Schema, model, Mongoose } = require("mongoose");

const courseSchema = new Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a course Title"],
  },
  description: {
    type: String,
    required: [true, `Please add a description`],
  },
  weeks: {
    type: String,
    required: [true, `Please add number of weeks`],
  },
  tuition: {
    type: Number,
    required: [true, `Please add tuition cost`],
  },
  minimumSkill: {
    type: String,
    required: [true, `Please add a minimum skill`],
    enum: ["beginner", "intermediate", "advanced"],
  },
  scholarhipsAvailable: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: Schema.Types.ObjectId,
    ref: "Bootcamp",
    required: true,
  },
});

module.exports = model("Course", courseSchema);
