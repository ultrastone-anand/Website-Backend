const reportService = require("../services/report.service");

// ================== PRODUCT AUDIT REPORT ==================

const getProductAuditReport = async (req, res) => {
  try {
    const { slug } = req.params;

    const report = await reportService.getProductAuditReport(slug);

    res.status(200).json({
      success: true,

      data: report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

const getCategoryProductReport = async (req, res) => {
  try {
    const { slug } = req.params;

    const report = await reportService.getCategoryProductReport(slug);

    res.status(200).json({
      success: true,

      data: report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

const getCategoryProductsReport = async (
  req,
  res
) => {

  try {

    const { slug } =
      req.params;

    const report =
      await reportService.getCategoryProductsReport(
        slug
      );

    return res.status(200).json({

      success: true,

      ...report

    });

  } catch (error) {

    return res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

};


module.exports = {
  getProductAuditReport,

  getCategoryProductReport,

  getCategoryProductsReport
};
