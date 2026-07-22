// routes/page.routes.js
const express = require("express");
const router = express.Router();
const pageController = require("../controller/page.controller");
const upload = require("../middlewares/upload");

router.post(
  "/upload-image",
  upload.single("image"),
  pageController.uploadPageImage
);

router.post(
  "/upload-pdf",
  upload.single("pdf"),
  pageController.uploadPagePdf
);

router.post("/", pageController.createPage);
router.put("/:id", pageController.updatePage);
router.get("/:slug", pageController.getPageBySlug);
router.delete("/:id", pageController.deletePage);

module.exports = router;