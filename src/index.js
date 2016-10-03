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

    // add firebase reference value listener
    lillianRef.on('value', (data) => {
      logger.debug('ref updated!');
      logger.debug(`alarm active? ${data.val().active}`);
      lillianWakeLight.addAlarms(data.val().alarms);
      lillianWakeLight.restart();
      if (data.val().active) {
        led.on();
      } else {
        led.off();
      }
    });

    // alarm light change listener
    lillianWakeLight.on('change', (alarmState, time, name) => {
      logger.debug(`alarm ${name} active? ${alarmState}`);
      lillianRef.update({ active: alarmState });
    });
  })
  .catch((error) => {
    logger.error(error.code, error.message);
  });
});
