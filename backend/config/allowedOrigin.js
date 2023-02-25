const allowedOrigins = ["http://localhost:3000"]; // define an array of allowed origins

module.exports = allowedOrigins; // export the array of allowed origins

/**
 * @example
 * Import the allowed origins array in your middleware code
 * const allowedOrigins = require("./config/corsOption");
 *
 * Set the CORS options to only allow requests from the allowed origins
 * const corsOptions = {
 *   origin: (origin, callback) => {
 *     if (allowedOrigins.includes(origin) || !origin) {
 *       callback(null, true);
 *     } else {
 *       callback(new Error("Not allowed by CORS"));
 *     }
 *   },
 * };
 *
 * Use the CORS middleware with the configured options
 * app.use(cors(corsOptions));
 */
