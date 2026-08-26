// routes/displayRequest.routes.js

const router =
  require("express").Router();

const displayRequestController =
  require(
    "../controller/displayRequest.controller"
  );

router.post(
  "/",
  displayRequestController.createDisplayRequest
);

module.exports = router;