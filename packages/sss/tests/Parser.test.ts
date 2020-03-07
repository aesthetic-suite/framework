import LocalParser from '../src/LocalParser';

describe('Renderer', () => {
  let parser: LocalParser<object>;

  beforeEach(() => {
    parser = new LocalParser();
  });

  describe('wrapValueWithUnit()', () => {
    it('does nothing to strings', () => {
      expect(parser.wrapValueWithUnit('display', 'foo')).toBe('foo');
      expect(parser.wrapValueWithUnit('display', '100px')).toBe('100px');
      expect(parser.wrapValueWithUnit('display', 'red')).toBe('red');
    });

    it('does nothing to zeros', () => {
      expect(parser.wrapValueWithUnit('width', 0)).toBe('0');
    });

    it('does nothing to unitless properties', () => {
      expect(parser.wrapValueWithUnit('lineHeight', 1.5)).toBe('1.5');
    });

    it('does nothing if a unit already exists', () => {
      expect(parser.wrapValueWithUnit('width', '100em')).toBe('100em');
      expect(parser.wrapValueWithUnit('height', '10vh')).toBe('10vh');
    });

    it('appends px to numbers', () => {
      expect(parser.wrapValueWithUnit('width', 100)).toBe('100px');
    });

    it('can customize unit', () => {
      parser = new LocalParser({}, { unit: 'em' });

      expect(parser.wrapValueWithUnit('width', 100)).toBe('100em');
    });
  });
});
