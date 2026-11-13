const DashboardService = require("../services/dashboard.service");
class DashboardController {
  static async adminDashboard(req, res) {
    try {
      const data = await DashboardService.getAdminDashboard();

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async designerDashboard(req, res) {
    try {
      const data = await DashboardService.getDesignerDashboard();

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async seoDashboard(req, res) {
    try {
      const data = await DashboardService.getSeoDashboard();

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async blogDashboard(req, res) {
    try {
      const data = await DashboardService.getBlogDashboard();

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = DashboardController;