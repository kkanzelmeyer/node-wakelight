import winston from 'winston';
import process from 'process';

const {
  NODE_ENV = 'production',
} = process.env;

/**
 *  LOGGING UTILITY
 */
const consoleTransport = new (winston.transports.Console)({
  prettyPrint: true,
});

const fileTransport = new (winston.transports.File)({
  filename: 'wakelight.log',
  prettyPrint: true,
});
let level;
let transports;
switch (NODE_ENV) {
  case 'development':
    transports = [consoleTransport];
    level = 'debug';
    break;
  default:
    transports = [fileTransport];
    level = 'warn';
}

export const logger = new (winston.Logger)({ // eslint-disable-line
  level,
  transports,
});
