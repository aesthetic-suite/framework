import { expect } from 'chai';
import Adapter, { GLOBAL, LOCAL } from '../src/Adapter';
import { TestAdapter, FONT_ROBOTO, KEYFRAME_FADE } from '../../../tests/mocks';

describe('Adapter', () => {
  let instance;

  beforeEach(() => {
    instance = new Adapter();
  });

  describe('disableUnifiedSyntax()', () => {
    it('disables it', () => {
      expect(instance.unifiedSyntax).to.equal(true);

      instance.disableUnifiedSyntax();

      expect(instance.unifiedSyntax).to.equal(false);
    });
  });

  describe('convert()', () => {
    it('ignores string values', () => {
      expect(instance.convert('foo', {
        foo: 'foo',
        bar: 'bar',
      })).to.deep.equal({});
    });

    it('extracts global level at-rules: @font-face, @keyframes', () => {
      expect(instance.fontFaces).to.deep.equal({});
      expect(instance.keyframes).to.deep.equal({});

      expect(instance.convert('foo', {
        '@font-face': {
          roboto: FONT_ROBOTO,
        },
        '@keyframes': {
          fade: KEYFRAME_FADE,
        },
      })).to.deep.equal({});

      expect(instance.fontFaces).to.deep.equal({
        roboto: FONT_ROBOTO,
      });
      expect(instance.keyframes).to.deep.equal({
        fade: KEYFRAME_FADE,
      });
    });

    it('extracts local level at-rules: @fallbacks, @media', () => {
      expect(instance.convert('foo', {
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

  describe('convertProperties()', () => {
    it('extracts local level at-rules: @fallbacks, @media', () => {
      expect(instance.fallbacks).to.deep.equal({});
      expect(instance.mediaQueries).to.deep.equal({});

      expect(instance.convertProperties('foo', {
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
        roboto: FONT_ROBOTO,
      };

      expect(() => (
        instance.extractFontFaces('foo', {
          roboto: FONT_ROBOTO,
        }, GLOBAL)
      )).to.throw(TypeError, 'Font face "roboto" has already been defined.');
    });

    it('extracts font faces at-rule', () => {
      expect(instance.fontFaces).to.deep.equal({});

      instance.extractFontFaces('foo', {
        roboto: FONT_ROBOTO,
      }, GLOBAL);

      expect(instance.fontFaces).to.deep.equal({
        roboto: FONT_ROBOTO,
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

  describe('transform()', () => {
    it('transforms with unified syntax', () => {
      instance = new TestAdapter();

      expect(instance.transform('foo', {
        '@font-face': {
          roboto: FONT_ROBOTO,
        },
        '@keyframes': {
          fade: KEYFRAME_FADE,
        },
        button: {
          margin: 0,
          padding: 5,
          display: 'inline-block',
          backgroundColor: '#ccc',
          ':hover': {
            backgroundColor: '#eee',
          },
          '::before': {
            content: '★',
            display: 'inline-block',
            marginRight: 5,
          },
          '@media': {
            '(min-width: 400px)': {
              maxWidth: 'auto',
            },
          },
        },
      })).to.deep.equal({
        button: {
          margin: 0,
          padding: 5,
          display: 'inline-block',
          backgroundColor: '#ccc',
          ':hover': {
            backgroundColor: '#eee',
          },
          '::before': {
            content: '★',
            display: 'inline-block',
            marginRight: 5,
          },
        },
      });
    });

    it('transforms with native syntax', () => {
      instance = new TestAdapter();
      instance.disableUnifiedSyntax();

      expect(instance.transform('foo', {
        '@font-face': FONT_ROBOTO,
        '@keyframes fade': KEYFRAME_FADE,
        button: {
          margin: 0,
          padding: 5,
          display: 'inline-block',
          backgroundColor: '#ccc',
          '&:hover': {
            backgroundColor: '#eee',
          },
          '&::before': {
            content: '★',
            display: 'inline-block',
            marginRight: 5,
          },
          '@media (min-width: 400px)': {
            maxWidth: 'auto',
          },
        },
      })).to.deep.equal({
        '@font-face': FONT_ROBOTO,
        '@keyframes fade': KEYFRAME_FADE,
        button: {
          margin: 0,
          padding: 5,
          display: 'inline-block',
          backgroundColor: '#ccc',
          '&:hover': {
            backgroundColor: '#eee',
          },
          '&::before': {
            content: '★',
            display: 'inline-block',
            marginRight: 5,
          },
          '@media (min-width: 400px)': {
            maxWidth: 'auto',
          },
        },
      });
    });
  });

  describe('transformStyles()', () => {
    it('errors if not defined', () => {
      expect(() => instance.transformStyles())
        .to.throw(Error, 'Adapter must define the `transformStyles` method.');
    });
  });
});
