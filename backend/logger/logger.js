const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, printf, json } = format;

const Logger = () => {
  return createLogger({
    level: "debug",
    // format: winston.format.simple(),
    format: combine(timestamp(), json()),

    defaultMeta: { service: "user-service" },
    transports: [
      //   new transports.Console(),
      new transports.File({
        filename: "./logger/logs.log",
      }),
    ],
  });
};

module.exports = Logger;
