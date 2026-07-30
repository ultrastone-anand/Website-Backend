const express = require("express");

const router = express.Router();

const controller = require(
  "../controller/lotImages.controller"
);

// ----------------------------------------------------------------------
// Product lots
// ----------------------------------------------------------------------

// Get all lots and images belonging to a product
router.get(
  "/product/:productId",
  controller.getProductLots
);

// Generate direct R2 upload URLs
router.post(
  "/presign",
  controller.createLotImageUploadUrls
);

// Save a new lot or append images to an existing lot
router.post(
  "/save",
  controller.saveLotImages
);

// Update lot name
router.patch(
  "/lots/:lotId",
  controller.updateLot
);

// Delete complete lot and all its images
router.delete(
  "/lots/:lotId",
  controller.deleteLot
);

// ----------------------------------------------------------------------
// Individual lot images
// ----------------------------------------------------------------------

// Delete one image
router.delete(
  "/images/:imageId",
  controller.deleteLotImage
);

// Update image order or primary status
router.patch(
  "/images/:imageId",
  controller.updateLotImage
);

module.exports = router;