const express = require("express");
const router = express.Router();

const pageController = require("../controller/page.controller");
const upload = require("../middlewares/upload");
const authenticate = require("../middlewares/auth.middleware");

// ============================================================
// PUBLIC PAGE SEO
// ============================================================

router.get(
  "/seo/public/:slug",
  pageController.getPublicPageSeo
);

// ============================================================
// PAGE SEO CRUD
// ============================================================

router.get(
  "/seo",
  authenticate,
  pageController.getAllPageSeo
);

router.get(
  "/seo/:pageId",
  authenticate,
  pageController.getPageSeoById
);

router.post(
  "/seo",
  authenticate,
  pageController.createPageSeo
);

router.put(
  "/seo/:pageId",
  authenticate,
  pageController.updatePageSeo
);

router.delete(
  "/seo/:pageId",
  authenticate,
  pageController.deletePageSeo
);

// ============================================================
// PAGE IMAGE UPLOAD
// ============================================================

router.post(
  "/upload-image",
  upload.single("image"),
  pageController.uploadPageImage
);

// ============================================================
// PAGE PDF UPLOAD
// ============================================================

router.post(
  "/upload-pdf",
  upload.single("pdf"),
  pageController.uploadPagePdf
);

// ============================================================
// EXISTING PAGE CRUD
// ============================================================

router.post("/", pageController.createPage);

router.put("/:id", pageController.updatePage);

router.get("/:slug", pageController.getPageBySlug);

router.delete("/:id", pageController.deletePage);

module.exports = router;