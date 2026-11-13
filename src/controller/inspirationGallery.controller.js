
const service = require("../services/inspirationGallery.service");

// =========================================================
// SAFE ERROR HANDLING
// =========================================================

// Only explicitly approved service messages can be
// returned to API clients.

const SAFE_GALLERY_ERRORS = {
  "Product slug is required": 400,
  "Product not found": 404,
  "Gallery image not found": 404,
  "Invalid product ID": 400,
  "One or more products were not found": 400,
  "Image not found": 404,
};

const sendGalleryError = (
  res,
  error,
  label,
  fallbackMessage,
  allowedMessages = []
) => {
  // Full error details remain server-side only.
  console.error(label, error);

  const message = error?.message;

  if (
    allowedMessages.includes(message) &&
    Object.prototype.hasOwnProperty.call(
      SAFE_GALLERY_ERRORS,
      message
    )
  ) {
    return res.status(
      SAFE_GALLERY_ERRORS[message]
    ).json({
      success: false,
      message,
    });
  }

  // Never expose unexpected internal error messages.
  return res.status(500).json({
    success: false,
    message: fallbackMessage,
  });
};

// =========================================================
// CATEGORIES
// =========================================================

const getCategories = async (req, res) => {
  try {
    const data = await service.getCategories();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return sendGalleryError(
      res,
      error,
      "Get inspiration gallery categories error:",
      "Failed to fetch gallery categories"
    );
  }
};

const createCategory = async (req, res) => {
  try {
    const data = await service.createCategory(
      req.body
    );

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data,
    });
  } catch (error) {
    return sendGalleryError(
      res,
      error,
      "Create inspiration gallery category error:",
      "Failed to create gallery category"
    );
  }
};

const updateCategory = async (req, res) => {
  try {
    const categoryId = Number(
      req.params.id
    );

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "Valid category ID is required",
      });
    }

    const data = await service.updateCategory(
      categoryId,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data,
    });
  } catch (error) {
    return sendGalleryError(
      res,
      error,
      "Update inspiration gallery category error:",
      "Failed to update gallery category"
    );
  }
};

const deleteCategory = async (req, res) => {
  try {
    const categoryId = Number(
      req.params.id
    );

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "Valid category ID is required",
      });
    }

    await service.deleteCategory(
      categoryId
    );

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    return sendGalleryError(
      res,
      error,
      "Delete inspiration gallery category error:",
      "Failed to delete gallery category"
    );
  }
};

// =========================================================
// IMAGES
// =========================================================

const getImages = async (req, res) => {
  try {
    const result = await service.getImages({
      categoryId:
        req.query.categoryId,
      page:
        req.query.page,
      limit:
        req.query.limit,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return sendGalleryError(
      res,
      error,
      "Get inspiration gallery images error:",
      "Failed to fetch inspiration gallery images"
    );
  }
};

// =========================================================
// GET IMAGES BY PRODUCT SLUG
// =========================================================

const getImagesBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const images =
      await service.getImagesBySlug(
        slug
      );

    return res.status(200).json({
      success: true,
      data: {
        images,
        count: images.length,
      },
    });
  } catch (error) {
    return sendGalleryError(
      res,
      error,
      "Get inspiration images by slug error:",
      "Failed to fetch product inspiration images",
      [
        "Product slug is required",
        "Product not found",
      ]
    );
  }
};

// =========================================================
// IMAGE UPLOAD
// =========================================================

const createImageUploadUrls = async (
  req,
  res
) => {
  try {
    const data =
      await service.createImageUploadUrls(
        req.body
      );

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return sendGalleryError(
      res,
      error,
      "Create inspiration gallery upload URLs error:",
      "Failed to create image upload URLs"
    );
  }
};

const saveUploadedImages = async (
  req,
  res
) => {
  try {
    const data =
      await service.saveUploadedImages(
        req.body
      );

    return res.status(201).json({
      success: true,
      message: "Images saved successfully",
      data,
    });
  } catch (error) {
    return sendGalleryError(
      res,
      error,
      "Save inspiration gallery images error:",
      "Failed to save gallery images"
    );
  }
};

