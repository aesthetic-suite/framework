import { objectLoop, isObject } from '@aesthetic/utils';
import Block from '../src/Block';
import GlobalParser from '../src/GlobalParser';
import { Properties } from '../src/types';
import {
  FONT_ROBOTO,
  FONT_ROBOTO_FLAT_SRC,
  FONTS_CIRCULAR,
  FONTS_CIRCULAR_FLAT_SRC,
  KEYFRAMES_RANGE,
  KEYFRAMES_PERCENT,
} from './__mocks__/global';

function createBlock(selector: string, properties: object): Block<Properties> {
  const block = new Block(selector);

  objectLoop(properties, (value, key) => {
    if (isObject(value)) {
      block.addNested(createBlock(key, value));
    } else {
      block.addProperty(key, value);
    }
  });

  return block;
}

describe('GlobalParser', () => {
  let parser: GlobalParser<Properties>;

  beforeEach(() => {
    parser = new GlobalParser();

    parser.on('block:property', (block, key, value) => {
      block.addProperty(key as keyof Properties, value);
    });
  });

  describe('@font-face', () => {
    let spy: jest.Mock;

    beforeEach(() => {
      spy = jest.fn();
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

  describe.skip('@global', () => {
    let spy: jest.Mock;

    beforeEach(() => {
      spy = jest.fn();
      parser.on('global', spy);
    });
  });

  describe('@import', () => {
    let spy: jest.Mock;

    beforeEach(() => {
      spy = jest.fn();
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
    let spy: jest.Mock;

    beforeEach(() => {
      spy = jest.fn();
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
      expect(spy).toHaveBeenCalledWith(createBlock('@keyframes fade', KEYFRAMES_RANGE), 'fade');
      expect(spy).toHaveBeenCalledWith(createBlock('@keyframes slide', KEYFRAMES_PERCENT), 'slide');
    });
  });

  describe('@page', () => {
    let spy: jest.Mock;

    beforeEach(() => {
      spy = jest.fn();
      parser.on('page', spy);
    });

    it('errors if page is not an object', () => {
      expect(() => {
        parser.parse({
          // @ts-ignore Allow invalid type
          '@page': 123,
        });
      }).toThrow('@page must be an object of properties.');
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

  describe('@viewport', () => {
    let spy: jest.Mock;

    beforeEach(() => {
      spy = jest.fn();
      parser.on('viewport', spy);
    });

    it('errors if viewport is not an object', () => {
      expect(() => {
        parser.parse({
          // @ts-ignore Allow invalid type
          '@viewport': 123,
        });
      }).toThrow('Block "@viewport" must be an object of properties.');
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
