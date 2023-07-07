const express = require("express");
const {
  getBootcamp,
  getBootcamps,
  createBootacmp,
  deleteBootcamp,
  updateBootcamp,
} = require("../controllers/bootcamps");
const router = express.Router();

router.route("/").get(getBootcamps).post(createBootacmp);

router
  .route("/:id")
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

module.exports = router;
