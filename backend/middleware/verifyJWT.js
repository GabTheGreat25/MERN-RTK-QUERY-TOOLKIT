const jwt = require("jsonwebtoken");

// Define the middleware function to verify the JWT
const verifyJWT = (req, res, next) => {
  // Get the authorization header from the request
  const authHeader = req.headers.authorization || req.headers.Authorization;

  // Check if the authorization header exists and starts with "Bearer "
  if (!authHeader?.startsWith("Bearer ")) {
    // If not, return a 401 Unauthorized response
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Extract the token from the authorization header
  const token = authHeader.split(" ")[1];

  // Verify the token using the ACCESS_TOKEN_SECRET and handle any errors
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    // If there is an error, return a 403 Forbidden response
    if (err) return res.status(403).json({ message: "Forbidden" });

    // If the token is valid, attach the user information to the request object
    req.user = decoded.UserInfo.username;
    req.roles = decoded.UserInfo.roles;

    // Call the next middleware in the stack
    next();
  });
};

// Export the middleware function for use in other files
module.exports = verifyJWT;
