
const userService = require("../services/user.service");

const getAuditContext = require("../utils/getAuditContext");

// ============================================================
// GET ALL USERS
// ============================================================

const getUsers = async (req, res, next) => {
  try {
    const users = await userService.getUsers();

    if (!users.length) {
      return res.status(404).json({
        success: false,
        message: "No users found",
      });
    }

    return res.status(200).json({
      success: true,
      data: users,
    });

  } catch (error) {
    return next(error);
  }
};

// ============================================================
// GET USER BY ID
// ============================================================

const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await userService.getUserById(
      userId
    );

    return res.status(200).json({
      success: true,
      data: user,
    });

  } catch (error) {
    return next(error);
  }
};

// ============================================================
// CREATE USER
// ============================================================

const createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(
      req.body,
      getAuditContext(req)
    );

    return res.status(201).json({
      success: true,
      data: user,
    });

  } catch (error) {

    if (
      error.code === "P2002" ||
      error.message === "Email already exists"
    ) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    return next(error);
  }
};

// ============================================================
// UPDATE USER
// ============================================================

const updateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await userService.updateUser(
      userId,
      req.body,
      getAuditContext(req)
    );

    return res.status(200).json({
      success: true,
      data: user,
    });

  } catch (error) {

    if (error.message === "User not found") {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (error.code === "P2002") {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    return next(error);
  }
};

// ============================================================
// DELETE USER
// ============================================================

const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    await userService.deleteUser(
      userId,
      getAuditContext(req)
    );

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });

  } catch (error) {

    if (error.message === "User not found") {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return next(error);
  }
};

// ============================================================
// LOGIN
// ============================================================

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await userService.loginUser(
      email,
      password
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      ...result,
    });

  } catch (error) {

    switch (error.message) {

      case "User account not found. Please contact Administrator.":
        return res.status(404).json({
          success: false,
          message:
            "User account not found. Please contact Administrator.",
        });

      case "Incorrect password.":
        return res.status(401).json({
          success: false,
          message: "Incorrect password.",
        });

      case "Your account has been disabled. Please contact Administrator.":
        return res.status(403).json({
          success: false,
          message:
            "Your account has been disabled. Please contact Administrator.",
        });

      default:
        return next(error);
    }
  }
};

// ============================================================
// GET ALL ROLES
// ============================================================

const getRoles = async (req, res, next) => {
  try {
    const roles = await userService.getroles();

    return res.status(200).json({
      success: true,
      data: roles,
    });

  } catch (error) {
    return next(error);
  }
};

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  getRoles,
};
