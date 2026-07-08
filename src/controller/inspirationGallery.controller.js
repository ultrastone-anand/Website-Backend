const service = require("../services/inspirationGallery.service");

const getCategories = async (req, res) => {
  try {
    const data = await service.getCategories();

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createCategory = async (req, res) => {
  try {
    const data = await service.createCategory(req.body);

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const data = await service.updateCategory(Number(req.params.id), req.body);

    res.json({
      success: true,
      message: "Category updated successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    await service.deleteCategory(Number(req.params.id));

    res.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getImages = async (req, res) => {
  try {
    const data = await service.getImages({
      categoryId: req.query.category_id,
      limit: req.query.limit,
    });

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const createImageUploadUrls = async (req, res) => {
  try {
    const data = await service.createImageUploadUrls(req.body);

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const saveUploadedImages = async (req, res) => {
  try {
    const data = await service.saveUploadedImages(req.body);

    res.json({
      success: true,
      message: "Images saved successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteImage = async (req, res) => {
  try {
    await service.deleteImage(Number(req.params.id));

    res.json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getImages,
  createImageUploadUrls,
  saveUploadedImages,
  deleteImage,
};