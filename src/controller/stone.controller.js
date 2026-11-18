
const prisma = require("../config/prisma");

const stoneservice = require("../services/stone.service");

const getAuditContext = require("../utils/getAuditContext");

const { createR2UploadUrl } = require("../utils/r2Presigned");

const { serialize } = require("../utils/serialize");

const {
  uploadToR2,
  deleteFileFromR2,
} = require("../utils/uploadToR2");

// ======================================================
// SAFE ERROR HANDLING
// ======================================================

const sendStoneError = (
  res,
  error,
  label,
  fallbackMessage
) => {
  console.error(label, error);

  return res.status(500).json({
    success: false,
    message: fallbackMessage,
  });
};

const sendKnownStoneError = (
  res,
  error,
  label,
  fallbackMessage,
  knownErrors = {}
) => {
  console.error(label, error);

  const message = error?.message;

  if (
    typeof message === "string" &&
    Object.prototype.hasOwnProperty.call(
      knownErrors,
      message
    )
  ) {
    return res.status(knownErrors[message]).json({
      success: false,
      message,
    });
  }

  return res.status(500).json({
    success: false,
    message: fallbackMessage,
  });
};

// ======================================================
// R2 HELPERS
// ======================================================

const getR2ObjectKeyFromUrl = (fileUrl) => {
  if (!fileUrl || !process.env.R2_PUBLIC_URL) {
    return null;
  }

  const normalizedPublicUrl =
    process.env.R2_PUBLIC_URL.replace(/\/+$/, "");

  const normalizedFileUrl =
    String(fileUrl).trim();

  if (
    !normalizedFileUrl.startsWith(
      `${normalizedPublicUrl}/`
    )
  ) {
    return null;
  }

  return normalizedFileUrl.slice(
    normalizedPublicUrl.length + 1
  );
};

const cleanupR2Object = async (
  objectKey,
  errorLabel
) => {
  if (!objectKey) {
    return;
  }

  try {
    await deleteFileFromR2(objectKey);
  } catch (error) {
    console.error(errorLabel, error);
  }
};

// ======================================================
// GET ALL STONES
// ======================================================

const getStones = async (req, res) => {
  try {
    const result =
      await stoneservice.getStones();

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return sendStoneError(
      res,
      error,
      "Get Stones Error:",
      "Failed to fetch stones"
    );
  }
};

// ======================================================
// GET CATEGORY PRODUCTS
// ======================================================

const getCategoryProducts = async (req, res) => {
  try {
    const { slug } = req.params;

    const data =
      await stoneservice.getCategoryProducts(slug);

    return res.status(200).json({
      success: true,
      ...data,
    });
  } catch (error) {
    return sendStoneError(
      res,
      error,
      "Get Category Products Error:",
      "Failed to fetch category products"
    );
  }
};

// ======================================================
// GET PRODUCT DETAILS
// ======================================================



const getAdminProductDetails = async (req, res) => {
  try {
    const { slug } = req.params;

    const product =
      await stoneservice.getAdminProductDetails(slug);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: serialize(product),
    });
  } catch (error) {
    return sendStoneError(
      res,
      error,
      "Get Admin Product Details Error:",
      "Unable to retrieve product"
    );
  }
};


const getProductDetails = async (req, res) => {
  try {
    const { slug } = req.params;

    const product =
      await stoneservice.getProductDetails(slug);

    // Product does not exist, is inactive,
    // or is not published.
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Product is active and published.
    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    return sendStoneError(
      res,
      error,
      "Get Product Details Error:",
      "Failed to fetch product details"
    );
  }
};

// ======================================================
// SEARCH PRODUCTS
// ======================================================

const searchProducts = async (req, res) => {
  try {
    const searchTerm = String(
      req.query.q || ""
    ).trim();

    if (searchTerm.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Enter at least 2 characters",
      });
    }

    const requestedPage = Number.parseInt(
      req.query.page,
      10
    );

    const requestedLimit = Number.parseInt(
      req.query.limit,
      10
    );

    const page =
      Number.isInteger(requestedPage) &&
      requestedPage > 0
        ? requestedPage
        : 1;

    const limit =
      Number.isInteger(requestedLimit) &&
      requestedLimit > 0
        ? Math.min(requestedLimit, 50)
        : 24;

    const categoryId =
      req.query.category_id || null;

    const allowedStatuses = [
      "active",
      "inactive",
      "all",
    ];

    const requestedStatus = String(
      req.query.status || "active"
    ).toLowerCase();

    const status = allowedStatuses.includes(
      requestedStatus
    )
      ? requestedStatus
      : "active";

    const result =
      await stoneservice.searchProducts({
        searchTerm,
        categoryId,
        status,
        page,
        limit,
      });

    return res.status(200).json({
      success: true,
      message: "Products searched successfully",
      data: result.products,
      pagination: result.pagination,
    });
  } catch (error) {
    return sendStoneError(
      res,
      error,
      "Search Products Error:",
      "Failed to search products"
    );
  }
};

