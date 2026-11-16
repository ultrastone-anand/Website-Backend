
const router = require("express").Router();

const displayRequestController = require(
  "../controller/displayRequest.controller"
);

const authenticate = require(
  "../middlewares/auth.middleware"
);

const {
  checkDisplayHoneypot,
  displayRateLimiter,
} = require(
  "../middlewares/displaySpam.middleware"
);

/* =========================================================
   PUBLIC - CREATE DISPLAY REQUEST
========================================================= */

router.post(
  "/",
  displayRateLimiter,
  checkDisplayHoneypot,
  displayRequestController.createDisplayRequest
);

/* =========================================================
   CMS - GET DISPLAY REQUESTS
========================================================= */

router.get(
  "/",
  authenticate,
  displayRequestController.getDisplayRequests
);

/* =========================================================
   CMS - EXPORT DISPLAY REQUESTS
========================================================= */

router.get(
  "/export",
  authenticate,
  displayRequestController.exportDisplayRequests
);

module.exports = router;
