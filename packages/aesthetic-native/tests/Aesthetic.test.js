import Aesthetic from '../src/Aesthetic';
import { TestAdapter } from '../../../tests/mocks';

describe('aesthetic-native/Aesthetic', () => {
  let instance = null;

  beforeEach(() => {
    // Does not require an adapter
    instance = new Aesthetic();
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

    it('bypasses RN StyleSheets', () => {
      instance.adapter.bypassNativeStyleSheet = true;

      instance.setStyles('foo', {
        button: { fontWeight: 'bold' },
      });

      expect(instance.transformStyles('foo')).toEqual({
        button: { fontWeight: 'bold' },
      });
    });
  });

  describe('validateTransform()', () => {
    it('errors if value is not an object', () => {
      instance.setAdapter(new TestAdapter());

      expect(() => instance.validateTransform('foo', 'header', 'flex'))
        .toThrowError('React Native requires style objects to be returned from the adapter. "foo@header" is a string.');
    });
  });
});
