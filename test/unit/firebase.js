import test from 'ava';
import firebase from 'firebase';
// import { logger } from '../../src/config';
import * as keys from '../../src/keys';

test.beforeEach('firebase init and login', t => {
  firebase.initializeApp(keys.config);
  firebase.auth().signInWithEmailAndPassword(
    keys.email, keys.password)
  .then((user) => {
    t.pass(`${user.email} signed in`);
  })
  .catch((error) => {
    t.fail(error.code, error.message);
  });
});

test('firebase reference', t => {
  t.pass('not implemented yet');
});
