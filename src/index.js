// import five from 'johnny-five';
// import chipio from 'chip-io';
import WakeLight from './wakeLight';

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

const wakeLight = new WakeLight(); // eslint-disable-line
// wakeLight.run();