// =========================================================
// SEARCH PRODUCTS
// =========================================================

/*
 * GET
 * /api/inspiration-gallery/products?search=calacatta
 *
 * Used by the CMS product selector.
 */

const searchProducts = async (
  req,
  res
) => {
  try {
    const search = String(
      req.query.search || ""
    ).trim();

    const products =
      await service.searchProducts(
        search
      );

    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    return sendGalleryError(
      res,
      error,
      "Search inspiration gallery products error:",
      "Failed to search products"
    );
  }
};

// =========================================================
// GET PRODUCTS LINKED TO IMAGE
// =========================================================

/*
 * GET
 * /api/inspiration-gallery/images/:id/products
 *
 * Example:
 * /api/inspiration-gallery/images/474/products
 */

const getImageProducts = async (
  req,
  res
) => {
  try {
    const imageId = Number(
      req.params.id
    );

    if (
      !Number.isInteger(imageId) ||
      imageId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Valid image ID is required",
      });
    }

    const products =
      await service.getImageProducts(
        imageId
      );

    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    return sendGalleryError(
      res,
      error,
      "Get inspiration image products error:",
      "Failed to fetch linked products",
      [
        "Gallery image not found",
      ]
    );
  }
};

// =========================================================
// UPDATE PRODUCTS LINKED TO IMAGE
// =========================================================

/*
 * PUT
 * /api/inspiration-gallery/images/:id/products
 *
 * Body:
 *
 * {
 *   "product_ids": [
 *     "891",
 *     "889",
 *     "887"
 *   ]
 * }
 *
 * [] is valid and means remove all product links.
 */

const updateImageProducts = async (
  req,
  res
) => {
  try {
    const imageId = Number(
      req.params.id
    );

    if (
      !Number.isInteger(imageId) ||
      imageId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Valid image ID is required",
      });
    }

    const {
      product_ids,
    } = req.body;

    if (!Array.isArray(product_ids)) {
      return res.status(400).json({
        success: false,
        message:
          "product_ids must be an array",
      });
    }

    /*
     * Keep IDs as strings here.
     * Service will safely convert them
     * to BigInt for Prisma/PostgreSQL.
     */

    const productIds =
      product_ids.map(
        (id) => String(id)
      );

    const products =
      await service.updateImageProducts(
        imageId,
        productIds
      );

    return res.status(200).json({
      success: true,
      message:
        "Linked products updated successfully",
      data: products,
    });
  } catch (error) {
    return sendGalleryError(
      res,
      error,
      "Update inspiration image products error:",
      "Failed to update linked products",
      [
        "Gallery image not found",
        "Invalid product ID",
        "One or more products were not found",
      ]
    );
  }
};

// =========================================================
// UPDATE IMAGE ALT
// =========================================================

const updateImageAlt = async (
  req,
  res,
  next
) => {
  try {
    const image =
      await service.updateImageAlt(
        req.params.id,
        req.body
      );

    return res.status(200).json({
      success: true,
      message:
        "Image alt text updated successfully",
      image,
    });
  } catch (error) {
    // Existing global error middleware handles this.
    return next(error);
  }
};

// =========================================================
// DELETE IMAGE
// =========================================================

const deleteImage = async (
  req,
  res
) => {
  try {
    const imageId = Number(
      req.params.id
    );

    if (
      !Number.isInteger(imageId) ||
      imageId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Valid image ID is required",
      });
    }

    await service.deleteImage(
      imageId
    );

    return res.status(200).json({
      success: true,
      message:
        "Image deleted successfully",
    });
  } catch (error) {
    return sendGalleryError(
      res,
      error,
      "Delete inspiration gallery image error:",
      "Failed to delete gallery image",
      [
        "Image not found",
      ]
    );
  }
};

// =========================================================
// EXPORTS
// =========================================================

module.exports = {
  // Categories
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,

  // Images
  getImages,
  getImagesBySlug,
  createImageUploadUrls,
  saveUploadedImages,

  // Image ↔ Product
  searchProducts,
  getImageProducts,
  updateImageProducts,

  // Image update/delete
  updateImageAlt,
  deleteImage,
};
