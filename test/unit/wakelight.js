import test from 'ava';
import moment from 'moment';
import WakeLight from '../../src/wakelight';

const wakelight = new WakeLight();

const alarms = {
  afternoon: {
    duration: 60,
    hour: 23,
    minute: 40,
    name: 'afternoon',
  },
};

test('add alarms', t => {
  wakelight.addAlarms(alarms);
  t.true(wakelight.alarms != null, 'alarms should not be null');
});

test('enable alarm', t => {
  wakelight.enableAlarm();
  t.true(wakelight.alarmActive, 'alarm should be active');
});

test('disable alarm', t => {
  wakelight.disableAlarm();
  t.false(wakelight.alarmActive, 'alarm should be inactive');
});

test('check alarm inactive', t => {
  const testTime = moment()
    .hour(alarms.afternoon.hour)
    .minute(alarms.afternoon.minute)
    .subtract(5, 'minutes');
  wakelight.checkAlarms(testTime);
  t.false(wakelight.alarmActive, 'alarm should be inactive');
});

test('check alarm active', t => {
  const testTime = moment()
    .hour(alarms.afternoon.hour)
    .minute(alarms.afternoon.minute)
    .add(5, 'minutes');
  wakelight.checkAlarms(testTime);
  t.true(wakelight.alarmActive, 'alarm should be active');
});