// ======================================================
// CATEGORY CRUD
// ======================================================

const createCategory = async (req, res) => {
  let uploadedThumbnailKey = null;
  let uploadedDatasheetKey = null;

  try {
    const payload = {
      ...req.body,
    };

    const thumbnailFile =
      req.files?.thumbnail?.[0];

    const silicaDatasheetFile =
      req.files?.silica_datasheet?.[0];

    if (thumbnailFile) {
      const uploadedThumbnail = await uploadToR2(
        thumbnailFile,
        "category-thumbnails"
      );

      payload.thumbnail_url =
        uploadedThumbnail.secure_url;

      uploadedThumbnailKey =
        uploadedThumbnail.public_id;
    }

    if (silicaDatasheetFile) {
      const uploadedDatasheet = await uploadToR2(
        silicaDatasheetFile,
        "category-silica-datasheets"
      );

      payload.silica_datasheet_url =
        uploadedDatasheet.secure_url;

      uploadedDatasheetKey =
        uploadedDatasheet.public_id;
    }

    const data =
      await stoneservice.createCategory(
        payload,
        getAuditContext(req)
      );

    return res.status(201).json({
      success: true,
      data,
    });
  } catch (error) {
    await Promise.all([
      cleanupR2Object(
        uploadedThumbnailKey,
        "Failed to clean uploaded thumbnail:"
      ),
      cleanupR2Object(
        uploadedDatasheetKey,
        "Failed to clean uploaded datasheet:"
      ),
    ]);

    console.error("Create Category Error:", error);

    if (error?.code === "P2002") {
      const target = Array.isArray(
        error.meta?.target
      )
        ? error.meta.target.join(", ")
        : error.meta?.target;

      return res.status(400).json({
        success: false,
        message:
          typeof target === "string" &&
          target.includes("name")
            ? "Category name already exists"
            : "Slug already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create category",
    });
  }
};

// ======================================================
// UPDATE CATEGORY
// ======================================================

const updateCategory = async (req, res) => {
  let newlyUploadedThumbnailKey = null;
  let newlyUploadedDatasheetKey = null;

  try {
    const categoryId = Number(req.params.id);

    if (!Number.isInteger(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const existingCategory =
      await prisma.stone_categories.findUnique({
        where: {
          id: categoryId,
        },
      });

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const payload = {
      ...req.body,
    };

    const thumbnailFile =
      req.files?.thumbnail?.[0];

    const silicaDatasheetFile =
      req.files?.silica_datasheet?.[0];

    if (thumbnailFile) {
      const uploadedThumbnail = await uploadToR2(
        thumbnailFile,
        "category-thumbnails"
      );

      payload.thumbnail_url =
        uploadedThumbnail.secure_url;

      newlyUploadedThumbnailKey =
        uploadedThumbnail.public_id;
    }

    if (silicaDatasheetFile) {
      const uploadedDatasheet = await uploadToR2(
        silicaDatasheetFile,
        "category-silica-datasheets"
      );

      payload.silica_datasheet_url =
        uploadedDatasheet.secure_url;

      newlyUploadedDatasheetKey =
        uploadedDatasheet.public_id;
    }

    const data =
      await stoneservice.updateCategory(
        categoryId,
        payload,
        getAuditContext(req)
      );

    const cleanupPromises = [];

    if (
      thumbnailFile &&
      existingCategory.thumbnail_url &&
      existingCategory.thumbnail_url !==
        payload.thumbnail_url
    ) {
      const oldThumbnailKey =
        getR2ObjectKeyFromUrl(
          existingCategory.thumbnail_url
        );

      if (oldThumbnailKey) {
        cleanupPromises.push(
          cleanupR2Object(
            oldThumbnailKey,
            "Failed to delete previous thumbnail:"
          )
        );
      }
    }

    if (
      silicaDatasheetFile &&
      existingCategory.silica_datasheet_url &&
      existingCategory.silica_datasheet_url !==
        payload.silica_datasheet_url
    ) {
      const oldDatasheetKey =
        getR2ObjectKeyFromUrl(
          existingCategory.silica_datasheet_url
        );

      if (oldDatasheetKey) {
        cleanupPromises.push(
          cleanupR2Object(
            oldDatasheetKey,
            "Failed to delete previous datasheet:"
          )
        );
      }
    }

    await Promise.all(cleanupPromises);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    await Promise.all([
      cleanupR2Object(
        newlyUploadedThumbnailKey,
        "Failed to clean uploaded thumbnail:"
      ),
      cleanupR2Object(
        newlyUploadedDatasheetKey,
        "Failed to clean uploaded datasheet:"
      ),
    ]);

    console.error("Update Category Error:", error);

    if (error?.code === "P2002") {
      const target = Array.isArray(
        error.meta?.target
      )
        ? error.meta.target.join(", ")
        : error.meta?.target;

      return res.status(400).json({
        success: false,
        message:
          typeof target === "string" &&
          target.includes("name")
            ? "Category name already exists"
            : "Slug already exists",
      });
    }

    if (error?.message === "Category not found") {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update category",
    });
  }
};

// ======================================================
// PRODUCT CRUD
// ======================================================

const createProduct = async (req, res) => {
  let uploadedDatasheetKey = null;

  try {
    const payload = {
      ...req.body,
    };

    const silicaDatasheetFile =
      req.files?.silica_datasheet?.[0];

    if (silicaDatasheetFile) {
      const uploadedDatasheet = await uploadToR2(
        silicaDatasheetFile,
        "ultrastones/products/silica-datasheets"
      );

      payload.silica_datasheet_url =
        uploadedDatasheet.secure_url;

      uploadedDatasheetKey =
        uploadedDatasheet.public_id;
    }

    // Datasheet already uploaded by the controller.
    // Preserve all other media for the service.

    const serviceFiles = {
      ...(req.files || {}),
    };

    delete serviceFiles.silica_datasheet;

    const data =
      await stoneservice.createProduct(
        payload,
        serviceFiles,
        getAuditContext(req)
      );

    return res.status(201).json({
      success: true,
      data,
    });
  } catch (error) {
    await cleanupR2Object(
      uploadedDatasheetKey,
      "Failed to clean uploaded product datasheet:"
    );

    return sendStoneError(
      res,
      error,
      "Create Product Error:",
      "Failed to create product"
    );
  }
};

// ======================================================
// UPDATE PRODUCT
// ======================================================

const updateProduct = async (req, res) => {
  let newlyUploadedDatasheetKey = null;

  try {
    let productId;

    try {
      productId = BigInt(req.params.id);
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const existingProduct =
      await prisma.stone_products.findUnique({
        where: {
          id: productId,
        },
        select: {
          id: true,
          silica_datasheet_url: true,
        },
      });

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const payload = {
      ...req.body,
    };

    const silicaDatasheetFile =
      req.files?.silica_datasheet?.[0];

    if (silicaDatasheetFile) {
      const uploadedDatasheet = await uploadToR2(
        silicaDatasheetFile,
        "ultrastones/products/silica-datasheets"
      );

      payload.silica_datasheet_url =
        uploadedDatasheet.secure_url;

      newlyUploadedDatasheetKey =
        uploadedDatasheet.public_id;
    }

    const serviceFiles = {
      ...(req.files || {}),
    };

    delete serviceFiles.silica_datasheet;

    const data =
      await stoneservice.updateProduct(
        req.params.id,
        payload,
        serviceFiles,
        getAuditContext(req)
      );

    // Delete the previous PDF only after
    // the database update succeeds.

    if (
      silicaDatasheetFile &&
      existingProduct.silica_datasheet_url &&
      existingProduct.silica_datasheet_url !==
        payload.silica_datasheet_url
    ) {
      const oldDatasheetKey =
        getR2ObjectKeyFromUrl(
          existingProduct.silica_datasheet_url
        );

      if (oldDatasheetKey) {
        await cleanupR2Object(
          oldDatasheetKey,
          "Failed to delete previous product datasheet:"
        );
      }
    }

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    await cleanupR2Object(
      newlyUploadedDatasheetKey,
      "Failed to remove orphaned product datasheet:"
    );

    console.error("Update Product Error:", error);

    if (error?.message === "Product not found") {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (error?.code === "P2002") {
      return res.status(400).json({
        success: false,
        message:
          "Product name or slug already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update product",
    });
  }
};

// ======================================================
// DELETE PRODUCT
// ======================================================

const deleteProduct = async (req, res) => {
  try {
    const data =
      await stoneservice.deleteProduct(
        req.params.id,
        getAuditContext(req)
      );

    return res.status(200).json({
      success: true,
      data: serialize(data),
    });
  } catch (error) {
    return sendStoneError(
      res,
      error,
      "Delete Product Error:",
      "Failed to delete product"
    );
  }
};

// ======================================================
// BULK CREATE PRODUCTS
// ======================================================

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
      message:
        `${result.count} products created successfully`,
      data: result,
    });
  } catch (error) {
    return sendStoneError(
      res,
      error,
      "Bulk Create Products Error:",
      "Bulk upload failed"
    );
  }
};

// ======================================================
// BULK DEACTIVATE PRODUCTS
// ======================================================

const bulkDeactivateProducts = async (
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
        message: "Please provide product ids",
      });
    }

    const result =
      await stoneservice.bulkDeactivateProducts(
        ids,
        getAuditContext(req)
      );

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return sendStoneError(
      res,
      error,
      "Bulk Deactivate Products Error:",
      "Failed to deactivate products"
    );
  }
};

