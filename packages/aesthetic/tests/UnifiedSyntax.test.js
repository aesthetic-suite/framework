/* eslint-disable sort-keys */

import UnifiedSyntax from '../src/UnifiedSyntax';
import {
  FONT_ROBOTO,
  FONT_ROBOTO_FLAT_SRC,
  KEYFRAME_FADE,
  SYNTAX_UNIFIED_FULL,
  SYNTAX_NATIVE_PARTIAL,
  SYNTAX_CHARSET,
  SYNTAX_DESCENDANT,
  SYNTAX_FALLBACKS,
  SYNTAX_FONT_FACE,
  SYNTAX_GLOBAL,
  SYNTAX_IMPORT,
  SYNTAX_KEYFRAMES,
  SYNTAX_MEDIA_QUERY,
  SYNTAX_NAMESPACE,
  SYNTAX_PAGE,
  SYNTAX_PROPERTIES,
  SYNTAX_PSEUDO,
  SYNTAX_SUPPORTS,
  SYNTAX_VIEWPORT,
} from '../../../tests/mocks';

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

  it('creates an unsupported handler', () => {
    const handler = instance.createUnsupportedHandler('@foo');

    expect(() => {
      handler();
    }).toThrowError('Adapter does not support "@foo".');
  });

  it('converts a full styleSheet', () => {
    expect(instance.convert(SYNTAX_UNIFIED_FULL)).toEqual({
      '@font-face': [FONT_ROBOTO],
      '@keyframes fade': KEYFRAME_FADE,
      button: {
        ...SYNTAX_NATIVE_PARTIAL.button,
        '@media (max-width: 600px)': {
          padding: '4px 8px',
        },
      },
    });
  });

  describe('checkBlock()', () => {
    it('errors for non-objects', () => {
      expect(() => {
        instance.checkBlock(123);
      }).toThrowError('Must be a style declaration.');
    });
  });

  describe('convert()', () => {
    it('errors for invalid at-rule', () => {
      expect(() => {
        instance.convert({
          '@foo': {},
        });
      }).toThrowError('Unsupported global at-rule "@foo".');
    });

    it('errors for invalid value type', () => {
      expect(() => {
        instance.convert({
          foo: 123,
        });
      }).toThrowError('Invalid style declaration for "foo".');
    });

    it('skips falsy value', () => {
      expect(instance.convert({
        foo: '',
        bar: false,
        baz: undefined,
        '@qux': 0,
      })).toEqual({});
    });

    it('passes strings (class names) through', () => {
      expect(instance.convert({
        foo: 'foo-123',
      })).toEqual({
        foo: 'foo-123',
      });
    });

    it('passes style declarations through', () => {
      expect(instance.convert({
        foo: {
          display: 'block',
        },
      })).toEqual({
        foo: {
          display: 'block',
        },
      });
    });

    describe('@charset', () => {
      it('converts value', () => {
        expect(instance.convert(SYNTAX_CHARSET)).toEqual({
          '@charset': 'utf8',
        });
      });

      it('triggers event handler', () => {
        const spy = jest.fn();

        instance.on('@charset', spy);
        instance.convert(SYNTAX_CHARSET);

        expect(spy).toHaveBeenCalledWith({}, 'utf8');
      });

      it('errors if invalid value', () => {
        expect(() => {
          instance.convert({
            '@charset': 123,
          });
        }).toThrowError('@charset value must be a string.');
      });
    });

    describe('@font-face', () => {
      it('converts value', () => {
        expect(instance.convert(SYNTAX_FONT_FACE)).toEqual({
          '@font-face': [FONT_ROBOTO],
          font: {
            fontFamily: 'Roboto',
            fontSize: 20,
          },
        });
      });

      it('converts an array of values and injects font family', () => {
        expect(instance.convert({
          '@font-face': {
            Roboto: FONT_ROBOTO,
            'Open Sans': [
              {
                fontStyle: 'normal',
                fontWeight: 'normal',
                srcPaths: ['fonts/OpenSans.woff2', 'fonts/OpenSans.ttf'],
              },
              {
                fontStyle: 'italic',
                fontWeight: 'normal',
                srcPaths: ['fonts/OpenSans-Italic.woff2', 'fonts/OpenSans-Italic.ttf'],
              },
              {
                fontStyle: 'normal',
                fontWeight: 'bold',
                srcPaths: ['fonts/OpenSans-Bold.woff2', 'fonts/OpenSans-Bold.ttf'],
              },
            ],
          },
        })).toEqual({
          '@font-face': [
            FONT_ROBOTO,
            {
              fontFamily: 'Open Sans',
              fontStyle: 'normal',
              fontWeight: 'normal',
              srcPaths: ['fonts/OpenSans.woff2', 'fonts/OpenSans.ttf'],
            },
            {
              fontFamily: 'Open Sans',
              fontStyle: 'italic',
              fontWeight: 'normal',
              srcPaths: ['fonts/OpenSans-Italic.woff2', 'fonts/OpenSans-Italic.ttf'],
            },
            {
              fontFamily: 'Open Sans',
              fontStyle: 'normal',
              fontWeight: 'bold',
              srcPaths: ['fonts/OpenSans-Bold.woff2', 'fonts/OpenSans-Bold.ttf'],
            },
          ],
        });
      });

      it('caches value', () => {
        instance.convert(SYNTAX_FONT_FACE);

        expect(instance.fontFaces).toEqual({
          Roboto: [FONT_ROBOTO],
        });
      });

      it('triggers event handler', () => {
        const spy = jest.fn();

        instance.on('@font-face', spy);
        instance.convert(SYNTAX_FONT_FACE);

        expect(spy).toHaveBeenCalledWith(expect.objectContaining({}), [FONT_ROBOTO], 'Roboto');
      });
    });

    describe('@global', () => {
      beforeEach(() => {
        instance.on('@global', (styleSheet, declaration, selector) => {
          // eslint-disable-next-line no-param-reassign
          styleSheet[selector] = declaration;
        });
      });

      it('converts value', () => {
        expect(instance.convert(SYNTAX_GLOBAL)).toEqual({
          body: { margin: 0 },
          html: { height: '100%' },
          a: {
            color: 'red',
            ':hover': {
              color: 'darkred',
            },
          },
        });
      });

      it('triggers event handler', () => {
        const spy = jest.fn();

        instance.on('@global', spy);
        instance.convert(SYNTAX_GLOBAL);

        expect(spy).toHaveBeenCalledWith({}, { margin: 0 }, 'body');
      });

      it('errors if invalid value', () => {
        expect(() => {
          instance.convert({
            '@global': {
              foo: 123,
            },
          });
        }).toThrowError('Invalid @global selector style declaration.');
      });
    });

    describe('@import', () => {
      it('converts value', () => {
        expect(instance.convert(SYNTAX_IMPORT)).toEqual({
          '@import': './some/path.css',
        });
      });

      it('triggers event handler', () => {
        const spy = jest.fn();

        instance.on('@import', spy);
        instance.convert(SYNTAX_IMPORT);

        expect(spy).toHaveBeenCalledWith({}, './some/path.css');
      });

      it('errors if invalid value', () => {
        expect(() => {
          instance.convert({
            '@import': 123,
          });
        }).toThrowError('@import value must be a string.');
      });
    });

    describe('@keyframes', () => {
      it('converts value', () => {
        expect(instance.convert(SYNTAX_KEYFRAMES)).toEqual({
          '@keyframes fade': KEYFRAME_FADE,
          animation: {
            animationName: 'fade',
            animationDuration: '3s, 1200ms',
            animationIterationCount: 'infinite',
          },
        });
      });

      it('caches value', () => {
        instance.convert(SYNTAX_KEYFRAMES);

        expect(instance.keyframes).toEqual({
          fade: KEYFRAME_FADE,
        });
      });

      it('triggers event handler', () => {
        const spy = jest.fn();

        instance.on('@keyframes', spy);
        instance.convert(SYNTAX_KEYFRAMES);

        expect(spy).toHaveBeenCalledWith(expect.objectContaining({}), KEYFRAME_FADE, 'fade');
      });
    });

    describe('@namespace', () => {
      it('converts value', () => {
        expect(instance.convert(SYNTAX_NAMESPACE)).toEqual({
          '@namespace': 'url(http://www.w3.org/1999/xhtml)',
        });
      });

      it('triggers event handler', () => {
        const spy = jest.fn();

        instance.on('@namespace', spy);
        instance.convert(SYNTAX_NAMESPACE);

        expect(spy).toHaveBeenCalledWith({}, 'url(http://www.w3.org/1999/xhtml)');
      });

      it('errors if invalid value', () => {
        expect(() => {
          instance.convert({
            '@namespace': 123,
          });
        }).toThrowError('@namespace value must be a string.');
      });
    });

    describe('@page', () => {
      it('converts value', () => {
        expect(instance.convert(SYNTAX_PAGE)).toEqual({
          '@page': {
            margin: '1cm',
          },
        });
      });

      it('triggers event handler', () => {
        const spy = jest.fn();

        instance.on('@page', spy);
        instance.convert(SYNTAX_PAGE);

        expect(spy).toHaveBeenCalledWith({}, {
          margin: '1cm',
        });
      });

      it('errors if invalid value', () => {
        expect(() => {
          instance.convert({
            '@page': 123,
          });
        }).toThrowError('@page must be a style object.');
      });
    });

    describe('@viewport', () => {
      it('converts value', () => {
        expect(instance.convert(SYNTAX_VIEWPORT)).toEqual({
          '@viewport': {
            width: 'device-width',
            orientation: 'landscape',
          },
        });
      });

      it('triggers event handler', () => {
        const spy = jest.fn();

        instance.on('@viewport', spy);
        instance.convert(SYNTAX_VIEWPORT);

        expect(spy).toHaveBeenCalledWith({}, {
          width: 'device-width',
          orientation: 'landscape',
        });
      });

      it('errors if invalid value', () => {
        expect(() => {
          instance.convert({
            '@viewport': 123,
          });
        }).toThrowError('@viewport must be a style object.');
      });
    });
  });

  describe('convertDeclaration()', () => {
    it('errors for invalid at-rule', () => {
      expect(() => {
        instance.convertDeclaration('test', {
          '@foo': {},
        });
      }).toThrowError('Unsupported local at-rule "@foo".');
    });

    it('skips falsy at-rules', () => {
      expect(instance.convertDeclaration('test', {
        '@fallbacks': 0,
      })).toEqual({});
    });

    describe('properties', () => {
      it('converts value', () => {
        expect(instance.convertDeclaration('props', SYNTAX_PROPERTIES.props))
          .toEqual(SYNTAX_PROPERTIES.props);
      });

      it('converts pseudos', () => {
        expect(instance.convertDeclaration('pseudo', SYNTAX_PSEUDO.pseudo))
          .toEqual(SYNTAX_PSEUDO.pseudo);
      });

      it('triggers event handler', () => {
        const spy = jest.fn();

        instance.on('property', spy);
        instance.convertDeclaration('props', {
          margin: 10,
        });

        expect(spy).toHaveBeenCalledWith({}, 10, 'margin');
      });
    });

    describe('descendants', () => {
      it('converts value', () => {
        expect(instance.convertDeclaration('descendants', SYNTAX_DESCENDANT.list))
          .toEqual(SYNTAX_DESCENDANT.list);
      });

      it('triggers event handler', () => {
        const spy = jest.fn();

        instance.on('descendant', spy);
        instance.convertDeclaration('descendants', SYNTAX_DESCENDANT.list);

        expect(spy).toHaveBeenCalledWith({
          margin: 0,
          padding: 0,
        }, {
          listStyle: 'bullet',
        }, '> li');
      });
    });

    describe('@fallbacks', () => {
      it('converts value', () => {
        expect(instance.convertDeclaration('fallbacks', SYNTAX_FALLBACKS.fallback)).toEqual({
          background: ['linear-gradient(...)', 'red'],
          display: ['flex', 'box', 'flex-box'],
        });
      });

      it('triggers event handler', () => {
        const spy = jest.fn();

        instance.on('@fallbacks', spy);
        instance.convertDeclaration('fallbacks', SYNTAX_FALLBACKS.fallback);

        expect(spy).toHaveBeenCalledWith(
          expect.objectContaining({}),
          ['box', 'flex-box'],
          'display',
        );
      });
    });

    describe('@media', () => {
      it('converts value', () => {
        expect(instance.convertDeclaration('media', SYNTAX_MEDIA_QUERY.media)).toEqual({
          color: 'red',
          '@media (min-width: 300px)': {
            color: 'blue',
          },
          '@media (max-width: 1000px)': {
            color: 'green',
          },
        });
      });

      it('triggers event handler', () => {
        const spy = jest.fn();

        instance.on('@media', spy);
        instance.convertDeclaration('media', SYNTAX_MEDIA_QUERY.media);

        expect(spy).toHaveBeenCalledWith(expect.objectContaining({}), {
          color: 'blue',
        }, '(min-width: 300px)');
      });

      it('errors if invalid value', () => {
        expect(() => {
          instance.convertDeclaration('media', {
            '@media': {
              '(min-width: 300px)': 123,
            },
          });
        }).toThrowError('@media (min-width: 300px) must be a mapping of conditions to style objects.');
      });
    });

    describe('@supports', () => {
      it('converts value', () => {
        expect(instance.convertDeclaration('supports', SYNTAX_SUPPORTS.sup)).toEqual({
          display: 'block',
          '@supports (display: flex)': {
            display: 'flex',
          },
          '@supports not (display: flex)': {
            float: 'left',
          },
        });
      });

      it('triggers event handler', () => {
        const spy = jest.fn();

        instance.on('@supports', spy);
        instance.convertDeclaration('supports', SYNTAX_SUPPORTS.sup);

        expect(spy).toHaveBeenCalledWith(expect.objectContaining({}), {
          display: 'flex',
        }, '(display: flex)');
      });

      it('errors if invalid value', () => {
        expect(() => {
          instance.convertDeclaration('supports', {
            '@supports': {
              '(display: flex)': 123,
            },
          });
        }).toThrowError('@supports (display: flex) must be a mapping of conditions to style objects.');
      });
    });
  });

  describe('injectFontFaces()', () => {
    it('converts to an array', () => {
      expect(instance.injectFontFaces('Roboto, Verdana, sans-serif', {})).toEqual([
        'Roboto',
        'Verdana',
        'sans-serif',
      ]);
    });

    it('replaces font family with font face object', () => {
      expect(instance.injectFontFaces('Roboto, Verdana, sans-serif', {
        Roboto: [FONT_ROBOTO],
      })).toEqual([
        FONT_ROBOTO_FLAT_SRC,
        'Verdana',
        'sans-serif',
      ]);
    });
  });

  describe('injectKeyframes()', () => {
    it('converts to an array', () => {
      expect(instance.injectKeyframes('fade, twist', {})).toEqual([
        'fade',
        'twist',
      ]);
    });

    it('replaces animation name with keyframes object', () => {
      expect(instance.injectKeyframes('fade, twist', {
        fade: KEYFRAME_FADE,
      })).toEqual([
        KEYFRAME_FADE,
        'twist',
      ]);
    });
  });
});
