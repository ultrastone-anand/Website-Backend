const prisma = require("../config/prisma");
const stoneservice = require("../services/stone.service");
const getAuditContext = require("../utils/getAuditContext");
const { createR2UploadUrl} = require("../utils/r2Presigned");
const { serialize } = require('../utils/serialize');
const { uploadToR2 , deleteFileFromR2 } = require("../utils/uploadToR2");




const getR2ObjectKeyFromUrl = (fileUrl) => {
  if (!fileUrl || !process.env.R2_PUBLIC_URL) {
    return null;
  }

  const normalizedPublicUrl =
    process.env.R2_PUBLIC_URL.replace(/\/+$/, '');

  const normalizedFileUrl = String(fileUrl).trim();

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

const searchProducts = async (
  req,
  res
) => {
  try {
    const searchTerm =
      String(
        req.query.q || ''
      ).trim();

    if (
      searchTerm.length < 2
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Enter at least 2 characters',
      });
    }

    const requestedPage =
      Number.parseInt(
        req.query.page,
        10
      );

    const requestedLimit =
      Number.parseInt(
        req.query.limit,
        10
      );

    const page =
      Number.isInteger(
        requestedPage
      ) &&
      requestedPage > 0
        ? requestedPage
        : 1;

    const limit =
      Number.isInteger(
        requestedLimit
      ) &&
      requestedLimit > 0
        ? Math.min(
            requestedLimit,
            50
          )
        : 24;

    const categoryId =
      req.query.category_id ||
      null;

    const allowedStatuses = [
      'active',
      'inactive',
      'all',
    ];

    const requestedStatus =
      String(
        req.query.status ||
          'active'
      ).toLowerCase();

    const status =
      allowedStatuses.includes(
        requestedStatus
      )
        ? requestedStatus
        : 'active';

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
      message:
        'Products searched successfully',
      data: result.products,
      pagination:
        result.pagination,
    });
  } catch (error) {
    console.error(
      'searchProducts error:',
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        'Failed to search products',
    });
  }
};

// ==================  CATEGORY CRUD ==================

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

    // Upload category thumbnail to Cloudflare R2
    if (thumbnailFile) {
      const uploadedThumbnail =
        await uploadToR2(
          thumbnailFile,
          'category-thumbnails'
        );

      payload.thumbnail_url =
        uploadedThumbnail.secure_url;

      uploadedThumbnailKey =
        uploadedThumbnail.public_id;
    }

    // Upload silica datasheet PDF to Cloudflare R2
    if (silicaDatasheetFile) {
      const uploadedDatasheet =
        await uploadToR2(
          silicaDatasheetFile,
          'category-silica-datasheets'
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
    const cleanupPromises = [];

    // Delete orphaned thumbnail if DB creation fails.
    if (uploadedThumbnailKey) {
      cleanupPromises.push(
        deleteFileFromR2(
          uploadedThumbnailKey
        ).catch((deleteError) => {
          console.error(
            'Failed to clean uploaded thumbnail:',
            deleteError
          );
        })
      );
    }

    // Delete orphaned PDF if DB creation fails.
    if (uploadedDatasheetKey) {
      cleanupPromises.push(
        deleteFileFromR2(
          uploadedDatasheetKey
        ).catch((deleteError) => {
          console.error(
            'Failed to clean uploaded datasheet:',
            deleteError
          );
        })
      );
    }

    await Promise.all(cleanupPromises);

    if (error.code === 'P2002') {
      const target =
        Array.isArray(error.meta?.target)
          ? error.meta.target.join(', ')
          : error.meta?.target;

      return res.status(400).json({
        success: false,
        message: target?.includes('name')
          ? 'Category name already exists'
          : 'Slug already exists',
      });
    }

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        'Failed to create category',
    });
  }
};

const updateCategory = async (req, res) => {
  let newlyUploadedThumbnailKey = null;
  let newlyUploadedDatasheetKey = null;

  try {
    const categoryId = Number(req.params.id);

    if (!Number.isInteger(categoryId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID',
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
        message: 'Category not found',
      });
    }

    const payload = {
      ...req.body,
    };

    const thumbnailFile =
      req.files?.thumbnail?.[0];

    const silicaDatasheetFile =
      req.files?.silica_datasheet?.[0];

    // Upload new thumbnail to R2.
    if (thumbnailFile) {
      const uploadedThumbnail =
        await uploadToR2(
          thumbnailFile,
          'category-thumbnails'
        );

      payload.thumbnail_url =
        uploadedThumbnail.secure_url;

      newlyUploadedThumbnailKey =
        uploadedThumbnail.public_id;
    }

    // Upload new silica datasheet PDF to R2.
    if (silicaDatasheetFile) {
      const uploadedDatasheet =
        await uploadToR2(
          silicaDatasheetFile,
          'category-silica-datasheets'
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

    // Delete old thumbnail only after successful DB update.
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
          deleteFileFromR2(
            oldThumbnailKey
          ).catch((deleteError) => {
            console.error(
              'Failed to delete previous thumbnail:',
              deleteError
            );
          })
        );
      }
    }

    // Delete old PDF only after successful DB update.
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
          deleteFileFromR2(
            oldDatasheetKey
          ).catch((deleteError) => {
            console.error(
              'Failed to delete previous datasheet:',
              deleteError
            );
          })
        );
      }
    }

    await Promise.all(cleanupPromises);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    const cleanupPromises = [];

    // Delete newly uploaded thumbnail if DB update fails.
    if (newlyUploadedThumbnailKey) {
      cleanupPromises.push(
        deleteFileFromR2(
          newlyUploadedThumbnailKey
        ).catch((deleteError) => {
          console.error(
            'Failed to clean uploaded thumbnail:',
            deleteError
          );
        })
      );
    }

    // Delete newly uploaded PDF if DB update fails.
    if (newlyUploadedDatasheetKey) {
      cleanupPromises.push(
        deleteFileFromR2(
          newlyUploadedDatasheetKey
        ).catch((deleteError) => {
          console.error(
            'Failed to clean uploaded datasheet:',
            deleteError
          );
        })
      );
    }

    await Promise.all(cleanupPromises);

    if (error.code === 'P2002') {
      const target =
        Array.isArray(error.meta?.target)
          ? error.meta.target.join(', ')
          : error.meta?.target;

      return res.status(400).json({
        success: false,
        message: target?.includes('name')
          ? 'Category name already exists'
          : 'Slug already exists',
      });
    }

    if (
      error.message === 'Category not found'
    ) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        'Failed to update category',
    });
  }
};
// ================== PRODUCT CRUD ==================

