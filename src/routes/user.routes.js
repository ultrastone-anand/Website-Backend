const router = require("express").Router();

const userController = require("../controller/user.controller");

// Get all users
router.get("/", userController.getUsers);

// Get single user by ID
router.get("/:userId", userController.getUserById);

// Create a new user
router.post("/", userController.createUser);

// Update a user by ID
router.put("/:userId", userController.updateUser);

// Partially update a user by ID
router.patch("/:userId", userController.updateUser);

// Delete a user by ID
router.delete("/:userId", userController.deleteUser);

router.post("/login", userController.loginUser);

module.exports = router;