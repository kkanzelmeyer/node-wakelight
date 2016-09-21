import WakeLight from '../../src/WakeLight';

describe('wakelight', () => {
  let wakeLight = null;
  describe('Constructor', () => {
    beforeEach(() => {
      wakeLight = new WakeLight();
    });

    it('should update the alarms', () => {
      wakeLight.setAlarms(alarms);
      expect(wakeLight.alarms).to.equal(alarms);
    });

  });
});
