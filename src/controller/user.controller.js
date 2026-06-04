const userService = require("../services/user.service");

// ================== GET ALL USERS ==================

const getUsers = async (
  req,
  res
) => {

  try {

    const users =
      await userService.getUsers();

    if (!users.length) {

      return res.status(404).json({
        success: false,
        message: "No users found"
      });

    }

    res.status(200).json({
      success: true,
      data: users
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

// ================== GET USER BY ID ==================

const getUserById = async (
  req,
  res
) => {

  try {

    const { userId } =
      req.params;

    const user =
      await userService.getUserById(
        userId
      );

    res.status(200).json({
      success: true,
      data: user
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

// ================== CREATE USER ==================

const createUser = async (
  req,
  res
) => {

  try {

    const user =
      await userService.createUser(
        req.body
      );

    res.status(201).json({
      success: true,
      data: user
    });

  } catch (error) {

    if (
      error.code === "P2002"
    ) {

      return res.status(400).json({
        success: false,
        message: "Email already exists"
      });

    }

    if (
      error.message ===
      "Email already exists"
    ) {

      return res.status(400).json({
        success: false,
        message: error.message
      });

    }

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

// ================== UPDATE USER ==================

const updateUser = async (
  req,
  res
) => {

  try {

    const { userId } =
      req.params;

    const user =
      await userService.updateUser(

        userId,

        req.body

      );

    res.status(200).json({
      success: true,
      data: user
    });

  } catch (error) {

    if (
      error.message ===
      "User not found"
    ) {

      return res.status(404).json({
        success: false,
        message: error.message
      });

    }

    if (
      error.code === "P2002"
    ) {

      return res.status(400).json({
        success: false,
        message: "Email already exists"
      });

    }

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

// ================== DELETE USER ==================

const deleteUser = async (
  req,
  res
) => {

  try {

    const { userId } =
      req.params;

    await userService.deleteUser(
      userId
    );

    res.status(200).json({
      success: true,
      message:
        "User deleted successfully"
    });

  } catch (error) {

    if (
      error.message ===
      "User not found"
    ) {

      return res.status(404).json({
        success: false,
        message: error.message
      });

    }

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

// ================== LOGIN ==================

const loginUser = async (
  req,
  res
) => {

  try {

    const {
      email,
      password
    } = req.body;

    const result =
      await userService.loginUser(
        email,
        password
      );

    return res.status(200).json({

      success: true,

      message:
        "Login successful",

      ...result

    });

  } catch (error) {

    let statusCode = 500;

    switch (error.message) {

      case "User account not found. Please contact Administrator.":
        statusCode = 404;
        break;

      case "Incorrect password.":
        statusCode = 401;
        break;

      case "Your account has been disabled. Please contact Administrator.":
        statusCode = 403;
        break;

      default:
        statusCode = 500;

    }

    return res.status(statusCode).json({

      success: false,

      message:
        error.message

    });

  }

};

// ================== GETALL ROLES ==================

const getRoles = async (
  req,
  res
) => {

  try {

    const roles =
      await userService.getroles();

    res.status(200).json({
      success: true,
      data: roles
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

module.exports = {

  getUsers,

  getUserById,

  createUser,

  updateUser,

  deleteUser,

  loginUser,

  getRoles

};