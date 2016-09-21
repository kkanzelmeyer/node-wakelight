'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _firebase = require('firebase');

var _firebase2 = _interopRequireDefault(_firebase);

var _config = require('./config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WakeLight = function () {
  function WakeLight() {
    var _this = this;

    _classCallCheck(this, WakeLight);

    _config.logger.debug('constructor');
    var config = {
      apiKey: "AIzaSyAZpOcP8VH2aanLo6lwDrVS04wS4fb5TFU",
      authDomain: "wake-light.firebaseapp.com",
      databaseURL: "https://wake-light.firebaseio.com",
      storageBucket: "wake-light.appspot.com",
      messagingSenderId: "748386075172"
    };
    _firebase2.default.initializeApp(config);
    this.database = _firebase2.default.database();
    var lillianRef = this.database.ref('/lillian');

    lillianRef.on('value', function (lillian) {
      _config.logger.debug('Alarm values updated!');
      _this.updateAlarms(lillian.alarms);
    });

    this.lillianRef = lillianRef;
  }

  _createClass(WakeLight, [{
    key: 'addLED',
    value: function addLED(led) {
      _config.logger.debug('adding led');
      this.led = led;
    }
  }, {
    key: 'updateAlarms',
    value: function updateAlarms(alarms) {
      _config.logger.debug('updating alarms');
      _config.logger.debug(alarms);
      this.alarms = alarms;
    }
  }, {
    key: 'setAlarms',
    value: function setAlarms(alarms) {
      _config.logger.debug('setting alarms');
      _config.logger.debug(alarms);
      var morning = alarms.morning;
      var afternoon = alarms.afternoon;

      var lillianAlarmsRef = this.lillianRef.child('alarms');
      lillianAlarmsRef.set({
        morning: morning,
        afternoon: afternoon
      });
    }
  }, {
    key: 'run',
    value: function run() {
      var _this2 = this;

      _config.logger.debug('running wake light');
      var _alarms = this.alarms;
      var morning = _alarms.morning;
      var afternon = _alarms.afternon;

      if (!this.alarms) {
        throw Error('alarms not set');
      }
      this.timer = setInterval(function () {
        var hour = Date.now().getHours();
        var minute = Date.now().getMinutes();
        // check if alarm should be activated
        if (hour === alarm.time) {
          if (minute <= alarm.duration) {
            _this2.alarmActive = true;
            _config.logger.debug('Alarm Active - time: ' + hour + ':' + minute);
          } else {
            _this2.alarmActive = false;
          }
        }
        _this2.alarmActive = false;
      }, 60000);
    }
  }, {
    key: 'stop',
    value: function stop() {
      clearTimeout(this.timer);
    }
  }]);

  return WakeLight;
}();

exports.default = WakeLight;