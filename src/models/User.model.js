const { Schema, model, Mongoose } = require("mongoose");
const { genSalt, hash, compare } = require("bcryptjs");
const { randomBytes, createHash } = require("crypto");
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
  if (!this.isModified("password")) {
    next();
  }
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

userSchema.methods.getResetPasswordToken = async function () {
  const resetToken = randomBytes(20).toString("hex");

  this.resetPasswordToken = createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports = model("User", userSchema);
