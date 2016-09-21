import firebase from 'firebase';
import moment from 'moment';
import { logger } from './config';

class WakeLight {

  constructor() {
    logger.debug('constructor');
    const config = {
      apiKey: 'AIzaSyAZpOcP8VH2aanLo6lwDrVS04wS4fb5TFU',
      authDomain: 'wake-light.firebaseapp.com',
      databaseURL: 'https://wake-light.firebaseio.com',
      storageBucket: 'wake-light.appspot.com',
      messagingSenderId: '748386075172',
    };
    try {
      firebase.initializeApp(config);
      const alarmsRef = firebase.database().ref('/alarms');

      alarmsRef.on('value', (data) => {
        logger.debug('ref updated!');
        this.updateAlarms(data.val());
      });

      this.alarmsRef = alarmsRef;
    } catch (err) {
      logger.error(err);
    }
  }

  addLED(led) {
    logger.debug('adding led');
    this.led = led;
  }

  updateAlarms(alarms) {
    logger.debug('updating alarms');
    this.alarms = alarms;
    if (this.timer) {
      this.stop();
    }
    this.run();
  }

  setAlarms(alarms) {
    logger.debug('setting alarms');
    logger.debug(alarms);
    const { morning, afternoon } = alarms;
    const lillianAlarmsRef = this.alarmsRef.child('alarms');
    lillianAlarmsRef.set({
      morning,
      afternoon,
    });
  }

  run() {
    /**
     * function to check if the current time should trigger an alarm
     */
    const checkAlarm = (alarm) => {
      const hour = moment().hour();
      const minute = moment().minute();
      if (hour === alarm.hour) {
        if (minute === alarm.minute) {
          logger.debug(`Alarm Active - time: ${hour}:${minute}`);
          return true;
        }
      }
      logger.debug(`${hour}:${minute} - no alarm`);
      this.alarmActive = false;
      return false;
    };

    logger.debug('running wake light');
    if (!this.alarms) {
      throw Error('alarms not set');
    }
    const { morning, afternoon } = this.alarms.lillian;
    this.timer = setInterval(() => {
      this.alarmActive = checkAlarm(morning) || checkAlarm(afternoon);
    }, 60000);
  }

  stop() {
    clearTimeout(this.timer);
  }
}

export default WakeLight;
