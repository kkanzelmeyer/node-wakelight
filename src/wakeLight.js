import moment from 'moment';
import { logger } from './config';

class WakeLight {

  constructor() {
    logger.debug('constructor');
  }

  addLED(led) {
    logger.debug('adding led');
    this.led = led;
  }

  updateAlarms(alarms) {
    logger.debug('updating alarms');
    logger.debug(alarms);
    this.alarms = alarms;
    // restart the timer
    this.stop();
    this.run();
  }

  enableAlarm() {
    logger.debug('Alarm enabled!');
    this.alarmActive = true;
  }

  disableAlarm() {
    logger.debug('Alarm disabled!');
    this.alarmActive = false;
  }

  run() {
    logger.debug('running wake light');
    if (!this.alarms) {
      logger.error('alarms not set');
      return;
    }

    const checkAlarm = (alarm) => {
      const { hour: alarmHour,
        minute: alarmMinute,
        duration: alarmDuration } = alarm;

      // get current time reference
      const now = moment();

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
        return true;
      }
      return false;
    };

    const { morning, afternoon } = this.alarms;
    this.timer = setInterval(() => {
      // get current time reference
      const now = moment();
      if (checkAlarm(morning) || checkAlarm(afternoon)) {
        this.enableAlarm(now);
      } else {
        this.disableAlarm(now);
      }
    }, 60000);
  }

  stop() {
    clearTimeout(this.timer);
  }
}

export default WakeLight;
