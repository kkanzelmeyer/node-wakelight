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

  enableAlarm(time) {
    logger.debug(`Alarm enabled! ${time.format('ddd, hhmmA')}`);
    this.alarmActive = true;
  }

  disableAlarm(time) {
    logger.debug(`Alarm disabled! ${time.format('ddd, hhmmA')}`);
    this.alarmActive = false;
  }

  run() {
    logger.debug('running wake light');
    if (!this.alarms) {
      throw Error('alarms not set');
    }
    const now = moment();
    logger.debug(`${now.format('dddd, hh:mmA')}`);

    const checkAlarm = (alarm) => {
      const { hour: alarmHour,
        minute: alarmMinute,
        duration: alarmDuration } = alarm;

      const alarmEnable = moment().hour(alarmHour).minute(alarmMinute);
      const alarmDisable = alarmEnable.add(alarmDuration, 'minutes');
      logger.debug(`${alarmEnable.format('ddd, hhmmA')} is after ${now.isAfter(alarmEnable)}`);
      logger.debug(`${alarmDisable.format('ddd, hhmmA')} is before ${now.isBefore(alarmDisable)}`);

      if (now.isAfter(alarmEnable) && now.isBefore(alarmDisable)) {
        return true;
      }
      return false;
    };

    const { morning, afternoon } = this.alarms;
    this.timer = setInterval(() => {
      if (checkAlarm(morning) || checkAlarm(afternoon)) {
        this.enableAlarm(now);
      } else {
        this.disableAlarm(now);
      }
    }, 10000);
  }

  stop() {
    clearTimeout(this.timer);
  }
}

export default WakeLight;
