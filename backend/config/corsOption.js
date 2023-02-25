const allowedOrigins = require("./allowedOrigin");

/**
 * Define CORS options to allow requests from specific origins, enable cookies and set a success status code.
 *
 * @example
 * const allowedOrigins = require("./allowedOrigin");
 *
 * const corsOptions = {
 *   origin: (origin, callback) => {
 *     if (allowedOrigins.indexOf(origin) !== -1 || origin) {
 *       callback(null, true);
 *     } else {
 *       callback(new Error("Not allowed by CORS"));
 *     }
 *   },
 *   credentials: true,
 *   optionsSuccessStatus: 200,
 * };
 *
 * module.exports = corsOptions;
 */

// Import the 'allowedOrigin' module that contains an array of allowed origins

// Define an object that contains options for CORS (Cross-Origin Resource Sharing) configuration
const corsOptions = {
  // Define a function that determines whether a request origin is allowed or not
  origin: (origin, callback) => {
    // If the request origin is included in the allowed origins array or if there is no origin (i.e., the request is not cross-origin), allow the request
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      // If the request origin is not allowed, return an error
      callback(new Error("Not allowed by CORS"));
    }
  },
  // Enable cookies in CORS requests
  credentials: true,
  // Set the HTTP response status code to 200 for successful preflight requests
  optionsSuccessStatus: 200,
};

// Export the CORS options object for use in other parts of the application
module.exports = corsOptions;
