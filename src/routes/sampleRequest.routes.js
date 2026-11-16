
const router =
  require("express").Router();

const sampleRequestController =
  require(
    "../controller/sampleRequest.controller"
  );

const authenticate =
  require(
    "../middlewares/auth.middleware"
  );

const {
  checkSampleHoneypot,
  sampleRateLimiter,
} = require(
  "../middlewares/sampleSpam.middleware"
);

/* =========================================================
   PUBLIC - CREATE SAMPLE REQUEST
========================================================= */

router.post(
  "/",
  sampleRateLimiter,
  checkSampleHoneypot,
  sampleRequestController.createSampleRequest
);

/* =========================================================
   CMS - GET REQUESTS
========================================================= */

router.get(
  "/",
  authenticate,
  sampleRequestController.getSampleRequests
);

/* =========================================================
   CMS - EXPORT EXCEL
========================================================= */

router.get(
  "/export",
  authenticate,
  sampleRequestController.exportSampleRequests
);

module.exports = router;
