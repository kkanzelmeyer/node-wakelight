'use strict';

var _wakeLight = require('./wakeLight');

var _wakeLight2 = _interopRequireDefault(_wakeLight);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// const board = new five.Board({
//   io: new chipio()
// });
//
// board.on('ready', function() {
//   // Create an LED on the XIO-P0 pin
//   // var led = new five.Led('XIO-P0');
//
//   // Blink every half second
// });

var wakeLight = new _wakeLight2.default(); // import five from 'johnny-five';
// import chipio from 'chip-io';

wakeLight.run();