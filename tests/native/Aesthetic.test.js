import Aesthetic from '../../src/native/Aesthetic';
import { TestAdapter } from '../mocks';

describe('native/Aesthetic', () => {
  let instance = null;

  beforeEach(() => {
    instance = new Aesthetic(new TestAdapter());
  });

  describe('transformStyles()', () => {
    it('wraps style objects in RN StyleSheets', () => {
      instance.setStyles('foo', {
        button: { fontWeight: 'bold' },
        tooltip: 'tooltip', // Should be converted to object
      });

      expect(instance.transformStyles('foo')).toEqual({
        button: { fontWeight: 'bold' },
        tooltip: {},
      });
    });
  });
});
