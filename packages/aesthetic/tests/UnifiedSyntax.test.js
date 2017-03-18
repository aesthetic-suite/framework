import UnifiedSyntax, { GLOBAL, LOCAL } from '../src/UnifiedSyntax';
import { FONT_ROBOTO, KEYFRAME_FADE } from '../../../tests/mocks';

describe('aesthetic/UnifiedSyntax', () => {
  let instance;

  beforeEach(() => {
    instance = new UnifiedSyntax();
  });

  it('can add and remove event listeners', () => {
    const func = () => {};

    instance.on('event', func);

    expect(instance.events.event).toEqual(func);

    instance.off('event');

    expect(instance.events.event).toBeUndefined();
  });

  describe('convert()', () => {
    it('ignores string values', () => {
      expect(instance.convert({
        foo: 'foo',
        bar: 'bar',
      })).toEqual({
        foo: 'foo',
        bar: 'bar',
      });
    });

    it('extracts global level at-rules: @font-face, @keyframes', () => {
      expect(instance.fontFaces).toEqual({});
      expect(instance.keyframes).toEqual({});

      expect(instance.convert({
        '@font-face': {
          mrroboto: FONT_ROBOTO,
        },
        '@keyframes': {
          fade: KEYFRAME_FADE,
        },
      })).toEqual({});

      expect(instance.fontFaces).toEqual({
        Roboto: FONT_ROBOTO,
      });
      expect(instance.keyframes).toEqual({
        fade: KEYFRAME_FADE,
      });
    });

    it('extracts local level at-rules: @fallbacks, @media', () => {
      expect(instance.convert({
        tooltip: {
          maxWidth: 300,
          display: 'flex',
          '@fallbacks': {
            display: ['box', 'flex-box'],
          },
          '@media': {
            '(min-width: 400px)': {
              maxWidth: 'auto',
            },
          },
        },
      })).toEqual({
        tooltip: {
          maxWidth: 300,
          display: 'flex',
        },
      });
    });
  });

  describe('convertDeclaration()', () => {
    it('extracts local level at-rules: @fallbacks, @media', () => {
      expect(instance.fallbacks).toEqual({});
      expect(instance.mediaQueries).toEqual({});

      expect(instance.convertDeclaration('foo', {
        maxWidth: 300,
        display: 'flex',
        '@fallbacks': {
          display: ['box', 'flex-box'],
        },
        '@media': {
          '(min-width: 400px)': {
            maxWidth: 'auto',
          },
        },
      })).toEqual({
        maxWidth: 300,
        display: 'flex',
      });

      expect(instance.fallbacks).toEqual({
        foo: {
          display: ['box', 'flex-box'],
        },
      });
      expect(instance.mediaQueries).toEqual({
        foo: {
          '(min-width: 400px)': {
            maxWidth: 'auto',
          },
        },
      });
    });
  });

  describe('extract()', () => {
    it('errors if an empty value is passed', () => {
      expect(() => instance.extract('foo', '@media', null, GLOBAL))
        .toThrowError('At-rule declaration "@media" must be an object.');
    });

    it('errors if an array', () => {
      expect(() => instance.extract('foo', '@media', [{}, {}], GLOBAL))
        .toThrowError('At-rule declaration "@media" must be an object.');
    });

    it('errors if not an object', () => {
      expect(() => instance.extract('foo', '@media', 123, GLOBAL))
        .toThrowError('At-rule declaration "@media" must be an object.');
    });

    it('errors if invalid at-rule', () => {
      expect(() => instance.extract('foo', '@foo', {}, GLOBAL))
        .toThrowError('Unsupported at-rule "@foo".');
    });
  });

  describe('extractFallbacks()', () => {
    it('errors if from global scope', () => {
      expect(() => instance.extractFallbacks('foo', {}, GLOBAL))
        .toThrowError('Property fallbacks must be defined locally to an element.');
    });

    it('extracts fallbacks at-rule', () => {
      expect(instance.fallbacks).toEqual({});

      instance.extractFallbacks('foo', {
        background: 'red',
        display: ['box', 'flex-box'],
      }, LOCAL);

      expect(instance.fallbacks).toEqual({
        foo: {
          background: 'red',
          display: ['box', 'flex-box'],
        },
      });
    });
  });

  describe('extractFontFaces()', () => {
    it('errors if from local scope', () => {
      expect(() => instance.extractFontFaces('foo', {}, LOCAL))
        .toThrowError('Font faces must be declared in the global scope.');
    });

    it('errors if font has already been extracted', () => {
      instance.fontFaces = {
        Roboto: FONT_ROBOTO,
      };

      expect(() => (
        instance.extractFontFaces('foo', {
          mrroboto: FONT_ROBOTO,
        }, GLOBAL)
      )).toThrowError('Font face "Roboto" has already been defined.');
    });

    it('extracts font faces at-rule', () => {
      expect(instance.fontFaces).toEqual({});

      instance.extractFontFaces('foo', {
        mrroboto: FONT_ROBOTO,
      }, GLOBAL);

      expect(instance.fontFaces).toEqual({
        Roboto: FONT_ROBOTO,
      });
    });
  });

  describe('extractKeyframes()', () => {
    it('errors if from local scope', () => {
      expect(() => instance.extractKeyframes('foo', {}, LOCAL))
        .toThrowError('Animation keyframes must be declared in the global scope.');
    });

    it('errors if keyframe has already been extracted', () => {
      instance.keyframes = {
        fade: KEYFRAME_FADE,
      };

      expect(() => (
        instance.extractKeyframes('foo', {
          fade: KEYFRAME_FADE,
        }, GLOBAL)
      )).toThrowError('Animation keyframe "fade" has already been defined.');
    });

    it('extracts keyframes at-rule', () => {
      expect(instance.keyframes).toEqual({});

      instance.extractKeyframes('foo', {
        fade: KEYFRAME_FADE,
      }, GLOBAL);

      expect(instance.keyframes).toEqual({
        fade: KEYFRAME_FADE,
      });
    });
  });

  describe('extractMediaQueries()', () => {
    it('errors if from global scope', () => {
      expect(() => instance.extractMediaQueries('foo', {}, GLOBAL))
        .toThrowError('Media queries must be defined locally to an element.');
    });

    it('extracts media query at-rule', () => {
      expect(instance.mediaQueries).toEqual({});

      instance.extractMediaQueries('foo', {
        '(min-width: 400px)': {
          maxWidth: 'auto',
        },
      }, LOCAL);

      expect(instance.mediaQueries).toEqual({
        foo: {
          '(min-width: 400px)': {
            maxWidth: 'auto',
          },
        },
      });
    });
  });

  describe('resetGlobalCache()', () => {
    it('deletes global cache', () => {
      instance.fontFaces.roboto = FONT_ROBOTO;
      instance.keyframes.fade = KEYFRAME_FADE;

      instance.resetGlobalCache();

      expect(instance.fontFaces.roboto).toBeUndefined();
      expect(instance.keyframes.fade).toBeUndefined();
    });
  });

  describe('resetLocalCache()', () => {
    it('deletes local cache', () => {
      instance.fallbacks.foo = { display: 'flex' };
      instance.mediaQueries.foo = { '(min-width: 300px)': {} };

      instance.resetLocalCache();

      expect(instance.fallbacks.foo).toBeUndefined();
      expect(instance.mediaQueries.foo).toBeUndefined();
    });
  });
});
