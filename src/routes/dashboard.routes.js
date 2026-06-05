const express = require('express');
const DashboardController = require('../controller/dashboard.controller');
const router = express.Router();

router.get('/admin', DashboardController.adminDashboard);

router.get('/designer', DashboardController.designerDashboard);

router.get('/seo', DashboardController.seoDashboard);

router.get('/blog', DashboardController.blogDashboard);

module.exports = router;