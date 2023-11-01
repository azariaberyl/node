import winston from 'winston';

const logger = new winston.createLogger({
  // Level is determined what level can be outputed
  // level: "warn",
  level: 'info',

  // Format
  // format: winston.format.json(),
  // format: winston.format.simple(),
  // format: winston.format.logstash(),
  // Create custom format
  // format: winston.format.printf((info) => {
  //   return `${new Date()}: ${info.level.toLocaleUpperCase()}\t: ${info.message}`
  // }),
  // Combine format, combine multiple formats
  format: winston.format.combine(winston.format.timestamp(), winston.format.ms(), winston.format.json()),

  // Handle exceptions, send error to transport instead of crash
  // .error() cancels the exepctions' log, make sure you don't have .error() in your app
  // handleExceptions: true,

  // Transport is mandatory, it's where the log output is, ie: console, file
  transports: [
    new winston.transports.Console({}),

    new winston.transports.File({
      filename: 'aplication.log',
    }),

    new winston.transports.File({
      level: 'warn',
      handleExceptions: true,
      filename: 'error.log',
    }),

    new winston.transports.File({
      level: 'error',
      handleExceptions: true,
      handleRejections: true,
      filename: 'execptions.log',
    }),
  ],
});

logger.log({
  level: 'info',
  message: 'Hello logging',
});

// logger.error('Hello error');
logger.warn('Hello warn');
logger.info('Hello Info');
logger.http('Hello http');
logger.verbose('Hello verbose');
// Error test
// hello();
// Rejection test
async function rejectPromise() {
  return Promise.reject('Ups');
}
rejectPromise();
