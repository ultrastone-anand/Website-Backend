const router = require("express").Router();

const userController = require("../controller/user.controller");
const authenticate = require("../middlewares/auth.middleware");

// Get all users
router.get("/", userController.getUsers);

// Get all roles
router.get("/roles", userController.getRoles);

// Get single user by ID
router.get("/:userId", userController.getUserById);

// Create a new user
router.post("/", authenticate , userController.createUser);

// Update a user by ID
router.put("/:userId", authenticate , userController.updateUser);

// Partially update a user by ID
router.patch("/:userId", authenticate , userController.updateUser);

// Delete a user by ID
router.delete("/:userId", authenticate , userController.deleteUser);

// Login 
router.post("/login", userController.loginUser);

module.exports = router;