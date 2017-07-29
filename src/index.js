import firebase from 'firebase';
/* eslint-disable import/no-unresolved */
import five from 'johnny-five';
import chipio from 'chip-io';
import keys from '/home/kevin/wakelightKeys.json';
/* eslint-enable */
import { logger } from './config';
import WakeLight from './wakelight';

logger.debug('initializing firebase app');
firebase.initializeApp(keys.config);

const wakelightRef = firebase.database().ref('wakelight/1a');
const alarmRef = firebase.database().ref('wakelight/1a/alarms');
const activeRef = firebase.database().ref('wakelight/1a/active');
logger.debug(`wakelight ref - ${wakelightRef.key}`);
logger.debug(`alarm ref - ${alarmRef.key}`);
logger.debug(`active ref - ${activeRef.key}`);

// init wakelight
const lillianWakeLight = new WakeLight();
const board = new five.Board({
  io: new chipio() // eslint-disable-line
});
board.on('ready', () => {
  // connect to firebase with email/password auth
  firebase.auth()
  .signInWithEmailAndPassword(keys.email, keys.password)
  .then((user) => {
    logger.debug(`${user.email} signed in`);

    // change handler for the alarm status
    const led = new five.Led('XIO-P0');
    logger.debug('added led');

    // alarm light change listener
    lillianWakeLight.on('change', (alarmState) => {
      logger.debug('===================================');
      logger.debug('wakelight change handler');
      wakelightRef.update({ active: alarmState });
    });

    // add firebase alarm reference value listener
    alarmRef.on('value', (data) => {
      logger.debug('===================================');
      logger.debug('alarm change handler');
      logger.debug(data.val());
      lillianWakeLight.addAlarms(data.val());
      lillianWakeLight.restart();
    });

    // add alarm status value listener
    activeRef.on('value', data => {
      logger.debug('===================================');
      logger.debug('active change handler');
      logger.debug(data.val());
      if (data.val() === true) {
        logger.debug('led on');
        led.on();
      } else {
        logger.debug('led off');
        led.stop().off();
      }
    });
  })
  .catch((error) => {
    logger.error(error);
    logger.error(error.code, error.message);
  });
});
