const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

// @desc Login
// @route POST /auth
// @access Public
const login = asyncHandler(async (req, res) => {
  // Extract the `username` and `password` fields from the request body.
  const { username, password } = req.body;

  // Check if either `username` or `password` is missing. If either is missing, return a `400` status code with an error message indicating that both fields are required.
  if (!username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Search the database for a user with the specified `username`.
  const foundUser = await User.findOne({ username }).exec();

  // Check if the user was found in the database and if the user is active. If either of these conditions is not met, return a `401` status code with an error message indicating that the request is unauthorized.
  if (!foundUser || !foundUser.active) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Use the `bcrypt` library to compare the input password with the hashed password stored in the database. If the passwords do not match, return a `401` status code with an error message indicating that the request is unauthorized.
  const match = await bcrypt.compare(password, foundUser.password);
  if (!match) return res.status(401).json({ message: "Unauthorized" });

  // Generate a JSON Web Token (JWT) using the `jsonwebtoken` library. The token contains the user's `username` and `roles`, which can be used for authorization later on. The token expires in 15 minutes.
  const accessToken = jwt.sign(
    {
      UserInfo: {
        username: foundUser.username,
        roles: foundUser.roles,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  // Generate another JWT, which will be used to refresh the access token once it expires. This token contains only the `username` field and expires in 7 days.
  const refreshToken = jwt.sign(
    { username: foundUser.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  // Create a secure cookie that contains the refresh token. The cookie is set to be accessible only by the server, over HTTPS, and with a `sameSite` attribute of `None`. The cookie expires after 7 days, which matches the expiry time of the refresh token.
  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  // Return the access token as a JSON object to the client. The client can then use this token to access protected resources on the server.
  res.json({ accessToken });
});

// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired
const refresh = (req, res) => {
  // Get cookies from the request
  const cookies = req.cookies;

  // Check if a JWT cookie exists
  if (!cookies?.jwt) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Get the refresh token from the JWT cookie
  const refreshToken = cookies.jwt;

  // Verify the refresh token and generate a new access token
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    asyncHandler(async (err, decoded) => {
      // If there is an error with the refresh token, return a 403 Forbidden error
      if (err) {
        return res.status(403).json({ message: "Forbidden" });
      }

      // Find the user associated with the refresh token
      const foundUser = await User.findOne({
        username: decoded.username,
      }).exec();

      // If no user is found, return a 401 Unauthorized error
      if (!foundUser) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Generate a new access token
      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: foundUser.username,
            roles: foundUser.roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );

      // Send the new access token as a response
      res.json({ accessToken });
    })
  );
};

// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists
const logout = (req, res) => {
  // Get the cookies from the request
  const cookies = req.cookie;

  // If no JWT cookie is found, send a "No Content" response
  if (!cookies?.jwt) return res.sendStatus(204); //No content

  // Clear the JWT cookie by setting it to empty with an expiry in the past
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });

  // Send a response indicating that the cookie has been cleared
  res.json({ message: "Cookie cleared" });
};

module.exports = {
  login,
  refresh,
  logout,
};
