import moment from 'moment';
import { logger } from './config';

class WakeLight {
  constructor() {
    this.alarmActive = false;
    this.changeObservers = [];
  }

  /**
   * Event subscriber
   * @method on
   * @param {String}    event     the name of the event
   * @param {Function}  handler   the event handler
   */
  on(event, handler) {
    switch (event) {
      case 'change':
        this.changeObservers.push(handler);
        break;
      default:
        throw Error('event not available');
    }
  }

  /**
   * Change Event emitter
   * @method handleChange
   */
  handleChange(...args) {
    this.changeObservers.forEach(handler => {
      handler(...args);
    });
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
   * @param   [Object]    timeRef   an optional time reference to check the alarm(s) against. If no
   *                                value is provided the current system time is used.
   */
  checkAlarms(time) {
    if (!this.alarms) {
      throw Error('alarms not set =/');
    }
    Object.keys(this.alarms).forEach(key => {
      const alarm = this.alarms[key];
      const { hour: alarmHour,
        minute: alarmMinute,
        duration: alarmDuration,
        name: alarmName } = alarm;

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
      if (alarmState ? !this.alarmActive : this.alarmActive) {
        this.handleChange(this.alarmActive, now.format('dddd hh:mm:ss a'), alarmName);
      }
    });
  }

  /**
   * start the wakelight time poller
   * @method run
   */
  run() {
    logger.debug('running wakelight');
    if (!this.alarms) {
      logger.error('alarms not set');
      return;
    }
    this.checkAlarms();

    /*
     * set an interval to check the time and see if the alarm
     * should be activated
     */
    this.timer = setInterval(() => {
      this.checkAlarms();
    }, 60000);
  }

  /**
   * stop the wakelight time poller
   * @method stop
   */
  stop() {
    this.alarmActive = false;
    clearTimeout(this.timer);
    this.timer = null;
  }

  /**
   * Restart the wakelight time poller
   * @method restart
   */

  restart() {
    this.stop();
    this.run();
  }
}

export default WakeLight;
