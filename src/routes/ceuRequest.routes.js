
const router =
  require("express").Router();

const ceuRequestController =
  require(
    "../controller/ceuRequest.controller"
  );

const authenticate =
  require(
    "../middlewares/auth.middleware"
  );

const {
  checkCeuHoneypot,
  ceuRateLimiter,
} = require(
  "../middlewares/ceuSpam.middleware"
);

/* =========================================================
   PUBLIC - CREATE CEU REQUEST
========================================================= */

router.post(
  "/",
  ceuRateLimiter,
  checkCeuHoneypot,
  ceuRequestController.createCeuRequest
);

/* =========================================================
   CMS - GET REQUESTS
========================================================= */

router.get(
  "/",
  authenticate,
  ceuRequestController.getCeuRequests
);

/* =========================================================
   CMS - EXPORT EXCEL
========================================================= */

router.get(
  "/export",
  authenticate,
  ceuRequestController.exportCeuRequests
);

module.exports = router;
