// Import the required modules
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const loginLimiter = require("../middleware/loginLimiter");

// Define the routes for the auth endpoints
router.route("/").post(loginLimiter, authController.login);
router.route("/refresh").get(authController.refresh);
router.route("/logout").post(authController.logout);

// Export the router
module.exports = router;
