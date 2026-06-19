const stoneservice = require("../services/stone.service");
const getAuditContext = require("../utils/getAuditContext");
const { serialize } = require('../utils/serialize');

// ================== GET ALLs ==================

const getStones = async (
  req,
  res
) => {

  try {

    const result =
      await stoneservice.getStones();

    res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

const getCategoryProducts = async (
  req,
  res
) => {

  try {

    const { slug } =
      req.params;

    const data =
      await stoneservice.getCategoryProducts(
        slug
      );

    res.status(200).json({
      success: true,
      ...data
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

const getProductDetails = async (
  req,
  res
) => {

  try {

    const { slug } =
      req.params;

    const product =
      await stoneservice.getProductDetails(
        slug
      );

    res.status(200).json({
      success: true,
      product
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

// ==================  CATEGORY CRUD ==================

const createCategory = async (
  req,
  res
) => {

  try {

    const payload = {
  ...req.body,
};

if (req.file) {

  payload.silica_datasheet_url =
    `/uploads/${req.file.filename}`;

}

const data =
  await stoneservice.createCategory(
    payload,
    getAuditContext(req)
  );

    res.status(201).json({
      success: true,
      data
    });

  } catch (error) {

    // Prisma unique constraint

    if (
      error.code === "P2002"
    ) {

      return res.status(400).json({
        success: false,
        message:
          "Slug already exists"
      });

    }

    // Custom error

    if (
      error.message ===
      "Slug already exists"
    ) {

      return res.status(400).json({
        success: false,
        message: error.message
      });

    }

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

const updateCategory = async (
  req,
  res
) => {

  try {

const payload = {
  ...req.body,
};

if (req.file) {

  payload.silica_datasheet_url =
    `/uploads/${req.file.filename}`;

}

const data =
  await stoneservice.updateCategory(
    req.params.id,
    payload,
    getAuditContext(req)
  );

    res.status(200).json({
      success: true,
      data
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

// ================== PRODUCT CRUD ==================

const createProduct = async (
  req,
  res
) => {

  try {

        const payload = {
      ...req.body,
    };

    if (req.files?.silica_datasheet?.[0]) {
      payload.silica_datasheet_url =
        `/uploads/${req.files.silica_datasheet[0].filename}`;
    }

    const data =
      await stoneservice.createProduct(
        req.body,
        req.files,
        getAuditContext(req)
      );

    res.status(201).json({
      success: true,
      data
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

const updateProduct = async (
  req,
  res
) => {

  try {

        const payload = {
      ...req.body,
    };

    if (req.files?.silica_datasheet?.[0]) {
      payload.silica_datasheet_url =
        `/uploads/${req.files.silica_datasheet[0].filename}`;
    }

    const data =
      await stoneservice.updateProduct(

        req.params.id,

        req.body,

        req.files,

        getAuditContext(req)

      );

    res.status(200).json({
      success: true,
      data
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

const deleteProduct = async (
  req,
  res
) => {

  try {

    const data =
      await stoneservice.deleteProduct(
        req.params.id,
        getAuditContext(req)
      );

    res.status(200).json({
      success: true,
      data: serialize(data)
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

const bulkCreateProducts = async (
  req,
  res
) => {
  try {
    const result =
      await stoneservice.bulkCreateProducts(
        req.body.products,
        getAuditContext(req)
      );

    return res.status(201).json({
      success: true,
      message: `${result.count} products created successfully`,
      data: result,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Bulk upload failed",
    });
  }
};

const bulkDeleteProducts = async (
  req,
  res
) => {
  try {

    const { ids } = req.body;

    if (
      !Array.isArray(ids) ||
      ids.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide product ids",
      });
    }



    const result =
      await stoneservice.bulkDeleteProducts(
        ids,
        getAuditContext(req)
      );

    return res.json({
      success: true,
      data: result,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

const updateProductStatus = async (
  req,
  res
) => {
  try {

    const { is_active } = req.body;

    const product =
      await stoneservice.updateProductStatus(
        req.params.id,
        is_active
      );

    res.status(200).json({
      success: true,
      message:
        "Product status updated successfully",
      data: product,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

module.exports = {

  getStones,

  getCategoryProducts,

  getProductDetails,

  createCategory,

  updateCategory,

  createProduct,

  updateProduct,

  deleteProduct,

  bulkCreateProducts,

  bulkDeleteProducts,

  updateProductStatus,



};