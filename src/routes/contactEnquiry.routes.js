const express = require("express");
const router = express.Router();

const contactEnquiryController = require(
  "../controller/contactEnquiry.controller"
);

const authenticate = require(
  "../middlewares/auth.middleware"
);

// Public
router.post(
  "/",
  contactEnquiryController.createEnquiry
);

// CMS
router.get(
  "/",
  authenticate,
  contactEnquiryController.getAllEnquiries
);

router.patch(
  "/:id/status",
  authenticate,
  contactEnquiryController.updateStatus
);

module.exports = router;