const express = require("express");
const router = express.Router();

const newsletterController = require("../controller/newsletter.controller");
const authenticate = require("../middlewares/auth.middleware");

// Public
router.post(
  "/subscribe",
  newsletterController.subscribe
);

// CMS
router.get(
  "/",
  authenticate,
  newsletterController.getAllSubscribers
);

module.exports = router;