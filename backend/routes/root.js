const express = require("express"); // Import the 'express' module
const router = express.Router(); // Create a new router instance
const path = require("path"); // Import the 'path' module

/**
 * Handle GET requests for the root URL or the '/index.html' URL
 *
 * @example GET http://localhost:3000/ or GET http://localhost:3000/index.html
 */
router.get("^/$|/index(.html)?", (req, res) => {
  /**
   * Send the 'index.html' file as the response
   *
   * @example res.sendFile('index.html'); //only works with index.js
   */
  res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

// Export the router object for use in other parts of the application
module.exports = router;
