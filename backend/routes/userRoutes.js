const express = require("express"); // Import the 'express' module
const router = express.Router(); // Create a new router instance
const usersController = require("../controllers/userController");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT); // Use the `verifyJWT` middleware to check for authorization

router
  .route("/")
  .get(usersController.getAllUsers) // If authorized, retrieve all users
  .post(usersController.createNewUser) // If authorized, create a new user
  .patch(usersController.updateUser) // If authorized, update a user
  .delete(usersController.deleteUser); // If authorized, delete a user

// router
//   .route("/:id")
//   .patch(usersController.updateUser)
//   .delete(usersController.deleteUser);

module.exports = router;
