// Import the logEvents function from the logger module
const { logEvents } = require("./logger");

/**
 * The errorHandler function handles errors that occur during request processing.
 * It logs the error message, status, method, URL, and origin, and returns a JSON
 * response with the error message.
 *
 * @param {Error} err - The error that occurred
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 */
const errorHandler = (err, req, res, next) => {
  // Log the error message, status, method, URL, and origin
  logEvents(
    `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
    "error.Log"
  );

  // Log the error stack trace to the console
  console.log(err.stack);

  // Set the response status code to the status code of the response, or 500 if no status code is set
  const status = res.statusCode ? res.statusCode : 500;
  res.status(status);

  // Send a JSON response with the error message
  res.json({ message: err.message });
};

// Export the errorHandler middleware function
module.exports = errorHandler;
