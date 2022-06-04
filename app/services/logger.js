const { createLogger, format, transports, config } = require("winston");
const { combine, splat, timestamp, printf } = format;

const options = {
  console: {
    level: process.env.LOG_LEVEL || "info",
    handleExceptions: true,
    // json: true,
    colorize: true,
  },
};

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const logger = createLogger({
  format: combine(
    timestamp(),
    myFormat
  ),
  levels: config.npm.levels,
  transports: [new transports.Console(options.console)],
  exitOnError: false,
});

module.exports = logger;
