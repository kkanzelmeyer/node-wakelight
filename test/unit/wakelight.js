import test from 'ava';
import moment from 'moment';
import { logger } from '../../src/config';
import WakeLight from '../../src/wakelight';

const wakelight = new WakeLight();

const alarms = {
  morning: {
    duration: 60,
    hour: 10,
    minute: 15,
    name: 'morning',
  },
};

test('add alarms', t => {
  wakelight.addAlarms(alarms);
  t.not(null, wakelight.alarms, 'alarms should not be null');
});

test('check alarm active', t => {
  const testTime = moment()
    .hour(alarms.morning.hour)
    .minute(alarms.morning.minute)
    .add(5, 'minutes');
  wakelight.checkAlarms((alarmActive, time) => {
    logger.debug(alarmActive, time);
  }, testTime);
  t.true(wakelight.alarmActive, 'alarm should be active');
});

test('check alarm inactive', t => {
  const testTime = moment()
    .hour(alarms.morning.hour)
    .minute(alarms.morning.minute)
    .subtract(5, 'minutes');
  wakelight.checkAlarms((alarmActive, time) => {
    logger.debug(alarmActive, time);
  }, testTime);
  t.false(wakelight.alarmActive, 'alarm should be inactive');
});

test('run wakelight', t => {
  wakelight.run((status, time) => {
    logger.debug(status, time);
  });
  t.not(null, wakelight.timer, 'if wakelight is running, the timer should not be null');
});

test('stop wakelight', t => {
  wakelight.stop();
  t.is(null, wakelight.timer, 'if wakelight is not running, the timer should be null');
});
