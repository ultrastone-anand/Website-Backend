const router = require("express").Router();

const upload = require("../middlewares/upload");

const stoneController = require("../controller/stone.controller");
const authenticate = require("../middlewares/auth.middleware");

// ==============================
// GET
// ==============================

router.get("/", stoneController.getStones);

router.get("/:slug", stoneController.getCategoryProducts);

router.get("/productdetail/:slug", stoneController.getProductDetails);

// ==============================
// CATEGORY CRUD
// ==============================

router.post("/category", authenticate ,  upload.single("silica_datasheet"), stoneController.createCategory);

router.put("/category/:id", authenticate ,  upload.single("silica_datasheet"), stoneController.updateCategory);

// ==============================
// PRODUCT CRUD
// ==============================

router.post(
  "/product",

  authenticate ,

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

    { name: "silica_datasheet", maxCount: 1 }, // ADD THIS

  ]),

  stoneController.createProduct
);

router.put(
  "/product/:id",

  authenticate ,

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

    { name: "silica_datasheet", maxCount: 1 }, // ADD THIS

  ]),

  stoneController.updateProduct
);

router.delete(
  "/product/:id",
  authenticate ,
  stoneController.deleteProduct
)

router.post( "/bulkupload", authenticate, stoneController.bulkCreateProducts);

router.post(
  "/bulk-delete",
  authenticate,
  stoneController.bulkDeleteProducts
);

router.post(
  "/bulk-deactive",
  authenticate,
  stoneController.bulkDeactivateProducts
);

router.patch(
  "/product/:id/status",
  stoneController.updateProductStatus
);



module.exports = router;
