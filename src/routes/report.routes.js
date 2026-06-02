const express = require("express");

const router = express.Router();

const reportController = require("../controller/report.controller");

// Product Audit Report
router.get("/product-audit/:slug", reportController.getProductAuditReport);  // Missing Report

router.get("/products/:slug", reportController.getCategoryProductReport);  // Product Report

router.get("/category-products/:slug",reportController.getCategoryProductsReport,); // All Product Overview

module.exports = router;
