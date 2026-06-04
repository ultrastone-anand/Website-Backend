const router = require("express").Router();

const upload = require("../middlewares/upload");

const stoneController = require("../controller/stone.controller");

// ==============================
// GET
// ==============================

router.get("/", stoneController.getStones);

router.get("/:slug", stoneController.getCategoryProducts);

router.get("/productdetail/:slug", stoneController.getProductDetails);

// ==============================
// CATEGORY CRUD
// ==============================

router.post("/category", stoneController.createCategory);

router.put("/category/:id", stoneController.updateCategory);

// ==============================
// PRODUCT CRUD
// ==============================

// CREATE PRODUCT

router.post(
  "/product",

  upload.fields([
    {
      name: "featured_images",
      maxCount: 20,
    },
    {
      name: "gallery_images",
      maxCount: 50,
    },
    {
      name: "featured_videos",
      maxCount: 10,
    },
  ]),

  stoneController.createProduct
);

// UPDATE PRODUCT WITH FILES

router.put(
  "/product/:id",

  upload.fields([
    {
      name: "featured_images",
      maxCount: 20,
    },

    {
      name: "gallery_images",
      maxCount: 50,
    },

    {
      name: "featured_videos",
      maxCount: 10,
    },

    {
      name: "application_images",
      maxCount: 20, // multiple uploads
    },

    {
      name: "bookmatch_slipmatch",
      maxCount: 20, // multiple uploads
    },
  ]),

  stoneController.updateProduct
);

module.exports = router;
