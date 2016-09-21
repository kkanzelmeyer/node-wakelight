'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logger = undefined;

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

var _process = require('process');

var _process2 = _interopRequireDefault(_process);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _process$env$NODE_ENV = _process2.default.env.NODE_ENV;
var NODE_ENV = _process$env$NODE_ENV === undefined ? 'production' : _process$env$NODE_ENV;

/**
 *  LOGGING UTILITY
 */

var consoleTransport = new _winston2.default.transports.Console();

var fileTransport = new _winston2.default.transports.File({
  filename: 'wakelight.log',
  prettyprint: true
});
var level = void 0;
var transports = void 0;
switch (NODE_ENV) {
  case 'development':
    transports = [consoleTransport];
    level = 'debug';
    break;
  default:
    transports = [fileTransport];
    level = 'warn';
}

var logger = exports.logger = new _winston2.default.Logger({
  level: level,
  transports: transports
});