/**
 * Module dependencies.
 */
const express = require("express"); // Import the 'express' module
const app = express(); // Create a new express application
const path = require("path"); // Import the 'path' module
const { logger } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("./config/corsOption");
const PORT = process.env.PORT || 3500; // Set the server port to 3500 or the value of the PORT environment variable
// Set up middleware
app.use(logger);
app.use(cors(corsOptions));

// Parse JSON bodies
app.use(express.json());
app.use(cookieParser());
// Serve static files from the 'public' directory
app.use("/", express.static(path.join(__dirname, "public")));

// Handle GET requests to the root URL with the 'root' router
app.use("/", require("./routes/root"));

// Handle all other requests with a 404 response
app.all("*", (req, res) => {
  res.status(404); // Set the HTTP status code to 404

  // If the request accepts HTML, send the 404.html file as the response
  if (req.accepts("html")) {
    /**
     * Send the '404.html' file as the response
     *
     * @example
     * res.sendFile(path.join(__dirname, "views", "404.html"));
     */
    res.sendFile(path.join(__dirname, "views", "404.html"));
  }
  // If the request accepts JSON, send a JSON response with a 'message' property
  else if (req.accepts("json")) {
    /**
     * Send a JSON response with a 'message' property
     *
     * @example
     * res.json({ message: '404 Not Found' });
     */
    res.json({
      message: "404 Not Found",
    });
  }
  // If the request does not accept HTML or JSON, send a plain text response
  else {
    /**
     * Send a plain text response
     *
     * @example
     * res.type('txt').send('404 Not Found');
     */
    res.type("txt").send("404 Not Found");
  }
});

// Use error handler middleware
app.use(errorHandler);

// Start the server and listen on the specified port
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
