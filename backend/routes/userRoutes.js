const express = require("express"); // Import the 'express' module
const router = express.Router(); // Create a new router instance
const usersController = require("../controllers/userController");

router
  .route("/")
  .get(usersController.getAllUsers)
  .post(usersController.createNewUser)
  .patch(usersController.updateUser)
  .delete(usersController.deleteUser);

// router
//   .route("/:id")
//   .patch(usersController.updateUser)
//   .delete(usersController.deleteUser);

module.exports = router;
