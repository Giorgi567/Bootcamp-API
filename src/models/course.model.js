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
  User: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

courseSchema.statics.getAverageCost = async function (bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: "$bootcamp",
        avgCost: { $avg: "$tuition" },
      },
    },
  ]);

  try {
    await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(obj[0].avgCost / 10) * 10,
    });
  } catch (error) {
    console.log(error);
  }
};

courseSchema.post("save", function () {
  this.constructor.getAverageCost(this.bootcamp);
});

module.exports = model("Course", courseSchema);
