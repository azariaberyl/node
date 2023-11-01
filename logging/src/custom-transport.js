import winston from 'winston';
import TransportStream from 'winston-transport';

// You need to extend TransportStream from 'winston-transport'
class MyTransport extends TransportStream {
  constructor(option) {
    super(option);
  }

  // This is your logger, what you want to do
  log(info, next) {
    console.log(`${new Date()}: ${info.level} ${info.message} -> From MyTransport`);
    console.log(info);
    next();
  }
}

const logger = new winston.createLogger({
  level: 'info',
  transports: [
    new MyTransport({
      level: 'warn',
    }),
    new winston.transports.Console(),
  ],
});

logger.info('Halo dek');
logger.warn('Halo dek');
