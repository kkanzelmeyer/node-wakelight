import firebase from 'firebase';
import { logger } from './config';
import * as keys from './keys';
// import five from 'johnny-five';
// import chipio from 'chip-io';
import WakeLight from './wakeLight';

// const board = new five.Board({
//   io: new chipio()
// });
//
// board.on('ready', function() {
//   // Create an LED on the XIO-P0 pin
//   // var led = new five.Led('XIO-P0');
//
//   // Blink every half second
// });
//
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
})
.catch((error) => {
  logger.error(error.code, error.message);
});
