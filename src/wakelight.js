import moment from 'moment';
import _ from 'lodash';
import { logger } from './config';

class WakeLight {
  constructor() {
    this._changeObservers = [];
    // default alarms - 7am and 3pm
    this._alarms = [{
      duration: 60,
      hour: 7,
      id: 0,
      minute: 0,
      name: 'morning',
    }, {
      duration: 60,
      hour: 15,
      id: 1,
      minute: 15,
      name: 'afternoon',
    }];
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

    const format = 'dddd, MMMM Do YYYY, h:mm:ss a';

    // get current time reference
    const now = time || moment();
    logger.debug(`Time is ${now.format(format)}`);

    // look for an active alarm
    const enableAlarm = _.find(this._alarms, alarm => {
      const { hour: alarmHour,
        minute: alarmMinute } = alarm;

      // create time reference for the alarm enable
      const alarmEnable = moment()
        .hour(alarmHour)
        .minute(alarmMinute);

      return now.isSame(alarmEnable, 'minute');
    });

    // look for an active alarm
    const disableAlarm = _.find(this._alarms, alarm => {
      const { hour: alarmHour,
        minute: alarmMinute,
        duration: alarmDuration } = alarm;

      // create time reference for the alarm disable
      const alarmDisable = moment()
        .hour(alarmHour)
        .minute(alarmMinute)
        .add(alarmDuration, 'minutes');

      return now.isSame(alarmDisable, 'minute');
    });

    if (enableAlarm) {
      this.handleChange(true, now.format('dddd hh:mm:ss a'), enableAlarm.name);
    }

    if (disableAlarm) {
      this.handleChange(false, now.format('dddd hh:mm:ss a'), disableAlarm.name);
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
