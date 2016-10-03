import firebase from 'firebase';
/* eslint-disable import/no-unresolved */
import five from 'johnny-five';
import chipio from 'chip-io';
/* eslint-enable */
import { logger } from './config';
import * as keys from './keys';
import WakeLight from './wakelight';

logger.debug('initializing firebase app');
firebase.initializeApp(keys.config);

const lillianRef = firebase.database().ref('/1a/');
const lillianAlarmRef = firebase.database().ref('/1a/alarms/');
const lillianActiveRef = firebase.database().ref('/1a/active/');

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

    // alarm light change listener
    lillianWakeLight.on('change', (alarmState) => {
      logger.debug('===================================');
      logger.debug('wakelight change handler');
      lillianRef.update({ active: alarmState });
      logger.debug('\n');
    });

    // add firebase alarm reference value listener
    lillianAlarmRef.on('value', (data) => {
      logger.debug('===================================');
      logger.debug('alarm change handler');
      logger.debug(data.val());
      lillianWakeLight.addAlarms(data.val());
      lillianWakeLight.restart();
      logger.debug('\n');
    });

    // add alarm status value listener
    lillianActiveRef.on('value', data => {
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
      logger.debug('\n');
    });
  })
  .catch((error) => {
    logger.error(error.code, error.message);
  });
});