const createProduct = async (
  req,
  res
) => {
  let uploadedDatasheetKey = null;

  try {
    const payload = {
      ...req.body,
    };

    const silicaDatasheetFile =
      req.files?.silica_datasheet?.[0];

    // Upload silica datasheet PDF to R2
    if (silicaDatasheetFile) {
      const uploadedDatasheet =
        await uploadToR2(
          silicaDatasheetFile,
          "ultrastones/products/silica-datasheets"
        );

      payload.silica_datasheet_url =
        uploadedDatasheet.secure_url;

      uploadedDatasheetKey =
        uploadedDatasheet.public_id;
    }

    /*
     * Remove silica_datasheet from files because
     * it has already been uploaded to R2.
     *
     * All other product files remain unchanged.
     */
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
    /*
     * If R2 upload succeeded but database creation
     * failed, delete the orphaned PDF.
     */
    if (uploadedDatasheetKey) {
      await deleteFileFromR2(
        uploadedDatasheetKey
      ).catch((deleteError) => {
        console.error(
          "Failed to clean uploaded product datasheet:",
          deleteError
        );
      });
    }

    console.error(
      "createProduct error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to create product",
    });
  }
};

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
      const uploadedDatasheet =
        await uploadToR2(
          silicaDatasheetFile,
          "ultrastones/products/silica-datasheets"
        );

      payload.silica_datasheet_url =
        uploadedDatasheet.secure_url;

      newlyUploadedDatasheetKey =
        uploadedDatasheet.public_id;
    }

    /*
     * The PDF is already uploaded by the controller.
     * Other product media still goes to the service.
     */
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

    /*
     * Delete the old R2 PDF only after the database
     * update succeeds.
     */
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
        await deleteFileFromR2(
          oldDatasheetKey
        ).catch((deleteError) => {
          console.error(
            "Failed to delete previous product datasheet:",
            deleteError
          );
        });
      }
    }

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    /*
     * The new PDF reached R2, but the service or
     * database update failed.
     */
    if (newlyUploadedDatasheetKey) {
      await deleteFileFromR2(
        newlyUploadedDatasheetKey
      ).catch((deleteError) => {
        console.error(
          "Failed to remove orphaned product datasheet:",
          deleteError
        );
      });
    }

    console.error(
      "updateProduct error:",
      error
    );

    if (
      error.message ===
      "Product not found"
    ) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    if (error.code === "P2002") {
      return res.status(400).json({
        success: false,
        message:
          "Product name or slug already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to update product",
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
        message:
          "Please provide product ids",
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

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

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
        message:
          "Please provide product ids",
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

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

 const deleteStoneProductMedia = async (req, res) => {
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

        console.error(error);

        return res.status(400).json({
            success: false,
            message: error.message,
        });

    }
};

const getVideoUploadUrl = async (req, res) => {
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
    console.error("Presigned URL Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const getMediaBase64 = async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: "Image URL is required",
      });
    }

    const result = await stoneservice.getMediaBase64(url);

    res.json({
      success: true,
      ...result,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getBrowseProducts = async (req, res) => {

  try {

    const requestedLimit = Number.parseInt(req.query.limit, 10);

    const limit =

      Number.isInteger(requestedLimit) && requestedLimit > 0

        ? Math.min(requestedLimit, 20)

        : 6;

    const products = await stoneservice.getBrowseProducts(limit);

    return res.status(200).json({

      success: true,

      message: "Browse products fetched successfully",

      count: products.length,

      data: products,

    });

  } catch (error) {

    console.error("getBrowseProducts error:", error);

    return res.status(500).json({

      success: false,

      message: "Failed to fetch browse products",

      error:

        process.env.NODE_ENV === "development"

          ? error.message

          : undefined,

    });

  }

};

module.exports = {
  getStones,
  getCategoryProducts,
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