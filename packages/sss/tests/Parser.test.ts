import LocalParser from '../src/LocalParser';
import { KEYFRAMES_PERCENT } from './__mocks__/global';

describe('Parser', () => {
  let parser: LocalParser<object>;

  beforeEach(() => {
    parser = new LocalParser();
  });

  describe('parseFontFace()', () => {
    it('errors if no family name', () => {
      expect(() => {
        parser.parseFontFace('', { fontWeight: 300, srcPaths: [] });
      }).toThrow('@font-face requires a font family name.');
    });

    it('accepts an family name from the font face object', () => {
      expect(() => {
        parser.parseFontFace('', { fontFamily: 'Test', fontWeight: 300, srcPaths: [] });
      }).not.toThrow();
    });
  });

  describe('parseKeyframes()', () => {
    it('errors if no animation name', () => {
      expect(() => {
        parser.parseKeyframes('', KEYFRAMES_PERCENT);
      }).toThrow('@keyframes requires an animation name.');
    });

    it('accepts an animation name from the keyframes object', () => {
      expect(() => {
        parser.parseKeyframes('', { ...KEYFRAMES_PERCENT, name: 'test' });
      }).not.toThrow();
    });
  });

  describe('transformProperty()', () => {
    it('returns undefined if undefined', () => {
      expect(parser.transformProperty('display', undefined)).toBeUndefined();
    });
  });

  describe('wrapValueWithUnit()', () => {
    it('returns an empty string for undefined', () => {
      expect(parser.wrapValueWithUnit('display', undefined)).toBe('');
    });

    it('does nothing to strings', () => {
      expect(parser.wrapValueWithUnit('display', 'foo')).toBe('foo');
      expect(parser.wrapValueWithUnit('display', '100px')).toBe('100px');
      expect(parser.wrapValueWithUnit('display', 'red')).toBe('red');
    });

    it('does nothing to zeros', () => {
      expect(parser.wrapValueWithUnit('width', 0)).toBe(0);
    });

    it('does nothing to unitless properties', () => {
      expect(parser.wrapValueWithUnit('lineHeight', 1.5)).toBe(1.5);
    });

    it('does nothing if a unit already exists', () => {
      expect(parser.wrapValueWithUnit('width', '100em')).toBe('100em');
      expect(parser.wrapValueWithUnit('height', '10vh')).toBe('10vh');
    });

    it('appends px to numbers', () => {
      expect(parser.wrapValueWithUnit('width', 100)).toBe('100px');
    });

    it('can customize unit', () => {
      // @ts-ignore Allow
      parser.options.unit = 'em';

      expect(parser.wrapValueWithUnit('width', 100)).toBe('100em');
    });
  });
});
