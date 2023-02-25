/**
 * A utility function for wrapping controllers in a try-catch block
 *
 * @param {Function} controller - The function to be executed inside the try-catch block
 *
 * @returns {Function} A new function that wraps the provided controller in a try-catch block
 *
 * @example
 *
 * exports.loginUser = tryCatch(async (req, res, next) => {
 *    Controller logic here
 * }
 *
 */
// Exporting a Higher Order Function (HOF) that takes in a "controller" function as an argument
module.exports = (controller) => {
  // Return an anonymous async function that takes in the request, response, and "next" arguments
  return async (req, res, next) => {
    // Wrap the execution of the "controller" function inside a try-catch block
    try {
      // Execute the "controller" function and pass along the request, response, and "next" arguments
      await controller(req, res, next);
    } catch (err) {
      // If an error occurs, pass it to the "next" middleware for error handling
      next(err);
    }
  };
};
