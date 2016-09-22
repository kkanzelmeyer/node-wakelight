import moment from 'moment';
import { logger } from './config';

class WakeLight {

  /**
   * adds a Johnny Five led to the wakelight
   * @method addLED
   * @param [Object] led  a Johnny Five LED
   * @see http://johnny-five.io/examples/led/
   */
  addLED(led) {
    logger.debug('adding led');
    this.led = led;
    // Blink every half second
    led.blink(500);
    setTimeout(() => {
      led.stop();
      led.off();
    }, 5000);
  }

  /**
   * add or update wakelight alarms. calling this method
   * will restart the alarms timer and immediately check
   * if the alarms should be active
   * @param {Object}  An object where each key contains an alarm
   */
  addAlarms(alarms) {
    logger.debug('updating alarms');
    this.alarms = alarms;
  }

  /**
   * Enable the alarm
   */
  enableAlarm() {
    logger.debug('Alarm enabled!');
    this.alarmActive = true;
    if (this.led) {
      this.led.on();
    }
  }

  /**
   * Disable the alarm
   */
  disableAlarm() {
    logger.debug('Alarm disabled!');
    this.alarmActive = false;
    if (this.led) {
      this.led.off();
    }
  }

  /**
   * Check an array of alarms to see if any of them are alarmActive
   * @param [Array] alarms an array of alarm objects
   */
  checkAlarms(time) {
    const alarms = Object.values(this.alarms);
    logger.debug(alarms);
    alarms.forEach(alarm => {
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

      if (now.isAfter(alarmEnable) && now.isBefore(alarmDisable)) {
        this.enableAlarm();
      } else {
        this.disableAlarm();
      }
    });
  }

  run() {
    logger.silly('running wake light');
    if (!this.alarms) {
      logger.error('alarms not set');
      return;
    }
    this.checkAlarms();

    // set an interval to check the time and see if the alarm should be activated
    this.timer = setInterval(() => {
      // get current time reference
      this.checkAlarms();
    }, 60000);
  }

  stop() {
    this.disableAlarm();
    clearTimeout(this.timer);
  }
}

export default WakeLight;
