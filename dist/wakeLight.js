'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _config = require('./config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WakeLight = function () {
  function WakeLight() {
    _classCallCheck(this, WakeLight);

    _config.logger.debug('constructor');
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
      // restart the timer
      this.stop();
      this.run();
    }
  }, {
    key: 'enableAlarm',
    value: function enableAlarm(time) {
      _config.logger.debug('Alarm enabled! ' + time.format('ddd, hhmmA'));
      this.alarmActive = true;
    }
  }, {
    key: 'disableAlarm',
    value: function disableAlarm(time) {
      _config.logger.debug('Alarm disabled! ' + time.format('ddd, hhmmA'));
      this.alarmActive = false;
    }
  }, {
    key: 'run',
    value: function run() {
      var _this = this;

      _config.logger.debug('running wake light');
      if (!this.alarms) {
        throw Error('alarms not set');
      }
      var now = (0, _moment2.default)();
      _config.logger.debug('' + now.format('dddd, hh:mmA'));

      var checkAlarm = function checkAlarm(alarm) {
        var alarmHour = alarm.hour;
        var alarmMinute = alarm.minute;
        var alarmDuration = alarm.duration;


        var alarmEnable = (0, _moment2.default)().hour(alarmHour).minute(alarmMinute);
        var alarmDisable = alarmEnable.add(alarmDuration, 'minutes');
        _config.logger.debug(alarmEnable.format('ddd, hhmmA') + ' is after ' + now.isAfter(alarmEnable));
        _config.logger.debug(alarmDisable.format('ddd, hhmmA') + ' is before ' + now.isBefore(alarmDisable));

        if (now.isAfter(alarmEnable) && now.isBefore(alarmDisable)) {
          return true;
        }
        return false;
      };

      var _alarms = this.alarms;
      var morning = _alarms.morning;
      var afternoon = _alarms.afternoon;

      this.timer = setInterval(function () {
        if (checkAlarm(morning) || checkAlarm(afternoon)) {
          _this.enableAlarm(now);
        } else {
          _this.disableAlarm(now);
        }
      }, 10000);
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