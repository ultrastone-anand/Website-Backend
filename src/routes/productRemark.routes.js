const express = require("express");
const router = express.Router();

const productRemarkController = require("../controller/productRemark.controller");
const authenticate = require("../middlewares/auth.middleware");

// Get all remarks for a product
router.get(
  "/:productId/remarks",
  authenticate,
  productRemarkController.getProductRemarks
);

// Add a new remark
router.post(
  "/:productId/remarks",
  authenticate,
  productRemarkController.createRemark
);

// Update a remark
router.put(
  "/remarks/:remarkId",
  authenticate,
  productRemarkController.updateRemark
);

// Delete a remark
router.delete(
  "/remarks/:remarkId",
  authenticate,
  productRemarkController.deleteRemark
);

module.exports = router;