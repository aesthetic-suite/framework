import doParse from '../src/parse';
import { GlobalStyleSheet, ParserOptions } from '../src/types';
import {
  FONT_ROBOTO,
  FONT_ROBOTO_FLAT_SRC,
  FONTS_CIRCULAR,
  FONTS_CIRCULAR_FLAT_SRC,
  KEYFRAMES_PERCENT,
  KEYFRAMES_RANGE,
  SYNTAX_ROOT,
} from './__mocks__/global';
import { SYNTAX_VARIABLES } from './__mocks__/local';
import { createBlock } from './helpers';

function parse(styleSheet: GlobalStyleSheet, options: Partial<ParserOptions<object>>) {
  doParse('global', styleSheet, options);
}

describe('GlobalParser', () => {
  let spy: jest.Mock;

  beforeEach(() => {
    spy = jest.fn();
  });

  describe('@font-face', () => {
    it('errors if font faces are not an object', () => {
      expect(() => {
        parse(
          {
            // @ts-expect-error
            '@font-face': 123,
          },
          {},
        );
      }).toThrow('@font-face must be an object of font family names to font faces.');
    });

    it('does not emit if no font faces', () => {
      parse(
        {},
        {
          onFontFace: spy,
        },
      );

      expect(spy).not.toHaveBeenCalled();
    });

    it('emits once for a single font face', () => {
      parse(
        {
          '@font-face': {
            Roboto: FONT_ROBOTO,
          },
        },
        {
          onFontFace: spy,
        },
      );

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(
        createBlock('@font-face', FONT_ROBOTO_FLAT_SRC),
        'Roboto',
        FONT_ROBOTO.srcPaths,
      );
    });

    it('emits each font face in a list of multiple', () => {
      parse(
        {
          '@font-face': {
            Circular: FONTS_CIRCULAR,
          },
        },
        {
          onFontFace: spy,
        },
      );

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

  describe('@root', () => {
    it('errors if root is not an object', () => {
      expect(() => {
        parse(
          {
            // @ts-expect-error
            '@root': 123,
          },
          {},
        );
      }).toThrow('"@root" must be a declaration object of CSS properties.');
    });

    it('does not emit if no goot', () => {
      parse(
        {},
        {
          onRoot: spy,
        },
      );

      expect(spy).not.toHaveBeenCalled();
    });

    it('emits a local block for root', () => {
      parse(
        {
          '@root': SYNTAX_ROOT,
        },
        {
          onRoot: spy,
          onMedia(block, query, value) {
            block.nest(value);
          },
        },
      );

      expect(spy).toHaveBeenCalledWith(
        createBlock('@root', {
          height: '100%',
          margin: 0,
          fontSize: 16,
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
    it('errors if import is not an array', () => {
      expect(() => {
        parse(
          {
            // @ts-expect-error
            '@import': 'test.css',
          },
          {},
        );
      }).toThrow('@import must be an array of strings or import objects.');
    });

    it('does not emit if no imports', () => {
      parse(
        {},
        {
          onImport: spy,
        },
      );

      expect(spy).not.toHaveBeenCalled();
    });

    it('emits each import', () => {
      parse(
        {
          '@import': [
            '"test.css"',
            '"path/test.css" screen',
            'url("test.css")',
            'url("path/test.css") screen',
          ],
        },
        {
          onImport: spy,
        },
      );

      expect(spy).toHaveBeenCalledTimes(4);
      expect(spy).toHaveBeenCalledWith('"test.css"');
      expect(spy).toHaveBeenCalledWith('"path/test.css" screen');
      expect(spy).toHaveBeenCalledWith('url("test.css")');
      expect(spy).toHaveBeenCalledWith('url("path/test.css") screen');
    });

    it('emits each import using objects', () => {
      parse(
        {
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
        },
        {
          onImport: spy,
        },
      );

      expect(spy).toHaveBeenCalledTimes(4);
      expect(spy).toHaveBeenCalledWith('"test.css"');
      expect(spy).toHaveBeenCalledWith('"path/test.css" screen');
      expect(spy).toHaveBeenCalledWith('url("test.css")');
      expect(spy).toHaveBeenCalledWith('url("path/test.css") screen');
    });
  });

  describe('@keyframes', () => {
    it('errors if keyframes are not an object', () => {
      expect(() => {
        parse(
          {
            // @ts-expect-error
            '@keyframes': 123,
          },
          {},
        );
      }).toThrow('@keyframes must be an object of animation names to keyframes.');
    });

    it('does not emit if no keyframes', () => {
      parse(
        {},
        {
          onKeyframes: spy,
        },
      );

      expect(spy).not.toHaveBeenCalled();
    });

    it('emits each keyframes', () => {
      parse(
        {
          '@keyframes': {
            fade: KEYFRAMES_RANGE,
            slide: KEYFRAMES_PERCENT,
          },
        },
        {
          onKeyframes: spy,
        },
      );

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveBeenCalledWith(createBlock('@keyframes', KEYFRAMES_RANGE), 'fade');
      expect(spy).toHaveBeenCalledWith(createBlock('@keyframes', KEYFRAMES_PERCENT), 'slide');
    });
  });

  describe('@variables', () => {
    it('errors if variables are not an object', () => {
      expect(() => {
        parse(
          {
            // @ts-expect-error
            '@variables': 123,
          },
          {},
        );
      }).toThrow('@variables must be a mapping of CSS variables.');
    });

    it('does not emit `block:variable` listener', () => {
      parse(
        {
          '@variables': {
            color: 'red',
          },
        },
        {
          onVariable: spy,
        },
      );

      expect(spy).not.toHaveBeenCalled();
    });

    it('emits for each variable', () => {
      parse(
        {
          '@variables': SYNTAX_VARIABLES['@variables'],
        },
        {
          onRootVariables: spy,
        },
      );

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        '--font-size': '14px',
        '--color': 'red',
        '--line-height': 1.5,
      });
    });
  });
});
