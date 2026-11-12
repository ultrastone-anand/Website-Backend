
const prisma = require("../config/prisma");

const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const user = await prisma.users.findUnique({
      where: {
        id: Number(req.user.id),
      },
      select: {
        id: true,
        is_active: true,
        deleted_at: true,
        roles: {
          select: {
            name: true,
          },
        },
      },
    });

    if (
      !user ||
      !user.is_active ||
      user.deleted_at !== null
    ) {
      return res.status(401).json({
        success: false,
        message: "Account is inactive or unavailable",
      });
    }

    if (
      String(user.roles?.name || "")
        .trim()
        .toLowerCase() !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Administrator access required",
      });
    }

    return next();
  } catch (error) {
    console.error("Admin authorization error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = requireAdmin;
