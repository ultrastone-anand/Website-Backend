const fs = require("fs");
const path = require("path");

const pageService = require("../services/page.service");
const { uploadToR2 } = require("../utils/uploadToR2");

// ============================================================
// CREATE PAGE
// ============================================================

exports.createPage = async (req, res, next) => {
  try {
    const data = await pageService.createPage(req.body);

    return res.status(201).json({
      success: true,
      data,
    });
  } catch (error) {
    return next(error);
  }
};

// ============================================================
// UPDATE PAGE
// ============================================================

exports.updatePage = async (req, res, next) => {
  try {
    const data = await pageService.updatePage(
      req.params.id,
      req.body
    );

    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    return next(error);
  }
};

// ============================================================
// GET PAGE BY SLUG
// ============================================================

exports.getPageBySlug = async (req, res, next) => {
  try {
    const data = await pageService.getPageBySlug(
      req.params.slug
    );

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Page not found",
      });
    }

    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    return next(error);
  }
};

// ============================================================
// DELETE PAGE
// ============================================================

exports.deletePage = async (req, res, next) => {
  try {
    await pageService.deletePage(req.params.id);

    return res.json({
      success: true,
      message: "Page deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
};

// ============================================================
// GET ALL PAGE SEO
// ============================================================

exports.getAllPageSeo = async (req, res, next) => {
  try {
    const data = await pageService.getAllPageSeo(
      req.query.mode
    );

    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    return next(error);
  }
};

// ============================================================
// GET PAGE SEO BY PAGE ID OR SEO RECORD ID
// ============================================================

exports.getPageSeoById = async (req, res, next) => {
  try {
    const data = await pageService.getPageSeoById(
      req.params.pageId,
      req.query.mode
    );

    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    return next(error);
  }
};

// ============================================================
// GET PUBLIC PAGE SEO BY SLUG
// ============================================================

exports.getPublicPageSeo = async (req, res, next) => {
  try {
    const data = await pageService.getPublicPageSeo(
      req.params.slug
    );

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Page SEO not found",
      });
    }

    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    return next(error);
  }
};

// ============================================================
// CREATE PAGE SEO
// ============================================================

exports.createPageSeo = async (req, res, next) => {
  try {
    const data = await pageService.createPageSeo(
      req.body,
      req.query.mode
    );

    return res.status(201).json({
      success: true,
      message: "Page SEO created successfully",
      data,
    });
  } catch (error) {
    return next(error);
  }
};

// ============================================================
// UPDATE PAGE SEO
// ============================================================

exports.updatePageSeo = async (req, res, next) => {
  try {
    const data = await pageService.updatePageSeo(
      req.params.pageId,
      req.body,
      req.query.mode
    );

    return res.json({
      success: true,
      message: "Page SEO saved successfully",
      data,
    });
  } catch (error) {
    return next(error);
  }
};

// ============================================================
// DELETE PAGE SEO
// ============================================================

exports.deletePageSeo = async (req, res, next) => {
  try {
    await pageService.deletePageSeo(
      req.params.pageId,
      req.query.mode
    );

    return res.json({
      success: true,
      message: "Page SEO deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
};

// ============================================================
// UPLOAD PAGE IMAGE
// ============================================================

exports.uploadPageImage = async (req, res, next) => {
  try {
    const data = await pageService.uploadPageImage(
      req.file
    );

    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      data,
    });
  } catch (error) {
    return next(error);
  }
};

// ============================================================
// UPLOAD PAGE PDF TO R2
// ============================================================

exports.uploadPagePdf = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "PDF file is required.",
      });
    }

    const extension = path
      .extname(req.file.originalname)
      .toLowerCase();

    const isPdf =
      req.file.mimetype === "application/pdf" &&
      extension === ".pdf";

    if (!isPdf) {
      if (req.file.path) {
        await fs.promises
          .unlink(req.file.path)
          .catch(() => null);
      }

      return res.status(400).json({
        success: false,
        message: "Only PDF files are allowed.",
      });
    }

    const uploadedPdf = await uploadToR2(
      req.file,
      "page-pdfs"
    );

    return res.status(201).json({
      success: true,
      message: "PDF uploaded successfully",
      data: {
        fileName: req.file.originalname,
        storedFileName: uploadedPdf.public_id,
        pdfUrl: uploadedPdf.secure_url,
        publicId: uploadedPdf.public_id,
        size: req.file.size,
        mimeType: req.file.mimetype,
      },
    });
  } catch (error) {
    return next(error);
  }
};