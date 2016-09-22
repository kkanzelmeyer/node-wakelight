import firebase from 'firebase';
import five from 'johnny-five';
import chipio from 'chip-io';
import { logger, NODE_ENV } from './config';
import * as keys from './keys';
import WakeLight from './wakeLight';

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

  // add value listener
  alarmsRef.on('value', (data) => {
    logger.debug('ref updated!');
    lillianWakeLight.updateAlarms(data.val().lillian);
  });

  // init chip board
  const board = new five.Board({
    io: new chipio() // eslint-disable-line
  });
  board.on('ready', () => {
    // Create an LED on the XIO-P0 pin
    const led = new five.Led('XIO-P0');
    lillianWakeLight.addLED(led);
    // Blink every half second
    led.blink(500);
    setTimeout(() => {
      led.stop();
      led.off();
    }, 3000);
  });
})
.catch((error) => {
  logger.error(error.code, error.message);
});
