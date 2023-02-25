const mongoose = require("mongoose"); // Import the mongoose library
const tryCatch = require("../utils/tryCatch"); // Import the tryCatch utility function

const connectDB = tryCatch(async () => {
  // Define the connectDB function
  mongoose.connect(process.env.DATABASE_URI); // Attempt to connect to the MongoDB database
});

module.exports = connectDB; // Export the connectDB function for use in other files
