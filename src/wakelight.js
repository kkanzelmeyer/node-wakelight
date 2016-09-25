import moment from 'moment';
import { logger } from './config';

class WakeLight {
  constructor() {
    this.alarmActive = false;
  }
  /**
   * add or update wakelight alarms. calling this method
   * will restart the alarms timer and immediately check
   * if the alarms should be active
   * @method  addAlarms
   * @param   {Object}    An object where each key contains an alarm
   */
  addAlarms(alarms) {
    logger.debug('updating alarms');
    this.alarms = alarms;
  }

  /**
   * Check if the wakelight alarm should be active
   * @method checkAlarms
   * @param   {Function}  cb        a callback to call when the alarm state changes. The
   *                                callback is passed the status of the alarmActive boolean and
   *                                the time value that triggered the alarm
   * @param   [Object]    timeRef   an optional time reference to check the alarm(s) against. If no
   *                                value is provided the current system time is used.
   */
  checkAlarms(cb, time) {
    if (!this.alarms) {
      throw Error('alarms not set =/');
    }
    Object.keys(this.alarms).forEach(key => {
      const alarm = this.alarms[key];
      const { hour: alarmHour,
        minute: alarmMinute,
        duration: alarmDuration } = alarm;

      // get current time reference
      const now = time || moment();

      // create time reference for the alarm enable
      const alarmEnable = moment()
        .hour(alarmHour)
        .minute(alarmMinute);

      // create time reference for the alarm disable
      const alarmDisable = moment()
        .hour(alarmHour)
        .minute(alarmMinute)
        .add(alarmDuration, 'minutes');

      const alarmState = this.alarmActive;
      this.alarmActive = (now.isAfter(alarmEnable) && now.isBefore(alarmDisable));
      // only call the callback when the alarm state changes
      if (alarmState) {
        if (!this.alarmActive) {
          cb(this.alarmActive, now.format('dddd hh:mm:ss a'));
          return;
        }
      }
      if (this.alarmActive) {
        cb(this.alarmActive, now.format('dddd hh:mm:ss a'));
        return;
      }
    });
  }

  /**
   * start the wakelight time poller
   * @method run
   * @param {Function}  cb   a callback to call when the alarm state changes. The
   *                         callback is passed the status of the alarmActive boolean and
   *                         the time value that triggered the alarm
   */
  run(cb) {
    logger.debug('running wakelight');
    if (!this.alarms) {
      logger.error('alarms not set');
      return;
    }
    this.checkAlarms(cb);

    /*
     * set an interval to check the time and see if the alarm
     * should be activated
     */
    this.timer = setInterval(() => {
      this.checkAlarms(cb);
    }, 60000);
  }

  /**
   * stop the wakelight time poller
   * @method stop
   * @param {Function} cb   a callback to call when the alarm state changes.. The
   *                        callback is passed the status of the alarmActive boolean
   */
  stop(cb) {
    this.alarmActive = false;
    if (cb) {
      cb(this.alarmActive);
    }
    clearTimeout(this.timer);
    this.timer = null;
  }

  /**
   * Restart the wakelight time poller
   * @method restart
   * @param {Function} startCallback   callback to call when the alarm state changes. The
   *                                 callback is passed the status of the alarmActive boolean and
   *                                 the time value that triggered the alarm
   * @param [Function] stopCallback    callback to call when the wakelight stops running. The
   *                                 callback is passed the status of the alarmActive boolean
   */

  restart(startCallback, stopCallback) {
    this.stop(stopCallback);
    this.run(startCallback);
  }
}

export default WakeLight;
