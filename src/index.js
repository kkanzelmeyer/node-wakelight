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

const alarmsRef = firebase.database().ref('/alarms');

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
    setTimeout(() => {
      led.blink(500);
    }, 5000);
    lillianWakeLight.on('change', (alarmState, time, name) => {
      logger.debug(`${time} ${name} alarm active? ${alarmState}`);
      if (alarmState) {
        logger.debug('alarm active! turning LED on');
        led.on();
      } else {
        logger.debug('alarm inactive! turning LED off');
        led.off();
      }
    });

    // add firebase reference value listener
    alarmsRef.on('value', (data) => {
      logger.debug('ref updated!');
      lillianWakeLight.addAlarms(data.val().lillian);
      lillianWakeLight.restart();
    });
  })
  .catch((error) => {
    logger.error(error.code, error.message);
  });
});
