const express = require("express");
const { registrer, login } = require("../controllers/auth.controller");

const router = express.Router();

router.route("/registrer").post(registrer);

router.route("/login").post(login);

module.exports = router;
