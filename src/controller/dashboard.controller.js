
const DashboardService = require("../services/dashboard.service");

// ============================================================
// DASHBOARD CONTROLLER
// ============================================================

class DashboardController {

  // ==========================================================
  // ADMIN DASHBOARD
  // ==========================================================

  static async adminDashboard(req, res, next) {
    try {
      const data =
        await DashboardService.getAdminDashboard();

      return res.status(200).json({
        success: true,
        data,
      });

    } catch (error) {
      return next(error);
    }
  }

  // ==========================================================
  // DESIGNER DASHBOARD
  // ==========================================================

  static async designerDashboard(req, res, next) {
    try {
      const data =
        await DashboardService.getDesignerDashboard();

      return res.status(200).json({
        success: true,
        data,
      });

    } catch (error) {
      return next(error);
    }
  }

  // ==========================================================
  // SEO DASHBOARD
  // ==========================================================

  static async seoDashboard(req, res, next) {
    try {
      const data =
        await DashboardService.getSeoDashboard();

      return res.status(200).json({
        success: true,
        data,
      });

    } catch (error) {
      return next(error);
    }
  }

  // ==========================================================
  // BLOG DASHBOARD
  // ==========================================================

  static async blogDashboard(req, res, next) {
    try {
      const data =
        await DashboardService.getBlogDashboard();

      return res.status(200).json({
        success: true,
        data,
      });

    } catch (error) {
      return next(error);
    }
  }
}

// ============================================================
// EXPORTS
// ============================================================

module.exports = DashboardController;
