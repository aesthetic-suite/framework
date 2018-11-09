import UnifiedSyntax from '../src/UnifiedSyntax';
import GlobalSheet from '../src/syntax/GlobalSheet';
import { Ruleset } from '../src/types';
import {
  SYNTAX_CHARSET,
  SYNTAX_FONT_FACE,
  FONT_ROBOTO,
  FONT_ROBOTO_FLAT_SRC,
  SYNTAX_FONT_FACE_MULTIPLE,
  FONT_CIRCULAR_MULTIPLE,
  FONT_CIRCULAR_MULTIPLE_FLAT_SRC,
  SYNTAX_FONT_FACE_MIXED,
  SYNTAX_IMPORT,
  SYNTAX_IMPORT_MULTIPLE,
  SYNTAX_KEYFRAMES,
  KEYFRAME_FADE,
  SYNTAX_KEYFRAMES_PERCENT,
  KEYFRAME_SLIDE_PERCENT,
  SYNTAX_KEYFRAMES_MIXED,
} from '../../../tests/mocks';

describe('UnifiedSyntax', () => {
  let syntax: UnifiedSyntax<Ruleset>;

  beforeEach(() => {
    syntax = new UnifiedSyntax();
  });

  describe('convertGlobalSheet()', () => {
    it('errors for unknown properties (not at-rules)', () => {
      expect(() => {
        syntax.convertGlobalSheet({
          // @ts-ignore Allow unknown
          unknown: 'property',
        });
      }).toThrowErrorMatchingSnapshot();
    });

    describe('@charset', () => {
      it('emits event', () => {
        const spy = jest.fn();

        syntax.on('@charset', spy);
        syntax.convertGlobalSheet(SYNTAX_CHARSET);

        expect(spy).toHaveBeenCalledWith(new GlobalSheet(), 'utf8');
      });

      it('errors if not a string', () => {
        expect(() => {
          syntax.convertGlobalSheet({
            // @ts-ignore Allow invalid type
            '@charset': 123,
          });
        }).toThrowErrorMatchingSnapshot();
      });
    });

    describe('@font-face', () => {
      it('emits event for a single font', () => {
        const spy = jest.fn();

        syntax.on('@font-face', spy);
        syntax.convertGlobalSheet(SYNTAX_FONT_FACE);

        expect(spy).toHaveBeenCalledWith(new GlobalSheet(), [FONT_ROBOTO_FLAT_SRC], 'Roboto', [
          FONT_ROBOTO.srcPaths,
        ]);
      });

      it('emits event for a single font with multiple faces', () => {
        const spy = jest.fn();

        syntax.on('@font-face', spy);
        syntax.convertGlobalSheet(SYNTAX_FONT_FACE_MULTIPLE);

        expect(spy).toHaveBeenCalledWith(
          new GlobalSheet(),
          FONT_CIRCULAR_MULTIPLE_FLAT_SRC,
          'Circular',
          FONT_CIRCULAR_MULTIPLE.map(font => font.srcPaths),
        );
      });

      it('emits event for multiple fonts', () => {
        const spy = jest.fn();

        syntax.on('@font-face', spy);
        syntax.convertGlobalSheet(SYNTAX_FONT_FACE_MIXED);

        expect(spy).toHaveBeenCalledWith(new GlobalSheet(), [FONT_ROBOTO_FLAT_SRC], 'Roboto', [
          FONT_ROBOTO.srcPaths,
        ]);

        expect(spy).toHaveBeenCalledWith(
          new GlobalSheet(),
          FONT_CIRCULAR_MULTIPLE_FLAT_SRC,
          'Circular',
          FONT_CIRCULAR_MULTIPLE.map(font => font.srcPaths),
        );
      });

      it('errors if not an object', () => {
        expect(() => {
          syntax.convertGlobalSheet({
            // @ts-ignore Allow invalid type
            '@font-face': 123,
          });
        }).toThrowErrorMatchingSnapshot();
      });
    });

    describe('@import', () => {
      it('emits event for a string', () => {
        const spy = jest.fn();

        syntax.on('@import', spy);
        syntax.convertGlobalSheet(SYNTAX_IMPORT);

        expect(spy).toHaveBeenCalledWith(new GlobalSheet(), ['./some/path.css']);
      });

      it('emits event for an array of strings', () => {
        const spy = jest.fn();

        syntax.on('@import', spy);
        syntax.convertGlobalSheet(SYNTAX_IMPORT_MULTIPLE);

        expect(spy).toHaveBeenCalledWith(new GlobalSheet(), [
          './some/path.css',
          './another/path.css',
        ]);
      });

      it('errors if not a string', () => {
        expect(() => {
          syntax.convertGlobalSheet({
            // @ts-ignore Allow invalid type
            '@import': 123,
          });
        }).toThrowErrorMatchingSnapshot();
      });
    });

    describe('@keyframes', () => {
      it('emits event', () => {
        const spy = jest.fn();

        syntax.on('@keyframes', spy);
        syntax.convertGlobalSheet(SYNTAX_KEYFRAMES);

        expect(spy).toHaveBeenCalledWith(new GlobalSheet(), KEYFRAME_FADE, 'fade');
      });

      it('emits event with percentage based keyframes', () => {
        const spy = jest.fn();

        syntax.on('@keyframes', spy);
        syntax.convertGlobalSheet(SYNTAX_KEYFRAMES_PERCENT);

        expect(spy).toHaveBeenCalledWith(new GlobalSheet(), KEYFRAME_SLIDE_PERCENT, 'slide');
      });

      it('emits event for multiple keyframes', () => {
        const spy = jest.fn();

        syntax.on('@keyframes', spy);
        syntax.convertGlobalSheet(SYNTAX_KEYFRAMES_MIXED);

        expect(spy).toHaveBeenCalledWith(new GlobalSheet(), KEYFRAME_FADE, 'fade');
        expect(spy).toHaveBeenCalledWith(new GlobalSheet(), KEYFRAME_SLIDE_PERCENT, 'slide');
      });

      it('errors if not a string', () => {
        expect(() => {
          syntax.convertGlobalSheet({
            // @ts-ignore Allow invalid type
            '@keyframes': 123,
          });
        }).toThrowErrorMatchingSnapshot();
      });
    });
  });
});
