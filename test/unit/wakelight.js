import test from 'ava';
import moment from 'moment';
import { logger } from '../../src/config';
import WakeLight from '../../src/wakelight';

let wakelight = null;

const alarms = [
  {
    duration: 60,
    hour: 23,
    minute: 40,
    name: 'afternoon',
    id: 0,
  },
];

const [testAlarm] = alarms;

test.beforeEach(t => {
  wakelight = new WakeLight();
  wakelight.addAlarms(alarms);
  t.not(null, wakelight._alarms, 'alarms should not be null');
});

test('run wakelight', t => {
  wakelight.run();
  t.not(null, wakelight._timer, 'if wakelight is running, the timer should not be null');
});

test('stop wakelight', t => {
  wakelight.stop();
  t.is(null, wakelight._timer, 'if wakelight is not running, the timer should be null');
});

test('wakelight change handler', t => {
  t.plan(1);
  // add change handler
  const changeHandler = (state, time, name) => {
    logger.debug(`State changed!, ${state} ${time} ${name}`);
    t.true(state, 'alarm state should be active');
  };
  wakelight.on('change', changeHandler);

  // ensure the alarm is not active
  const testTime1 = moment()
    .hour(testAlarm.hour)
    .minute(testAlarm.minute)
    .add(5, 'minutes');
  wakelight.checkAlarms(testTime1);
});
