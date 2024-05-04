const express = require("express");
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlwares/auth.middleware");

const router = express.Router();

// Public routes
router.post("/signup", userController.signup);
router.post("/login", userController.login);

// Protected routes
router.use(authMiddleware.protect); // Apply authentication middleware to all routes below
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUser); // Get a specific user by ID
router.patch("/:id", userController.updateUser); // Update a specific user
router.delete("/:id", userController.deleteUser); // Delete a specific user

module.exports = router;
