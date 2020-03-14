import GlobalParser from '../src/GlobalParser';
import { Properties } from '../src/types';
import {
  FONT_ROBOTO,
  FONT_ROBOTO_FLAT_SRC,
  FONTS_CIRCULAR,
  FONTS_CIRCULAR_FLAT_SRC,
  KEYFRAMES_RANGE,
  KEYFRAMES_PERCENT,
  SYNTAX_GLOBAL,
} from './__mocks__/global';
import { createBlock } from './helpers';
import { SYNTAX_VARIABLES } from './__mocks__/local';

describe('GlobalParser', () => {
  let parser: GlobalParser<Properties>;
  let spy: jest.Mock;

  beforeEach(() => {
    parser = new GlobalParser();
    spy = jest.fn();
  });

  describe('@font-face', () => {
    beforeEach(() => {
      parser.on('font-face', spy);
    });

    it('errors if font faces are not an object', () => {
      expect(() => {
        parser.parse({
          // @ts-ignore Allow invalid type
          '@font-face': 123,
        });
      }).toThrow('@font-face must be an object of font family names to font faces.');
    });

    it('does not emit if no font faces', () => {
      parser.parse({});

      expect(spy).not.toHaveBeenCalled();
    });

    it('emits once for a single font face', () => {
      parser.parse({
        '@font-face': {
          Roboto: FONT_ROBOTO,
        },
      });

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(
        createBlock('@font-face', FONT_ROBOTO_FLAT_SRC),
        'Roboto',
        FONT_ROBOTO.srcPaths,
      );
    });

    it('emits each font face in a list of multiple', () => {
      parser.parse({
        '@font-face': {
          Circular: FONTS_CIRCULAR,
        },
      });

      expect(spy).toHaveBeenCalledTimes(4);
      expect(spy).toHaveBeenCalledWith(
        createBlock('@font-face', FONTS_CIRCULAR_FLAT_SRC[0]),
        'Circular',
        FONTS_CIRCULAR[0].srcPaths,
      );
      expect(spy).toHaveBeenCalledWith(
        createBlock('@font-face', FONTS_CIRCULAR_FLAT_SRC[3]),
        'Circular',
        FONTS_CIRCULAR[3].srcPaths,
      );
    });
  });

  describe('@global', () => {
    beforeEach(() => {
      parser.on('global', spy);
    });

    it('errors if global is not an object', () => {
      expect(() => {
        parser.parse({
          // @ts-ignore Allow invalid type
          '@global': 123,
        });
      }).toThrow('"@global" must be a declaration object of CSS properties.');
    });

    it('does not emit if no global', () => {
      parser.parse({});

      expect(spy).not.toHaveBeenCalled();
    });

    it('emits a local block for global', () => {
      parser.on('block:media', (block, query, value) => {
        block.addNested(value);
      });

      parser.parse({
        '@global': SYNTAX_GLOBAL,
      });

      expect(spy).toHaveBeenCalledWith(
        createBlock('@global', {
          height: '100%',
          margin: 0,
          fontSize: '16px',
          lineHeight: 1.5,
          backgroundColor: 'white',
          '@media (prefers-color-scheme: dark)': {
            backgroundColor: 'black',
          },
        }),
      );
    });
  });

  describe('@import', () => {
    beforeEach(() => {
      parser.on('import', spy);
    });

    it('errors if import is not an array', () => {
      expect(() => {
        parser.parse({
          // @ts-ignore Allow invalid type
          '@import': 'test.css',
        });
      }).toThrow('@import must be an array of strings or import objects.');
    });

    it('does not emit if no imports', () => {
      parser.parse({});

      expect(spy).not.toHaveBeenCalled();
    });

    it('emits each import', () => {
      parser.parse({
        '@import': [
          '"test.css"',
          '"path/test.css" screen',
          'url("test.css")',
          'url("path/test.css") screen',
        ],
      });

      expect(spy).toHaveBeenCalledTimes(4);
      expect(spy).toHaveBeenCalledWith('"test.css"');
      expect(spy).toHaveBeenCalledWith('"path/test.css" screen');
      expect(spy).toHaveBeenCalledWith('url("test.css")');
      expect(spy).toHaveBeenCalledWith('url("path/test.css") screen');
    });

    it('emits each import using objects', () => {
      parser.parse({
        '@import': [
          {
            path: 'test.css',
          },
          {
            path: 'path/test.css',
            media: 'screen',
          },
          {
            path: 'test.css',
            url: true,
          },
          {
            path: 'path/test.css',
            media: 'screen',
            url: true,
          },
        ],
      });

      expect(spy).toHaveBeenCalledTimes(4);
      expect(spy).toHaveBeenCalledWith('"test.css"');
      expect(spy).toHaveBeenCalledWith('"path/test.css" screen');
      expect(spy).toHaveBeenCalledWith('url("test.css")');
      expect(spy).toHaveBeenCalledWith('url("path/test.css") screen');
    });
  });

  describe('@keyframes', () => {
    beforeEach(() => {
      parser.on('keyframes', spy);
    });

    it('errors if keyframes are not an object', () => {
      expect(() => {
        parser.parse({
          // @ts-ignore Allow invalid type
          '@keyframes': 123,
        });
      }).toThrow('@keyframes must be an object of animation names to keyframes.');
    });

    it('does not emit if no keyframes', () => {
      parser.parse({});

      expect(spy).not.toHaveBeenCalled();
    });

    it('emits each keyframes', () => {
      parser.parse({
        '@keyframes': {
          fade: KEYFRAMES_RANGE,
          slide: KEYFRAMES_PERCENT,
        },
      });

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveBeenCalledWith(createBlock('@keyframes', KEYFRAMES_RANGE), 'fade');
      expect(spy).toHaveBeenCalledWith(createBlock('@keyframes', KEYFRAMES_PERCENT), 'slide');
    });
  });

  describe('@page', () => {
    beforeEach(() => {
      parser.on('page', spy);
    });

    it('errors if page is not an object', () => {
      expect(() => {
        parser.parse({
          // @ts-ignore Allow invalid type
          '@page': 123,
        });
      }).toThrow('"@page" must be a declaration object of CSS properties.');
    });

    it('does not emit if no page', () => {
      parser.parse({});

      expect(spy).not.toHaveBeenCalled();
    });

    it('emits root and pseudos separately', () => {
      parser.parse({
        '@page': {
          margin: '1cm',
          ':first': {
            margin: '2cm',
          },
        },
      });

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveBeenCalledWith(createBlock('@page :first', { margin: '2cm' }));
      expect(spy).toHaveBeenCalledWith(createBlock('@page', { margin: '1cm' }));
    });

    it('doesnt emit root if no properties', () => {
      parser.parse({
        '@page': {
          ':first': {
            margin: '2cm',
          },
        },
      });

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(createBlock('@page :first', { margin: '2cm' }));
    });

    it('supports complex selectors', () => {
      parser.parse({
        '@page': {
          size: '8.5in 11in',
          '@top-right': {
            content: '"Page" counter(page)',
          },
          ':blank': {
            '@top-center': {
              content: '"This page is intentionally left blank."',
            },
          },
        },
      });

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveBeenCalledWith(
        createBlock('@page :blank', {
          '@top-center': {
            content: '"This page is intentionally left blank."',
          },
        }),
      );
      expect(spy).toHaveBeenCalledWith(
        createBlock('@page', {
          size: '8.5in 11in',
          '@top-right': {
            content: '"Page" counter(page)',
          },
        }),
      );
    });
  });

  describe('@variables', () => {
    beforeEach(() => {
      parser.on('variable', spy);
    });

    it('errors if variables are not an object', () => {
      expect(() => {
        parser.parse({
          // @ts-ignore Allow invalid type
          '@variables': 123,
        });
      }).toThrow('@variables must be a mapping of CSS variables.');
    });

    it('does not emit if no variables', () => {
      parser.parse({
        '@variables': {},
      });

      expect(spy).not.toHaveBeenCalled();
    });

    it('does not emit `block:variable` listener', () => {
      const varSpy = jest.fn();

      parser.on('block:variable', varSpy);
      parser.parse({
        '@variables': {
          color: 'red',
        },
      });

      expect(varSpy).not.toHaveBeenCalled();
    });

    it('emits for each variable', () => {
      parser.parse({
        '@variables': SYNTAX_VARIABLES['@variables'],
      });

      expect(spy).toHaveBeenCalledTimes(3);
      expect(spy).toHaveBeenCalledWith('--font-size', '14px');
      expect(spy).toHaveBeenCalledWith('--color', 'red');
      expect(spy).toHaveBeenCalledWith('--line-height', 1.5);
    });
  });

  describe('@viewport', () => {
    beforeEach(() => {
      parser.on('viewport', spy);
    });

    it('errors if viewport is not an object', () => {
      expect(() => {
        parser.parse({
          // @ts-ignore Allow invalid type
          '@viewport': 123,
        });
      }).toThrow('"@viewport" must be a declaration object of CSS properties.');
    });

    it('does not emit if no viewport', () => {
      parser.parse({});

      expect(spy).not.toHaveBeenCalled();
    });

    it('emits once for a viewport', () => {
      parser.parse({
        '@viewport': {
          width: 'device-width',
          orientation: 'landscape',
        },
      });

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(
        createBlock('@viewport', {
          width: 'device-width',
          orientation: 'landscape',
        }),
      );
    });
  });
});
