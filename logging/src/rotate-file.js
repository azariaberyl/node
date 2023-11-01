import winston from 'winston';
import { DailyRotateFile } from 'winston/lib/winston/transports';

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({}),
    new DailyRotateFile({
      filename: 'app-%DATE%.log',
      zippedArchive: true,
      maxSize: '1m',
      maxFiles: '14d',
    }),
  ],
});
