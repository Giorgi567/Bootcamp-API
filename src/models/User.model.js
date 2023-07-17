const { Schema, model, Mongoose } = require("mongoose");
const { genSalt, hash, compare } = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, `Please add a name`],
  },
  email: {
    type: String,
    required: [true, `Please add an email`],
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"],
  },
  role: {
    type: String,
    enum: ["User", "Admin", "Publisher"],
    default: "User",
  },
  password: {
    type: String,
    required: [true, `Please add a password`],
    minlength: 6,
    select: false,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Encrypting passwords with bcrypt
userSchema.pre("save", async function (next) {
  const salt = await genSalt(10);

  this.password = await hash(this.password, salt);
});

// Sign JWT and return
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Comparing entered password and hashed password from database
userSchema.methods.comparePasswods = async function (enteredPassword) {
  return await compare(enteredPassword, this.password);
};

module.exports = model("User", userSchema);
