const prisma = require(
  "../config/prisma"
);

// ================== CREATE REMARK ==================

const createRemark = async (
  productId,
  userId,
  data
) => {

  return await prisma.product_remarks.create({

    data: {

      product_id: BigInt(productId),

      user_id: userId,

      remark: data.remark

    },

    include: {

      users: {

        select: {

          id: true,

          first_name: true,

          last_name: true

        }

      }

    }

  });

};

// ================== GET PRODUCT REMARKS ==================

const getProductRemarks = async (
  productId
) => {

  return await prisma.product_remarks.findMany({

    where: {

      product_id: BigInt(productId)

    },

    include: {

      users: {

        select: {

          id: true,

          first_name: true,

          last_name: true

        }

      }

    },

    orderBy: {

      created_at: "desc"

    }

  });

};

// ================== UPDATE REMARK ==================

const updateRemark = async (
  remarkId,
  userId,
  data
) => {

  const remark =
    await prisma.product_remarks.findUnique({

      where: {

        id: BigInt(remarkId)

      }

    });

  if (!remark) {

    throw new Error(
      "Remark not found"
    );

  }

  if (remark.user_id !== userId) {

    throw new Error(
      "You are not authorized to update this remark"
    );

  }

  return await prisma.product_remarks.update({

    where: {

      id: BigInt(remarkId)

    },

    data: {

      remark: data.remark,

      is_edited: true,

      updated_at: new Date()

    },

    include: {

      users: {

        select: {

          id: true,

          first_name: true,

          last_name: true

        }

      }

    }

  });

};

// ================== DELETE REMARK ==================

const deleteRemark = async (
  remarkId,
  userId
) => {

  const remark =
    await prisma.product_remarks.findUnique({

      where: {

        id: BigInt(remarkId)

      }

    });

  if (!remark) {

    throw new Error(
      "Remark not found"
    );

  }

  if (remark.user_id !== userId) {

    throw new Error(
      "You are not authorized to delete this remark"
    );

  }

  return await prisma.product_remarks.delete({

    where: {

      id: BigInt(remarkId)

    }

  });

};

module.exports = {
  createRemark,
  getProductRemarks,
  updateRemark,
  deleteRemark
};