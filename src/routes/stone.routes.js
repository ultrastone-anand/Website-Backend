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

router.post("/product", stoneController.createProduct);

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
  ]),

  stoneController.updateProduct,
);

module.exports = router;
