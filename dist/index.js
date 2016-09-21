'use strict';

var _firebase = require('firebase');

var _firebase2 = _interopRequireDefault(_firebase);

var _config = require('./config');

var _keys = require('./keys');

var keys = _interopRequireWildcard(_keys);

var _wakeLight = require('./wakeLight');

var _wakeLight2 = _interopRequireDefault(_wakeLight);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

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
//
_config.logger.debug('initializing firebase app');
// import five from 'johnny-five';
// import chipio from 'chip-io';

_firebase2.default.initializeApp(keys.config);

var alarmsRef = _firebase2.default.database().ref('/alarms');

// add auth
_firebase2.default.auth().signInWithEmailAndPassword(keys.email, keys.password).then(function (user) {
  _config.logger.debug(user.email + ' signed in');
  // init wakelight
  var lillianWakeLight = new _wakeLight2.default();
  // add value listener
  alarmsRef.on('value', function (data) {
    _config.logger.debug('ref updated!');
    lillianWakeLight.updateAlarms(data.val().lillian);
  });
}).catch(function (error) {
  _config.logger.error(error.code, error.message);
});