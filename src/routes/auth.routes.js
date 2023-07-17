const express = require("express");
const {
  registrer,
  login,
  getMe,
  forgotPassword,
} = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");
const router = express.Router();

router.route("/registrer").post(registrer);

router.route("/login").post(login);

router.route("/forgotPassword").post(forgotPassword);

router.route("/me").get(protect, getMe);

module.exports = router;
