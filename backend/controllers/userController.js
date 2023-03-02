const User = require("../models/User");
const Note = require("../models/Note");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

/**
 * @desc    Get all users
 * @route   GET /users
 * @access  Private
 */
const getAllUsers = asyncHandler(async (req, res) => {
  // Retrieve all users from the database
  const users = await User.find()
    // Select all fields except the password field
    .select("-password")
    // Apply the lean() method to improve query performance by returning plain JS objects instead of Mongoose documents
    .lean()
    // Apply the exec() method to execute the query and get a Promise that resolves with the query result
    .exec();

  // Check if any users were found
  if (!users?.length) {
    // If no users were found, return an error response
    res.status(400).json({
      message: "No users found",
    });
  } else {
    // If users were found, return the users as a JSON response
    res.json(users);
  }
});

/**
 * @desc    Create new user
 * @route   POST /users
 * @access  Private
 */
const createNewUser = asyncHandler(async (req, res) => {
  const { username, password, roles } = req.body;

  // Confirm that all required fields are present in the request body
  if (!username || !password || !Array.isArray(roles) || !roles.length)
    return res.status(400).json({
      message: "Please provide username, password and roles",
    });

  // Check if a user with the same username already exists
  const duplicate = await User.findOne({ username }).lean().exec();

  if (duplicate)
    return res.status(409).json({
      message: "User already exists",
    });

  // Hash the password using bcrypt and a salt number from the environment variables
  const hashedPwd = await bcrypt.hash(
    password,
    Number(process.env.SALT_NUMBER)
  );

  // Create an object with the username, hashed password, and roles
  const userObject = { username, password: hashedPwd, roles };

  // Create and store the new user in the database
  const user = await User.create(userObject);

  if (user) {
    // Respond with a success message if the user was created successfully
    res.status(201).json({
      message: `New user ${username} created`,
    });
  } else {
    // Respond with an error message if there was a problem creating the user
    res.status(400).json({
      message: "Invalid user data received",
    });
  }
});

/**
 * @desc    Update a user
 * @route   PATCH /users/:id
 * @access  Private
 */
const updateUser = asyncHandler(async (req, res) => {
  const { id, username, roles, active, password } = req.body;

  // Check if all required fields are provided
  if (
    !id ||
    !username ||
    !Array.isArray(roles) ||
    !roles.length ||
    typeof active !== "boolean"
  ) {
    return res.status(400).json({
      message: "Please provide id, username, roles and active",
    });
  }

  // Find the user to update
  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  // Check if there's a duplicate username
  const duplicate = await User.findOne({ username }).lean().exec();

  // Allow updating the original user with the same username
  if (duplicate && duplicate._id.toString() !== id) {
    return res.status(409).json({
      message: "Duplicate username",
    });
  }

  // Update the user object
  user.username = username;
  user.roles = roles;
  user.active = active;

  if (password) {
    // Hash the new password
    user.password = await bcrypt.hash(
      password,
      Number(process.env.SALT_NUMBER)
    );
  }

  // Save the updated user to the database
  const updatedUser = await user.save();

  res.json({
    message: `${updatedUser.username} updated`,
  });
});

/**
 * @desc    Delete a user
 * @route   Delete /users/:id
 * @access  Private
 */
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;

  // Check that an ID was provided
  if (!id) {
    return res.status(400).json({
      message: "User ID is required",
    });
  }

  // Check if user has any notes and prevent deletion if so
  const note = await Note.findOne({ user: id }).lean().exec();
  if (note) {
    return res.status(400).json({
      message: "User has notes, cannot delete",
    });
  }

  // Find the user to be deleted
  const user = await User.findById(id).exec();
  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  // Delete the user and send a success message
  const result = await user.deleteOne();
  res.json({
    message: `Username ${result.username} with ID ${result._id} deleted`,
  });
});

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
};
