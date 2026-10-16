const productRegistrationService = require(
  "../services/ProductRegistration.service"
);

const getAuditContext = require("../utils/getAuditContext");

// ======================================================
// ERROR STATUS HELPER
// ======================================================

const getErrorStatusCode = (error) => {
  if (error.statusCode) {
    return error.statusCode;
  }

  if (error.code === "P2025") {
    return 404;
  }

  if (error.code === "P2002") {
    return 409;
  }

  if (error.code === "P2003") {
    return 400;
  }

  if (error.code === "P2004") {
    return 400;
  }

  if (error.code === "P2011") {
    return 400;
  }

  if (error.code === "P2000") {
    return 400;
  }

  return 500;
};

const handleError = (res, error, label) => {
  console.error(label, error);

  const statusCode = getErrorStatusCode(error);

  return res.status(statusCode).json({
    success: false,
    message:
      statusCode === 500
        ? "An unexpected error occurred"
        : error.message,
  });
};

// ======================================================
// PUBLIC SUBMIT REGISTRATION
// ======================================================

const submitRegistration = async (req, res) => {
  try {
    const registration =
      await productRegistrationService.submitRegistration({
        body: req.body,
        files: req.files,
      });

    return res.status(201).json({
      success: true,
      message: "Product registered successfully",
      data: registration,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Submit Product Registration Error:"
    );
  }
};

// ======================================================
// CMS GET REGISTRATIONS
// ======================================================

const getRegistrations = async (req, res) => {
  try {
    const result =
      await productRegistrationService.getRegistrations({
        page: req.query.page,
        limit: req.query.limit,
        search: req.query.search,
        status: req.query.status,
        productCategory: req.query.product_category,
        projectType: req.query.project_type,
        isInstalled: req.query.is_installed,
      });

    return res.status(200).json({
      success: true,
      data: result.registrations,
      pagination: result.pagination,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Get Product Registrations Error:"
    );
  }
};

// ======================================================
// CMS REGISTRATION STATISTICS
// ======================================================

const getRegistrationStats = async (req, res) => {
  try {
    const stats =
      await productRegistrationService.getRegistrationStats();

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Get Product Registration Stats Error:"
    );
  }
};

// ======================================================
// CMS GET REGISTRATION BY ID
// ======================================================

const getRegistrationById = async (req, res) => {
  try {
    const registration =
      await productRegistrationService.getRegistrationById(
        req.params.registrationId
      );

    return res.status(200).json({
      success: true,
      data: registration,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Get Product Registration Error:"
    );
  }
};

// ======================================================
// CMS UPDATE REGISTRATION
// ======================================================

const updateRegistration = async (req, res) => {
  try {
    const registration =
      await productRegistrationService.updateRegistration(
        req.params.registrationId,
        req.body,
        getAuditContext(req)
      );

    return res.status(200).json({
      success: true,
      message: "Registration updated successfully",
      data: registration,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Update Product Registration Error:"
    );
  }
};

// ======================================================
// CMS UPDATE REGISTRATION STATUS
// ======================================================

const updateRegistrationStatus = async (req, res) => {
  try {
    const registration =
      await productRegistrationService.updateRegistrationStatus(
        req.params.registrationId,
        req.body.status,
        getAuditContext(req)
      );

    return res.status(200).json({
      success: true,
      message: "Registration status updated successfully",
      data: registration,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Update Product Registration Status Error:"
    );
  }
};

// ======================================================
// CMS DELETE REGISTRATION
// ======================================================

const deleteRegistration = async (req, res) => {
  try {
    await productRegistrationService.deleteRegistration(
      req.params.registrationId,
      getAuditContext(req)
    );

    return res.status(200).json({
      success: true,
      message: "Registration deleted successfully",
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Delete Product Registration Error:"
    );
  }
};

// ======================================================
// EXPORTS
// ======================================================

module.exports = {
  submitRegistration,
  getRegistrations,
  getRegistrationStats,
  getRegistrationById,
  updateRegistration,
  updateRegistrationStatus,
  deleteRegistration,
};