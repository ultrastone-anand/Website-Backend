const router =
  require("express").Router();

const displayRequestController =
  require(
    "../controller/displayRequest.controller"
  );

const authenticate =
  require(
    "../middlewares/auth.middleware"
  );

/* =========================================================
   PUBLIC - CREATE DISPLAY REQUEST
========================================================= */

router.post(
  "/",
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