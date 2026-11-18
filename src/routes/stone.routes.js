
const router = require("express").Router();

const upload = require("../middlewares/upload");

const stoneController = require("../controller/stone.controller");

const authenticate = require("../middlewares/auth.middleware");

// ============================================================
// GET ROUTES
// ============================================================

// GET MEDIA AS BASE64
router.get(
  "/media/base64",
  stoneController.getMediaBase64
);

// BROWSE PRODUCTS
router.get(
  "/browse",
  stoneController.getBrowseProducts
);

// ============================================================
// CMS PRODUCT SEARCH
// Protected - authenticated CMS users only
// ============================================================

router.get(
  "/search/products",
  authenticate,
  stoneController.searchProducts
);

// ============================================================
// CMS ADMIN PRODUCT DETAILS
// Includes active, inactive, published and unpublished products
// ============================================================

router.get(
  "/admin/productdetail/:slug",
  authenticate,
  stoneController.getAdminProductDetails
);

// ============================================================
// PUBLIC PRODUCT DETAILS
// Only active and published products
// ============================================================

router.get(
  "/productdetail/:slug",
  stoneController.getProductDetails
);

// ============================================================
// GET ALL STONE CATEGORIES
// ============================================================

router.get(
  "/",
  stoneController.getStones
);

// ============================================================
// GET PRODUCTS BY CATEGORY
// Keep generic slug route after specific GET routes
// ============================================================

router.get(
  "/:slug",
  stoneController.getCategoryProducts
);

// ============================================================
// CATEGORY CRUD
// ============================================================

// CREATE CATEGORY
router.post(
  "/category",
  authenticate,
  upload.fields([
    {
      name: "thumbnail",
      maxCount: 1,
    },
    {
      name: "silica_datasheet",
      maxCount: 1,
    },
  ]),
  stoneController.createCategory
);

// UPDATE CATEGORY
router.put(
  "/category/:id",
  authenticate,
  upload.fields([
    {
      name: "thumbnail",
      maxCount: 1,
    },
    {
      name: "silica_datasheet",
      maxCount: 1,
    },
  ]),
  stoneController.updateCategory
);

// ============================================================
// PRODUCT CRUD
// ============================================================

// CREATE PRODUCT
router.post(
  "/product",
  authenticate,
  upload.fields([
    {
      name: "closeup_images",
      maxCount: 20,
    },
    {
      name: "slab_images",
      maxCount: 50,
    },
    {
      name: "featured_videos",
      maxCount: 10,
    },
    {
      name: "application_images",
      maxCount: 20,
    },
    {
      name: "bookmatch_slipmatch",
      maxCount: 20,
    },
    {
      name: "silica_datasheet",
      maxCount: 1,
    },
  ]),
  stoneController.createProduct
);

// UPDATE PRODUCT
router.put(
  "/product/:id",
  authenticate,
  upload.fields([
    {
      name: "closeup_images",
      maxCount: 20,
    },
    {
      name: "slab_images",
      maxCount: 50,
    },
    {
      name: "featured_videos",
      maxCount: 10,
    },
    {
      name: "application_images",
      maxCount: 20,
    },
    {
      name: "bookmatch_slipmatch",
      maxCount: 20,
    },
    {
      name: "silica_datasheet",
      maxCount: 1,
    },
  ]),
  stoneController.updateProduct
);

// DELETE PRODUCT
router.delete(
  "/product/:id",
  authenticate,
  stoneController.deleteProduct
);

// ============================================================
// BULK PRODUCT OPERATIONS
// ============================================================

// BULK CREATE PRODUCTS
router.post(
  "/bulkupload",
  authenticate,
  stoneController.bulkCreateProducts
);

// BULK DEACTIVATE PRODUCTS
router.post(
  "/bulk-deactive",
  authenticate,
  stoneController.bulkDeactivateProducts
);

// BULK PUBLISH PRODUCTS
router.patch(
  "/bulk-publish",
  authenticate,
  stoneController.bulkPublishProducts
);

// ============================================================
// PRODUCT STATUS
// ============================================================

// ACTIVATE / DEACTIVATE PRODUCT
router.patch(
  "/product/:id/status",
  authenticate,
  stoneController.updateProductStatus
);

// PUBLISH / UNPUBLISH PRODUCT
router.patch(
  "/product/:id/publish",
  authenticate,
  stoneController.updatePublishStatus
);

// ============================================================
// PRODUCT MEDIA
// ============================================================

// DELETE PRODUCT MEDIA
router.delete(
  "/media/:mediaId",
  authenticate,
  stoneController.deleteStoneProductMedia
);

// ============================================================
// R2 VIDEO UPLOAD
// ============================================================

// GENERATE PRESIGNED VIDEO UPLOAD URL
router.post(
  "/r2/video-upload-url",
  authenticate,
  stoneController.getVideoUploadUrl
);

// ============================================================
// EXPORT ROUTER
// ============================================================

module.exports = router;
