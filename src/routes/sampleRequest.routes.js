// routes/sampleRequest.routes.js

const router =
  require("express").Router();

const sampleRequestController =
  require(
    "../controller/sampleRequest.controller"
  );

router.post(
  "/",
  sampleRequestController.createSampleRequest
);

module.exports = router;