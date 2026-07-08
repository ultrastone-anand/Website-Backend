const express = require("express");
const router = express.Router();

const upload = require("../middlewares/upload");
const controller = require("../controller/inspirationGallery.controller");

// Categories
router.get("/categories", controller.getCategories);
router.post("/categories", controller.createCategory);
router.put("/categories/:id", controller.updateCategory);
router.delete("/categories/:id", controller.deleteCategory);

// Images
router.get("/images", controller.getImages);


// NEW direct R2 upload
router.post("/images/presign", controller.createImageUploadUrls);
router.post("/images/save", controller.saveUploadedImages);

router.delete("/images/:id", controller.deleteImage);

module.exports = router;