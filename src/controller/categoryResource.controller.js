const service = require("../services/categoryResource.service");

const getAuditContext = require("../utils/getAuditContext");

const {
  uploadToR2,
  deleteFileFromR2,
} = require("../utils/uploadToR2");

// ==============================
// HELPERS
// ==============================

const sendError = (res, error) => {
  console.error("Category Resource Error:", error);

  if (error.code === "P2002") {
    return res.status(409).json({
      success: false,
      message:
        "A resource with this slug already exists in the category",
    });
  }

  if (error.code === "P2003") {
    return res.status(400).json({
      success: false,
      message: "Invalid category reference",
    });
  }

  return res.status(error.status || 500).json({
    success: false,
    message:
      error.status || process.env.NODE_ENV === "development"
        ? error.message
        : "Failed to process category resource",
  });
};

const validatePdf = (file) => {
  if (!file) {
    return;
  }

  const maxSize = 100 * 1024 * 1024;

  if (file.size > maxSize) {
    const error = new Error(
      "PDF size cannot exceed 100 MB"
    );
    error.status = 400;
    throw error;
  }

  if (file.mimetype !== "application/pdf") {
    const error = new Error(
      "Only PDF files are allowed"
    );
    error.status = 400;
    throw error;
  }
};

const uploadPdf = async (file) => {
  validatePdf(file);

  // Uses your existing R2 upload utility.
  const uploaded = await uploadToR2(
    file,
    "ultrastones/category-resources"
  );

  return {
    secure_url: uploaded.secure_url,
    public_id: uploaded.public_id,
    file_name: file.originalname,
    file_size: file.size,
  };
};

const cleanupFile = async (key) => {
  if (!key) {
    return;
  }

  try {
    await deleteFileFromR2(key);
  } catch (error) {
    console.error(
      "Failed to clean R2 resource:",
      error
    );
  }
};

// ==============================
// GET ALL
// ==============================

const getResources = async (req, res) => {
  try {
    const data = await service.getResources(
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

// ==============================
// GET ALL ACTIVE RESOURCES - PUBLIC
// ==============================

const getPublicResources = async (req, res) => {
  try {
    const data = await service.getPublicResources();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

// ==============================
// GET BY CATEGORY
// ==============================

const getResourcesByCategory = async (
  req,
  res
) => {
  try {
    const data =
      await service.getResourcesByCategory(
        req.params.slug
      );

    return res.status(200).json({
      success: true,
      ...data,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

// ==============================
// GET BY ID
// ==============================

const getResourceById = async (req, res) => {
  try {
    const data = await service.getResourceById(
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

// ==============================
// CREATE
// ==============================

const createResource = async (req, res) => {
  let uploadedFile = null;
  let saved = false;

  try {
    const file = req.files?.pdf?.[0];

    const type = String(
      req.body.resource_type || ""
    ).toUpperCase();

    if (file && type !== "PDF") {
      const error = new Error(
        "PDF upload requires resource_type PDF"
      );
      error.status = 400;
      throw error;
    }

    if (type === "PDF" && !file) {
      const error = new Error(
        "Please upload a PDF file"
      );
      error.status = 400;
      throw error;
    }

    if (file) {
      uploadedFile = await uploadPdf(file);
    }

    const data = await service.createResource(
      req.body,
      uploadedFile,
      getAuditContext(req)
    );

    saved = true;

    return res.status(201).json({
      success: true,
      message: "Resource created successfully",
      data,
    });
  } catch (error) {
    if (!saved && uploadedFile?.public_id) {
      await cleanupFile(uploadedFile.public_id);
    }

    return sendError(res, error);
  }
};

// ==============================
// UPDATE
// ==============================

const updateResource = async (req, res) => {
  let uploadedFile = null;
  let saved = false;

  try {
    const file = req.files?.pdf?.[0];

    if (file) {
      uploadedFile = await uploadPdf(file);
    }

    const result = await service.updateResource(
      req.params.id,
      req.body,
      uploadedFile,
      getAuditContext(req)
    );

    saved = true;

    if (
      result.previousFileKey &&
      result.previousFileKey !== result.currentFileKey
    ) {
      await cleanupFile(result.previousFileKey);
    }

    return res.status(200).json({
      success: true,
      message: "Resource updated successfully",
      data: result.resource,
    });
  } catch (error) {
    if (!saved && uploadedFile?.public_id) {
      await cleanupFile(uploadedFile.public_id);
    }

    return sendError(res, error);
  }
};

// ==============================
// UPDATE STATUS
// ==============================

const updateResourceStatus = async (
  req,
  res
) => {
  try {
    const data =
      await service.updateResourceStatus(
        req.params.id,
        req.body.is_active,
        getAuditContext(req)
      );

    return res.status(200).json({
      success: true,
      message: "Resource status updated",
      data,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

// ==============================
// DELETE
// ==============================

const deleteResource = async (req, res) => {
  try {
    const result = await service.deleteResource(
      req.params.id,
      getAuditContext(req)
    );

    // Delete R2 object after DB deletion succeeds.
    await cleanupFile(result.fileKey);

    return res.status(200).json({
      success: true,
      message: "Resource deleted successfully",
      data: result.resource,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

module.exports = {
  getResources,
  getPublicResources,
  getResourcesByCategory,
  getResourceById,
  createResource,
  updateResource,
  updateResourceStatus,
  deleteResource,
};