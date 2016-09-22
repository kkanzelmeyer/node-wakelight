import moment from 'moment';
import { logger } from '../../src/config';

describe('moment', () => {
  describe('time check', () => {
    let now;
    beforeEach(() => {
      now = moment();
      logger.debug(`Now: ${now.format('dddd, hh:mmA')}`);
    });

    it('now should be after the alarm time', () => {
      const alarm = now.add(30, 'minutes');
      logger.debug(`Alarm: ${alarm.format('dddd, hh:mmA')}`);
      expect(now.isBefore(alarm)).to.equal(true);
    });
  });
});
