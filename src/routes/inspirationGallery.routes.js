const express = require("express");
const router = express.Router();

const upload = require("../middlewares/upload");
const controller = require("../controller/inspirationGallery.controller");

// =========================================================
// CATEGORIES
// =========================================================

router.get(
  "/categories",
  controller.getCategories
);

router.post(
  "/categories",
  controller.createCategory
);

router.put(
  "/categories/:id",
  controller.updateCategory
);

router.delete(
  "/categories/:id",
  controller.deleteCategory
);

// =========================================================
// IMAGES
// =========================================================

router.get(
  "/images",
  controller.getImages
);

// Product inspiration images by product slug
router.get(
  "/images/product/:slug",
  controller.getImagesBySlug
);

// Direct R2 upload
router.post(
  "/images/presign",
  controller.createImageUploadUrls
);

router.post(
  "/images/save",
  controller.saveUploadedImages
);

// =========================================================
// IMAGE ↔ PRODUCT LINKS
// =========================================================

// Search products for CMS selector
router.get(
  "/products",
  controller.searchProducts
);

// Get products linked to an inspiration image
router.get(
  "/images/:id/products",
  controller.getImageProducts
);

// Replace/save products linked to an inspiration image
router.put(
  "/images/:id/products",
  controller.updateImageProducts
);

// =========================================================
// IMAGE UPDATE / DELETE
// =========================================================

router.patch(
  "/images/:id/alt",
  controller.updateImageAlt
);

router.delete(
  "/images/:id",
  controller.deleteImage
);

module.exports = router;