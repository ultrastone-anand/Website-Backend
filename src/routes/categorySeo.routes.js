
const router = require("express").Router();

const authenticate = require("../middlewares/auth.middleware");

const controller = require("../controller/categorySeo.controller");

// ============================================
// PUBLIC
// ============================================

// Get SEO by category slug
router.get(
  "/public/:slug",
  controller.getPublicCategorySeo
);

// ============================================
// ADMIN - AUTHENTICATED
// ============================================

// List all categories with SEO
router.get(
  "/",
  authenticate,
  controller.getAllCategorySeo
);

// Get SEO by category ID
router.get(
  "/:id",
  authenticate,
  controller.getCategorySeoById
);

// Create/save SEO for existing category
router.post(
  "/:id",
  authenticate,
  controller.createCategorySeo
);

// Update SEO (partial updates supported)
router.put(
  "/:id",
  authenticate,
  controller.updateCategorySeo
);

// Clear SEO without deleting category
router.delete(
  "/:id",
  authenticate,
  controller.deleteCategorySeo
);

module.exports = router;
