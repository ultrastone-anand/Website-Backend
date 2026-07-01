// controller/page.controller.js
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