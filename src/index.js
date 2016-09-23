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

// add auth
firebase.auth().signInWithEmailAndPassword(
  keys.email, keys.password)
.then((user) => {
  logger.debug(`${user.email} signed in`);

  // init wakelight
  const lillianWakeLight = new WakeLight();
  const board = new five.Board({
    io: new chipio() // eslint-disable-line
  });
  board.on('ready', () => {
    // Create an LED on the XIO-P0 pin
    const led = new five.Led('XIO-P0');
    lillianWakeLight.addLED(led);
  });

  // add value listener
  alarmsRef.on('value', (data) => {
    logger.debug('ref updated!');
    lillianWakeLight.addAlarms(data.val().lillian);
    lillianWakeLight.restart();
  });
})
.catch((error) => {
  logger.error(error.code, error.message);
});
