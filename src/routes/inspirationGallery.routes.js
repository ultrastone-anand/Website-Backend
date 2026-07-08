const express = require("express");
const router = express.Router();

const upload = require("../middlewares/upload");
const controller = require("../controller/inspirationGallery.controller");

router.get("/categories", controller.getCategories);
router.post("/categories", controller.createCategory);
router.put("/categories/:id", controller.updateCategory);
router.delete("/categories/:id", controller.deleteCategory);

router.get("/images", controller.getImages);
router.post("/images",upload.array("images", 20),controller.uploadImages);
router.delete("/images/:id", controller.deleteImage);

module.exports = router;