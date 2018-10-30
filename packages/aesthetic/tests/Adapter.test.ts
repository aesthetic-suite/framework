import Adapter from '../src/Adapter';

describe('Adapter', () => {
  class TestAdapter extends Adapter<any> {
    transform() {
      return 'class';
    }
  }

  describe('create()', () => {
    it('returns the styleSheet as a stylesheet', () => {
      const styleSheet = { foo: {} };
      const stylesheet = new TestAdapter().create(styleSheet, 'styleName');

      expect(styleSheet).toEqual(stylesheet);
    });
  });

  describe('transform()', () => {
    it('errors if not defined', () => {
      expect(() => new TestAdapter().transform()).toThrowError(
        'Adapter must define the `transform` method.',
      );
    });
  });
});
