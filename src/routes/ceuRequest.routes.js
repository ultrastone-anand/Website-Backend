// routes/ceuRequest.routes.js

const router =
  require("express").Router();

const ceuRequestController =
  require(
    "../controller/ceuRequest.controller"
  );

router.post(
  "/",
  ceuRequestController.createCeuRequest
);

module.exports = router;