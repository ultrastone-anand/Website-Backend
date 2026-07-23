// controller/page.controller.js
const fs = require("fs");
const path = require("path");

const pageService = require("../services/page.service");

exports.createPage = async (req, res) => {
  try {
    const data = await pageService.createPage(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updatePage = async (req, res) => {
  try {
    const data = await pageService.updatePage(req.params.id, req.body);
    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPageBySlug = async (req, res) => {
  try {
    const data = await pageService.getPageBySlug(req.params.slug);

    if (!data) {
      return res.status(404).json({ success: false, message: "Page not found" });
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deletePage = async (req, res) => {
  try {
    await pageService.deletePage(req.params.id);
    res.json({ success: true, message: "Page deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.uploadPageImage = async (req, res) => {

  try {

    const data = await pageService.uploadPageImage(req.file);

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      data
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

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
      if (
        req.file.path &&
        fs.existsSync(req.file.path)
      ) {
        fs.unlinkSync(req.file.path);
      }

      return res.status(400).json({
        success: false,
        message: "Only PDF files are allowed.",
      });
    }

    const relativeUrl = `/uploads/${req.file.filename}`;

    const baseUrl =
      process.env.PUBLIC_API_URL ||
      `${req.protocol}://${req.get("host")}`;

    const pdfUrl = `${baseUrl}${relativeUrl}`;

    return res.status(201).json({
      success: true,
      message: "PDF uploaded successfully",
      data: {
        fileName: req.file.originalname,
        storedFileName: req.file.filename,
        pdfUrl,
        relativeUrl,
        size: req.file.size,
        mimeType: req.file.mimetype,
      },
    });
  } catch (error) {
    next(error);
  }
};