// ======================================================
// UPDATE PRODUCT STATUS
// ======================================================

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

    return res.status(200).json({
      success: true,
      message:
        "Product status updated successfully",
      data: product,
    });
  } catch (error) {
    return sendStoneError(
      res,
      error,
      "Update Product Status Error:",
      "Failed to update product status"
    );
  }
};

// ======================================================
// UPDATE PUBLISH STATUS
// ======================================================

const updatePublishStatus = async (
  req,
  res
) => {
  try {
    const { id } = req.params;
    const { is_publish } = req.body;

    const result =
      await stoneservice.updatePublishStatus(
        id,
        is_publish,
        getAuditContext(req)
      );

    return res.json({
      success: true,
      data: serialize(result),
    });
  } catch (error) {
    return sendStoneError(
      res,
      error,
      "Update Publish Status Error:",
      "Failed to update publish status"
    );
  }
};

// ======================================================
// BULK PUBLISH PRODUCTS
// ======================================================

const bulkPublishProducts = async (
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
        message: "Please provide product ids",
      });
    }

    const result =
      await stoneservice.bulkPublishProducts(
        ids,
        getAuditContext(req)
      );

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return sendStoneError(
      res,
      error,
      "Bulk Publish Products Error:",
      "Failed to publish products"
    );
  }
};

