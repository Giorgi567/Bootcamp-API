const express = require("express");
const User = require("../models/User.model");
const { protect, Authorize } = require("../middleware/auth.middleware");
const {
  getUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/users.controller");

const advancedFilteringFunc = require("../middleware/advancedFiltering");

const router = express.Router();

router.use(protect);
router.use(Authorize("Admin"));

router.route("/").get(advancedFilteringFunc(User), getUsers).post(createUser);

router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
