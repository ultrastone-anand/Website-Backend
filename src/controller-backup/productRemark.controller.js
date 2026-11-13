const productRemarkService = require(
  "../services/productRemark.service"
);

const { serialize } = require(
  "../utils/serialize"
);

// ================== CREATE REMARK ==================

const createRemark = async (
  req,
  res
) => {

  try {

    const remark =
      await productRemarkService.createRemark(

        req.params.productId,

        req.user.id,

        req.body

      );

    res.status(201).json({

      success: true,

      message:
        "Remark added successfully",

      data: serialize(remark)

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};

// ================== GET PRODUCT REMARKS ==================

const getProductRemarks = async (
  req,
  res
) => {

  try {

    const remarks =
      await productRemarkService.getProductRemarks(

        req.params.productId

      );

    res.status(200).json({

      success: true,

      data: serialize(remarks)

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};

// ================== UPDATE REMARK ==================

const updateRemark = async (
  req,
  res
) => {

  try {

    const remark =
      await productRemarkService.updateRemark(

        req.params.remarkId,

        req.user.id,

        req.body

      );

    res.status(200).json({

      success: true,

      message:
        "Remark updated successfully",

      data: serialize(remark)

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};

// ================== DELETE REMARK ==================

const deleteRemark = async (
  req,
  res
) => {

  try {

    await productRemarkService.deleteRemark(

      req.params.remarkId,

      req.user.id

    );

    res.status(200).json({

      success: true,

      message:
        "Remark deleted successfully"

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};

module.exports = {
  createRemark,
  getProductRemarks,
  updateRemark,
  deleteRemark
};