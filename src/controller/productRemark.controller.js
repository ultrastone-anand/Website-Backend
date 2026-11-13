
const productRemarkService = require(
  "../services/productRemark.service"
);

const { serialize } = require(
  "../utils/serialize"
);

// ============================================================
// CREATE REMARK
// ============================================================

const createRemark = async (req, res, next) => {
  try {
    const remark =
      await productRemarkService.createRemark(
        req.params.productId,
        req.user.id,
        req.body
      );

    return res.status(201).json({
      success: true,
      message: "Remark added successfully",
      data: serialize(remark),
    });

  } catch (error) {
    return next(error);
  }
};

// ============================================================
// GET PRODUCT REMARKS
// ============================================================

const getProductRemarks = async (req, res, next) => {
  try {
    const remarks =
      await productRemarkService.getProductRemarks(
        req.params.productId
      );

    return res.status(200).json({
      success: true,
      data: serialize(remarks),
    });

  } catch (error) {
    return next(error);
  }
};

// ============================================================
// UPDATE REMARK
// ============================================================

const updateRemark = async (req, res, next) => {
  try {
    const remark =
      await productRemarkService.updateRemark(
        req.params.remarkId,
        req.user.id,
        req.body
      );

    return res.status(200).json({
      success: true,
      message: "Remark updated successfully",
      data: serialize(remark),
    });

  } catch (error) {
    return next(error);
  }
};

// ============================================================
// DELETE REMARK
// ============================================================

const deleteRemark = async (req, res, next) => {
  try {
    await productRemarkService.deleteRemark(
      req.params.remarkId,
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: "Remark deleted successfully",
    });

  } catch (error) {
    return next(error);
  }
};

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  createRemark,
  getProductRemarks,
  updateRemark,
  deleteRemark,
};