// ======================================================
// DELETE STONE PRODUCT MEDIA
// ======================================================

const deleteStoneProductMedia = async (
  req,
  res
) => {
  try {
    const { mediaId } = req.params;

    const result =
      await stoneservice.deleteStoneProductMedia(
        mediaId
      );

    return res.status(200).json({
      success: true,
      message: "Media deleted successfully.",
      data: serialize(result),
    });
  } catch (error) {
    return sendKnownStoneError(
      res,
      error,
      "Delete Stone Product Media Error:",
      "Failed to delete product media",
      {
        "Media not found": 404,
        "Invalid media ID": 400,
      }
    );
  }
};

// ======================================================
// VIDEO UPLOAD URL
// ======================================================

const getVideoUploadUrl = async (
  req,
  res
) => {
  try {
    const { fileName } = req.body;

    if (!fileName) {
      return res.status(400).json({
        success: false,
        message: "fileName is required",
      });
    }

    const result = await createR2UploadUrl(
      fileName,
      "ultrastones/products/videos"
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return sendStoneError(
      res,
      error,
      "Presigned URL Error:",
      "Failed to create video upload URL"
    );
  }
};

// ======================================================
// MEDIA BASE64
// ======================================================

const getMediaBase64 = async (
  req,
  res
) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: "Image URL is required",
      });
    }

    const result =
      await stoneservice.getMediaBase64(url);

    return res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    return sendStoneError(
      res,
      error,
      "Get Media Base64 Error:",
      "Failed to fetch image data"
    );
  }
};

// ======================================================
// BROWSE PRODUCTS
// ======================================================

const getBrowseProducts = async (
  req,
  res
) => {
  try {
    const requestedLimit = Number.parseInt(
      req.query.limit,
      10
    );

    const limit =
      Number.isInteger(requestedLimit) &&
      requestedLimit > 0
        ? Math.min(requestedLimit, 20)
        : 6;

    const products =
      await stoneservice.getBrowseProducts(limit);

    return res.status(200).json({
      success: true,
      message:
        "Browse products fetched successfully",
      count: products.length,
      data: products,
    });
  } catch (error) {
    return sendStoneError(
      res,
      error,
      "Get Browse Products Error:",
      "Failed to fetch browse products"
    );
  }
};

// ======================================================
// EXPORTS
// ======================================================

module.exports = {
  getStones,
  getCategoryProducts,
  getAdminProductDetails,
  getProductDetails,
  searchProducts,

  createCategory,
  updateCategory,

  createProduct,
  updateProduct,
  deleteProduct,
  bulkCreateProducts,
  updateProductStatus,
  bulkDeactivateProducts,
  updatePublishStatus,
  bulkPublishProducts,

  deleteStoneProductMedia,
  getVideoUploadUrl,
  getMediaBase64,
  getBrowseProducts,
};
