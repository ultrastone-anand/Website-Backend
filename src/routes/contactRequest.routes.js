
const router = require("express").Router();

const contactRequestController = require(
  "../controller/contactRequest.controller"
);

const {
  checkContactHoneypot,
  contactRateLimiter,
} = require(
  "../middlewares/contactSpam.middleware"
);

/* =========================================================
   CONTACT REQUEST

   POST /api/contact-request

   Protection:
   1. Rate limiting
   2. Honeypot validation
   3. Controller validation
   4. Microsoft Graph email service
========================================================= */

router.post(
  "/",
  contactRateLimiter,
  checkContactHoneypot,
  contactRequestController.createContactRequest
);

module.exports = router;
