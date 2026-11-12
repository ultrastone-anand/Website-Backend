
const router = require("express").Router();

const userController = require("../controller/user.controller");

const authenticate = require("../middlewares/auth.middleware");
const requireAdmin = require("../middlewares/admin.middleware");

// ============================================================
// PUBLIC ROUTES
// ============================================================

// Login - No authentication required
router.post(
  "/login",
  userController.loginUser
);

// ============================================================
// AUTHENTICATION
// ============================================================

// All routes below require a valid JWT token
router.use(authenticate);

// ============================================================
// ADMIN AUTHORIZATION
// ============================================================

// All user management routes require Admin permissions
router.use(requireAdmin);

// ============================================================
// GET USERS
// ============================================================

// Get all users
router.get(
  "/",
  userController.getUsers
);

// Get all roles
router.get(
  "/roles",
  userController.getRoles
);

// Get single user by UUID
router.get(
  "/:userId",
  userController.getUserById
);

// ============================================================
// CREATE USER
// ============================================================

router.post(
  "/",
  userController.createUser
);

// ============================================================
// UPDATE USER
// ============================================================

// Full update
router.put(
  "/:userId",
  userController.updateUser
);

// Partial update
router.patch(
  "/:userId",
  userController.updateUser
);

// ============================================================
// DELETE USER
// ============================================================

// Soft delete
router.delete(
  "/:userId",
  userController.deleteUser
);

// ============================================================
// EXPORT
// ============================================================

module.exports = router;
