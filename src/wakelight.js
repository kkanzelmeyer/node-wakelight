import moment from 'moment';
import _ from 'lodash';
import { logger } from './config';

class WakeLight {
  constructor() {
    this._changeObservers = [];
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
        this._changeObservers.push(handler);
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
    this._changeObservers.forEach(handler => {
      handler(...args);
    });
  }

  /**
   * add or update wakelight alarms. calling this method
   * will restart the alarms _timer and immediately check
   * if the alarms should be active
   * @method  addAlarms
   * @param   {Object}    An object where each key contains an alarm
   */
  addAlarms(alarms) {
    logger.debug('updating alarms');
    this._alarms = alarms;
  }

  /**
   * Check if the wakelight alarm should be active
   * @method checkAlarms
   * @param   [Object]    timeRef   optional momentjs time reference to check the alarm(s) against.
   *                                If no value is provided the system time is used.
   */
  checkAlarms(time) {
    if (!this._alarms) {
      throw Error('alarms not set =/');
    }

    // get current time reference
    const now = time || moment();

    // look for an active alarm
    const activeAlarm = _.find(this._alarms, alarm => {
      const { hour: alarmHour,
        minute: alarmMinute,
        duration: alarmDuration } = alarm;

      // create time reference for the alarm enable
      const alarmEnable = moment()
        .hour(alarmHour)
        .minute(alarmMinute);

      // create time reference for the alarm disable
      const alarmDisable = moment()
        .hour(alarmHour)
        .minute(alarmMinute)
        .add(alarmDuration, 'minutes');

      return (now.isAfter(alarmEnable) && now.isBefore(alarmDisable)) === true;
    });
    if (activeAlarm) {
      logger.debug(activeAlarm);
      this.handleChange(true, now.format('dddd hh:mm:ss a'), activeAlarm.name);
    } else {
      this.handleChange(false, null, null);
    }
  }

  /**
   * start the wakelight time poller
   * @method run
   */
  run() {
    logger.debug('running wakelight');
    if (!this._alarms) {
      logger.error('alarms not set');
      return;
    }
    this.checkAlarms();

    /*
     * set an interval to check the time and see if the alarm
     * should be activated
     */
    this._timer = setInterval(() => {
      this.checkAlarms();
    }, 60000);
  }

  /**
   * stop the wakelight time poller
   * @method stop
   */
  stop() {
    clearTimeout(this._timer);
    this._timer = null;
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
