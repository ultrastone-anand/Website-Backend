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
    const result = await service.getImages({
      categoryId: req.query.categoryId,
      page: req.query.page,
      limit: req.query.limit,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(
      "Get inspiration gallery images error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch inspiration gallery images",
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

const updateImageAlt = async (req, res, next) => {
  try {
    const image = await service.updateImageAlt(
      req.params.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Image alt text updated successfully",
      image,
    });
  } catch (error) {
    return next(error);
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
  updateImageAlt,
};