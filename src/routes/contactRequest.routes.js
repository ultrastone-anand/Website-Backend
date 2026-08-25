// routes/contactRequest.routes.js

const router =
  require(
    "express"
  ).Router();

const contactRequestController =
  require(
    "../controller/contactRequest.controller"
  );

/* =========================================================
   CONTACT REQUEST
========================================================= */

router.post(
  "/",
  contactRequestController.createContactRequest
);

module.exports =
  router;