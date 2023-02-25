const { format } = require("date-fns");
const { v4: uuid } = require("uuid");
const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

const LOGS_DIR = path.join(__dirname, "..", "logs");

/**
 * Logs an event to a file with the specified message and log file name.
 * The log item includes the current date and time, a UUID, and the message.
 *
 * @param {string} message - The message to log
 * @param {string} logFileName - The name of the log file to write to
 *
 * @example
 * await logEvents('User logged in', 'auth.log');
 */
const logEvents = async (message, logFileName) => {
  // Get the current date and time in the format 'yyyyMMdd\tHH:mm:ss'
  const dateTime = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;

  // Generate a new UUID
  const uuidValue = uuid();

  // Create the log item with the current date and time, UUID, and message
  const logItem = `${dateTime}\t${uuidValue}\t${message}\n`;

  try {
    // Create the logs directory if it doesn't exist
    if (!fs.existsSync(LOGS_DIR)) {
      await fsPromises.mkdir(LOGS_DIR);
    }

    // Append the log item to the log file
    await fsPromises.appendFile(path.join(LOGS_DIR, logFileName), logItem);

    console.log(`Logged event: ${logItem}`);
  } catch (err) {
    console.error(`Error logging event: ${logItem}\n${err}`);
  }
};

/**
 * Logs HTTP requests to a file named 'reqLog.log' in the logs directory.
 * The log item includes the HTTP method, URL, and origin of the request.
 *
 * @param {object} req - The HTTP request object
 * @param {object} res - The HTTP response object
 * @param {function} next - The next middleware function in the chain
 *
 * @example
 * app.use(logger);
 */
const logger = (req, res, next) => {
  // Log the request method, URL, and origin to the 'reqLog.log' file
  logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, "reqLog.log");

  // Log the request method and path to the console
  console.log(`${req.method} ${req.path}`);

  // Call the next middleware function
  next();
};

module.exports = { logEvents, logger };
