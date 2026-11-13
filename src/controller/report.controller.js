
const reportService = require("../services/report.service");

// ============================================================
// PRODUCT AUDIT REPORT
// ============================================================

const getProductAuditReport = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const report =
      await reportService.getProductAuditReport(slug);

    return res.status(200).json({
      success: true,
      data: report,
    });

  } catch (error) {
    return next(error);
  }
};

// ============================================================
// CATEGORY PRODUCT REPORT
// ============================================================

const getCategoryProductReport = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const report =
      await reportService.getCategoryProductReport(slug);

    return res.status(200).json({
      success: true,
      data: report,
    });

  } catch (error) {
    return next(error);
  }
};

// ============================================================
// CATEGORY PRODUCTS REPORT
// ============================================================

const getCategoryProductsReport = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const report =
      await reportService.getCategoryProductsReport(slug);

    return res.status(200).json({
      success: true,
      ...report,
    });

  } catch (error) {
    return next(error);
  }
};

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  getProductAuditReport,
  getCategoryProductReport,
  getCategoryProductsReport,
};
