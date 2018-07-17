import Adapter from '../src/Adapter';

describe('aesthetic/Adapter', () => {
  it('inherits options through the constructor', () => {
    const instance = new Adapter({ foo: 'bar' });

    expect(instance.options).toEqual({ foo: 'bar' });
  });

  describe('create()', () => {
    it('returns the styleSheet as a stylesheet', () => {
      const styleSheet = { foo: {} };
      const stylesheet = new Adapter().create(styleSheet);

      expect(styleSheet).toEqual(stylesheet);
    });
  });

  describe('transform()', () => {
    it('errors if not defined', () => {
      expect(() => new Adapter().transform()).toThrowError(
        'Adapter must define the `transform` method.',
      );
    });
  });
});
