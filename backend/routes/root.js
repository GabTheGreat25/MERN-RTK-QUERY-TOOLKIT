const express = require("express"); // Import the 'express' module
const router = express.Router(); // Create a new router instance
const path = require("path"); // Import the 'path' module

/**
 * Handle GET requests for the root URL or the '/index.html' URL
 *
 *
 * "^/$|/index(.html)?" is a regular expression used to match multiple patterns for the URL.
 * It matches URLs that start with a forward slash (/) followed by either an end-of-line character
 * ($) or the literal string /index followed by an optional .html extension.
 * More specifically, the regular expression ^/$ matches URLs that consist only of a single forward slash
 * (i.e. the root URL). The | character is used to indicate an alternative pattern,
 * so the expression ^/$|/index(.html)? matches either the root URL or URLs that start with /index
 * and may or may not end with .html.
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
