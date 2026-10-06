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

/* =========================================================
   PUBLIC
========================================================= */

router.post(
  "/",
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