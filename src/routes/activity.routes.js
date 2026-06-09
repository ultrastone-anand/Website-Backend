const express = require("express");
const router = express.Router();

const activityController = require("../controller/activity.controller");
const authenticate = require("../middlewares/auth.middleware");

router.get("/", authenticate , activityController.getActivities);

module.exports = router;