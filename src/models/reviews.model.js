const { Schema, model, Mongoose } = require("mongoose");

const reviewSchema = new Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a title for review"],
    maxlength: 100,
  },
  text: {
    type: String,
    required: [true, `Please add some text`],
  },
  rating: {
    type: Number,
    required: [true, `Please add rating between 1 and 10`],
    min: 1,
    max: 10,
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
  User: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = model("Reviews", reviewSchema);
