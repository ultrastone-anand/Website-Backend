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
      name: "closeup_images",  // closeup
      maxCount: 20,
    },
    {
      name: "slab_images",  // slab
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

  stoneController.createProduct
);

// UPDATE PRODUCT WITH FILES

router.put(
  "/product/:id",

  upload.fields([
    {
      name: "closeup_images",  // closeup
      maxCount: 20,
    },

    {
      name: "slab_images",  // slab
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

router.delete(
  "/product/:id",
  stoneController.deleteProduct
)

module.exports = router;
