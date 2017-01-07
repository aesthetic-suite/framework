import { expect } from 'chai';
import UnifiedSyntax, { GLOBAL, LOCAL } from '../src/UnifiedSyntax';
import { FONT_ROBOTO, KEYFRAME_FADE } from '../../../tests/mocks';

describe('UnifiedSyntax', () => {
  let instance;

  beforeEach(() => {
    instance = new UnifiedSyntax();
  });

  describe('convert()', () => {
    it('ignores string values', () => {
      expect(instance.convert({
        foo: 'foo',
        bar: 'bar',
      })).to.deep.equal({
        foo: 'foo',
        bar: 'bar',
      });
    });

    it('extracts global level at-rules: @font-face, @keyframes', () => {
      expect(instance.fontFaces).to.deep.equal({});
      expect(instance.keyframes).to.deep.equal({});

      expect(instance.convert({
        '@font-face': {
          mrroboto: FONT_ROBOTO,
        },
        '@keyframes': {
          fade: KEYFRAME_FADE,
        },
      })).to.deep.equal({});

      expect(instance.fontFaces).to.deep.equal({
        Roboto: FONT_ROBOTO,
      });
      expect(instance.keyframes).to.deep.equal({
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
      })).to.deep.equal({
        tooltip: {
          maxWidth: 300,
          display: 'flex',
        },
      });
    });
  });

  describe('convertDeclaration()', () => {
    it('extracts local level at-rules: @fallbacks, @media', () => {
      expect(instance.fallbacks).to.deep.equal({});
      expect(instance.mediaQueries).to.deep.equal({});

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
      })).to.deep.equal({
        maxWidth: 300,
        display: 'flex',
      });

      expect(instance.fallbacks).to.deep.equal({
        foo: {
          display: ['box', 'flex-box'],
        },
      });
      expect(instance.mediaQueries).to.deep.equal({
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
        .to.throw(SyntaxError, 'At-rule declaration "@media" must be an object.');
    });

    it('errors if an array', () => {
      expect(() => instance.extract('foo', '@media', [{}, {}], GLOBAL))
        .to.throw(SyntaxError, 'At-rule declaration "@media" must be an object.');
    });

    it('errors if not an object', () => {
      expect(() => instance.extract('foo', '@media', 123, GLOBAL))
        .to.throw(SyntaxError, 'At-rule declaration "@media" must be an object.');
    });

    it('errors if invalid at-rule', () => {
      expect(() => instance.extract('foo', '@foo', {}, GLOBAL))
        .to.throw(SyntaxError, 'Unsupported at-rule "@foo".');
    });
  });

  describe('extractFallbacks()', () => {
    it('errors if from global scope', () => {
      expect(() => instance.extractFallbacks('foo', {}, GLOBAL))
        .to.throw(SyntaxError, 'Property fallbacks must be defined locally to an element.');
    });

    it('extracts fallbacks at-rule', () => {
      expect(instance.fallbacks).to.deep.equal({});

      instance.extractFallbacks('foo', {
        background: 'red',
        display: ['box', 'flex-box'],
      }, LOCAL);

      expect(instance.fallbacks).to.deep.equal({
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
        .to.throw(SyntaxError, 'Font faces must be declared in the global scope.');
    });

    it('errors if font has already been extracted', () => {
      instance.fontFaces = {
        Roboto: FONT_ROBOTO,
      };

      expect(() => (
        instance.extractFontFaces('foo', {
          mrroboto: FONT_ROBOTO,
        }, GLOBAL)
      )).to.throw(TypeError, 'Font face "Roboto" has already been defined.');
    });

    it('extracts font faces at-rule', () => {
      expect(instance.fontFaces).to.deep.equal({});

      instance.extractFontFaces('foo', {
        mrroboto: FONT_ROBOTO,
      }, GLOBAL);

      expect(instance.fontFaces).to.deep.equal({
        Roboto: FONT_ROBOTO,
      });
    });
  });

  describe('extractKeyframes()', () => {
    it('errors if from local scope', () => {
      expect(() => instance.extractKeyframes('foo', {}, LOCAL))
        .to.throw(SyntaxError, 'Animation keyframes must be declared in the global scope.');
    });

    it('errors if keyframe has already been extracted', () => {
      instance.keyframes = {
        fade: KEYFRAME_FADE,
      };

      expect(() => (
        instance.extractKeyframes('foo', {
          fade: KEYFRAME_FADE,
        }, GLOBAL)
      )).to.throw(TypeError, 'Animation keyframe "fade" has already been defined.');
    });

    it('extracts keyframes at-rule', () => {
      expect(instance.keyframes).to.deep.equal({});

      instance.extractKeyframes('foo', {
        fade: KEYFRAME_FADE,
      }, GLOBAL);

      expect(instance.keyframes).to.deep.equal({
        fade: KEYFRAME_FADE,
      });
    });
  });

  describe('extractMediaQueries()', () => {
    it('errors if from global scope', () => {
      expect(() => instance.extractMediaQueries('foo', {}, GLOBAL))
        .to.throw(SyntaxError, 'Media queries must be defined locally to an element.');
    });

    it('extracts media query at-rule', () => {
      expect(instance.mediaQueries).to.deep.equal({});

      instance.extractMediaQueries('foo', {
        '(min-width: 400px)': {
          maxWidth: 'auto',
        },
      }, LOCAL);

      expect(instance.mediaQueries).to.deep.equal({
        foo: {
          '(min-width: 400px)': {
            maxWidth: 'auto',
          },
        },
      });
    });
  });
});
