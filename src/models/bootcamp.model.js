const { Schema, model } = require("mongoose");
const slugify = require("slugify");

const BootCampSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, `Bootcamp must have a name`],
      unique: true,
      trim: true,
      maxlength: [50, `Name can not be more then 50 characters`],
    },
    slug: String,
    description: {
      type: String,
      required: true,
      maxlength: [500, `Description can not be longer then 500 characters`],
    },
    website: {
      type: String,
      match: [
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        "Please use a valid URL with HTTP or HTTPS",
      ],
    },
    phone: {
      type: String,
      maxlength: [20, `Phone number can not be longer then 20 characters`],
    },
    email: {
      type: String,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ],
    },
    address: {
      type: String,
      required: [true, `Please add an address`],
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
        index: "2dsphere",
      },
      formattedAddress: String,
      street: String,
      city: String,
      zipcode: String,
      country: String,
    },
    carrers: {
      type: [String],
      required: true,
      enum: [
        "Web Development",
        `Mobile Development`,
        `UI/UX`,
        `Data Science`,
        `Buisness`,
        `Other`,
      ],
    },
    averageRating: {
      type: Number,
      min: [1, `Rating must be at least 1`],
      max: [10, `Rating can not be more then 10`],
    },
    averageCost: Number,
    photo: {
      type: String,
      default: "no-photo.jpg",
    },
    housing: {
      type: Boolean,
      default: false,
    },
    jobAssistance: {
      type: Boolean,
      default: false,
    },
    jobGuarantee: {
      type: Boolean,
      default: false,
    },
    acceptGi: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Creating bootamp slug from name
BootCampSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

BootCampSchema.virtual("courses", {
  ref: "Course",
  localField: "_id",
  foreignField: "bootcamp",
  justOne: false,
});

module.exports = model(`Bootcamp`, BootCampSchema);
