const router = require("express").Router();

const upload = require("../middlewares/upload");

const authenticate = require("../middlewares/auth.middleware");

const productRegistrationController = require(
  "../controller/ProductRegistration.controller"
);

/* =========================================================
   PUBLIC PRODUCT REGISTRATION ROUTES
========================================================= */

// Submit product registration
router.post(
  "/",
  upload.fields([
    {
      name: "purchase_invoice",
      maxCount: 1,
    },
    {
      name: "installation_photos",
      maxCount: 10,
    },
  ]),
  productRegistrationController.submitRegistration
);

/* =========================================================
   CMS PRODUCT REGISTRATION ROUTES
========================================================= */

// Get registration statistics
router.get(
  "/stats",
  authenticate,
  productRegistrationController.getRegistrationStats
);

// Get all registrations
router.get(
  "/",
  authenticate,
  productRegistrationController.getRegistrations
);

// Get registration details
router.get(
  "/:registrationId",
  authenticate,
  productRegistrationController.getRegistrationById
);

// Update registration
router.patch(
  "/:registrationId",
  authenticate,
  productRegistrationController.updateRegistration
);

// Update registration status
router.patch(
  "/:registrationId/status",
  authenticate,
  productRegistrationController.updateRegistrationStatus
);

// Delete registration
router.delete(
  "/:registrationId",
  authenticate,
  productRegistrationController.deleteRegistration
);

module.exports = router;