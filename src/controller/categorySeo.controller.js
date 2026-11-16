
const service = require("../services/categorySeo.service");

const getAuditContext = require("../utils/getAuditContext");

// ============================================
// ERROR HANDLER
// ============================================

const sendError = (res, error) => {
  console.error("Category SEO Error:", error);

  const status =
    Number.isInteger(error.status) &&
    error.status >= 400 &&
    error.status <= 499
      ? error.status
      : 500;

  return res.status(status).json({
    success: false,
    message:
      status === 500
        ? "Failed to process category SEO"
        : error.message,
  });
};

// ============================================
// GET ALL
// ============================================

const getAllCategorySeo = async (req, res) => {
  try {
    const data = await service.getAllCategorySeo(
      req.query
    );

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

// ============================================
// GET BY ID
// ============================================

const getCategorySeoById = async (req, res) => {
  try {
    const data = await service.getCategorySeoById(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

// ============================================
// PUBLIC GET BY SLUG
// ============================================

const getPublicCategorySeo = async (req, res) => {
  try {
    const data = await service.getPublicCategorySeo(
      req.params.slug
    );

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

// ============================================
// CREATE SEO
// ============================================

const createCategorySeo = async (req, res) => {
  try {
    const data = await service.createCategorySeo(
      req.params.id,
      req.body,
      getAuditContext(req)
    );

    return res.status(201).json({
      success: true,
      message: "Category SEO saved successfully",
      data,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

// ============================================
// UPDATE SEO
// ============================================

const updateCategorySeo = async (req, res) => {
  try {
    const data = await service.updateCategorySeo(
      req.params.id,
      req.body,
      getAuditContext(req)
    );

    return res.status(200).json({
      success: true,
      message: "Category SEO updated successfully",
      data,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

// ============================================
// DELETE / CLEAR SEO
// ============================================

const deleteCategorySeo = async (req, res) => {
  try {
    const data = await service.deleteCategorySeo(
      req.params.id,
      getAuditContext(req)
    );

    return res.status(200).json({
      success: true,
      message: "Category SEO cleared successfully",
      data,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

module.exports = {
  getAllCategorySeo,
  getCategorySeoById,
  getPublicCategorySeo,
  createCategorySeo,
  updateCategorySeo,
  deleteCategorySeo,
};
