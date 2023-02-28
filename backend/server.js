// Load environment variables from .env file
require("dotenv").config({ path: "./config/.env" });

const express = require("express"); // Import the 'express' module
const app = express(); // Create a new express application
const path = require("path"); // Import the 'path' module
const { logger } = require("./middleware/logger"); // Import custom logger middleware
const errorHandler = require("./middleware/errorHandler"); // Import custom error handler middleware
const cookieParser = require("cookie-parser");
const cors = require("cors"); // Import the 'cors' module
const corsOptions = require("./config/corsOption"); // Import CORS options
const connectDB = require("./config/db"); // Import database connection configuration
const mongoose = require("mongoose"); // Import Mongoose
const { logEvents } = require("./middleware/logger"); // Import logging function
const PORT = process.env.PORT || 4000; // Set the server port to 4000 or the value of the PORT environment variable

connectDB();

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

// Mounting userRoutes to handle API requests related to users
app.use("/api/v1/users", require("./routes/userRoutes"));

// Mounting notesRoutes to handle API requests related to notes
app.use("/api/v1/notes", require("./routes/notesRoutes"));

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
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

mongoose.connection.on("error", (err) => {
  console.log(err);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});
