/* eslint-disable jest/expect-expect, no-underscore-dangle */

import { TypeStyle } from 'typestyle';
import {
  cleanupStyleElements,
  renderAndExpect,
  DIRECTIONS,
  FONT_ROBOTO_FLAT_SRC,
  FONT_CIRCULAR_MULTIPLE_FLAT_SRC,
  KEYFRAME_FADE,
  SYNTAX_UNIFIED_LOCAL_FULL,
  SYNTAX_ATTRIBUTE,
  SYNTAX_DESCENDANT,
  SYNTAX_FALLBACKS,
  SYNTAX_FONT_FACE,
  SYNTAX_FONT_FACE_MIXED,
  SYNTAX_FONT_FACE_MULTIPLE,
  SYNTAX_GLOBAL,
  SYNTAX_KEYFRAMES,
  SYNTAX_MEDIA_QUERY,
  SYNTAX_MULTI_SELECTOR,
  SYNTAX_PROPERTIES,
  SYNTAX_PSEUDO,
  SYNTAX_SUPPORTS,
  FONT_ROBOTO,
  SYNTAX_MEDIA_QUERY_NESTED,
  SYNTAX_KEYFRAMES_INLINE,
  SYNTAX_FONT_FACES_INLINE,
  SYNTAX_RAW_CSS,
} from 'aesthetic/lib/testUtils';
import TypeStyleAesthetic from '../src/TypeStyleAesthetic';

describe('TypeStyleAesthetic', () => {
  let instance: TypeStyleAesthetic<any>;

  beforeEach(() => {
    instance = new TypeStyleAesthetic(new TypeStyle({ autoGenerateTag: true }));
  });

  afterEach(() => {
    cleanupStyleElements();
  });

  DIRECTIONS.forEach(dir => {
    // eslint-disable-next-line jest/valid-describe
    describe(dir.toUpperCase(), () => {
      it('converts and transforms inline styles', () => {
        expect(
          instance.transformStyles([{ margin: 0 }, { padding: 2 }], { rtl: dir === 'rtl' }),
        ).toBe('f1rvgqmz');
      });

      describe('global sheet', () => {
        it('handles globals', () => {
          renderAndExpect(instance, SYNTAX_GLOBAL, {}, { dir, global: true });
        });

        it('handles @font-face', () => {
          const spy = jest.spyOn(instance.typeStyle, 'fontFace');

          instance.syntax.convertGlobalSheet(SYNTAX_FONT_FACE, { rtl: dir === 'rtl' });

          expect(spy).toHaveBeenCalledWith(FONT_ROBOTO_FLAT_SRC);
          expect(spy).toHaveBeenCalledTimes(1);
        });

        it('handles mixed @font-face', () => {
          const spy = jest.spyOn(instance.typeStyle, 'fontFace');

          instance.syntax.convertGlobalSheet(SYNTAX_FONT_FACE_MIXED, { rtl: dir === 'rtl' });

          expect(spy).toHaveBeenCalledWith(FONT_ROBOTO_FLAT_SRC);
          expect(spy).toHaveBeenCalledWith(FONT_CIRCULAR_MULTIPLE_FLAT_SRC[0]);
          expect(spy).toHaveBeenCalledTimes(5);
        });

        it('handles multiple @font-face', () => {
          const spy = jest.spyOn(instance.typeStyle, 'fontFace');

          instance.syntax.convertGlobalSheet(SYNTAX_FONT_FACE_MULTIPLE, { rtl: dir === 'rtl' });

          expect(spy).toHaveBeenCalledWith(FONT_CIRCULAR_MULTIPLE_FLAT_SRC[0]);
          expect(spy).toHaveBeenCalledTimes(4);
        });

        it('handles @keyframes', () => {
          const spy = jest.spyOn(instance.typeStyle, 'keyframes');

          instance.syntax.convertGlobalSheet(SYNTAX_KEYFRAMES, { rtl: dir === 'rtl' });

          expect(spy).toHaveBeenCalledWith(KEYFRAME_FADE);
        });
      });

      describe('style sheet', () => {
        it('converts unified syntax to native syntax and transforms to a class name', () => {
          instance.typeStyle.fontFace(FONT_ROBOTO as any);

          instance.keyframes.fade = instance.typeStyle.keyframes(KEYFRAME_FADE as any);

          renderAndExpect(
            instance,
            SYNTAX_UNIFIED_LOCAL_FULL,
            {
              button: {
                margin: 0,
                padding: '6px 12px',
                border: '1px solid #2e6da4',
                borderRadius: 4,
                display: 'inline-block',
                cursor: 'pointer',
                fontFamily: 'Roboto',
                fontWeight: 'normal',
                lineHeight: 'normal',
                whiteSpace: 'nowrap',
                textDecoration: 'none',
                textAlign: 'left',
                backgroundColor: '#337ab7',
                verticalAlign: 'middle',
                color: 'rgba(0, 0, 0, 0)',
                animationName: 'f1gwuh0p',
                animationDuration: '.3s',
                $nest: {
                  '&:hover': {
                    backgroundColor: '#286090',
                    borderColor: '#204d74',
                  },
                  '&::before': {
                    content: '"★"',
                    display: 'inline-block',
                    verticalAlign: 'middle',
                    marginRight: 5,
                  },
                  '@media (max-width: 600px)': {
                    padding: '4px 8px',
                  },
                },
              },
            },
            { dir },
          );
        });

        it('handles properties', () => {
          renderAndExpect(instance, SYNTAX_PROPERTIES, SYNTAX_PROPERTIES, { dir });
        });

        it('handles attribute selectors', () => {
          renderAndExpect(
            instance,
            SYNTAX_ATTRIBUTE,
            {
              attr: {
                display: 'block',
                $nest: {
                  '&[disabled]': {
                    opacity: 0.5,
                  },
                },
              },
            },
            { dir },
          );
        });

        it('handles descendant selectors', () => {
          renderAndExpect(
            instance,
            SYNTAX_DESCENDANT,
            {
              list: {
                margin: 0,
                padding: 0,
                $nest: {
                  '&> li': {
                    listStyle: 'bullet',
                  },
                },
              },
            },
            { dir },
          );
        });

        it('handles pseudo selectors', () => {
          renderAndExpect(
            instance,
            SYNTAX_PSEUDO,
            {
              pseudo: {
                position: 'fixed',
                $nest: {
                  '&:hover': {
                    position: 'static',
                  },
                  '&::before': {
                    position: 'absolute',
                  },
                },
              },
            },
            { dir },
          );
        });

        it('handles multiple selectors (comma separated)', () => {
          renderAndExpect(
            instance,
            SYNTAX_MULTI_SELECTOR,
            {
              multi: {
                cursor: 'pointer',
                $nest: {
                  '&:disabled': { cursor: 'default' },
                  '&[disabled]': { cursor: 'default' },
                  '&> span': { cursor: 'default' },
                },
              },
            },
            { dir },
          );
        });

        it('handles inline @keyframes', () => {
          renderAndExpect(
            instance,
            SYNTAX_KEYFRAMES_INLINE,
            dir === 'ltr'
              ? {
                  single: {
                    animationName: 'f1pf291g',
                  },
                  multiple: {
                    animationName: 'f1pf291g, unknown, f1gwuh0p',
                  },
                }
              : {
                  single: {
                    animationName: 'fx4te0v',
                  },
                  multiple: {
                    animationName: 'fx4te0v, unknown, f1gwuh0p',
                  },
                },
            { dir },
          );
        });

        it('handles inline @font-face', () => {
          renderAndExpect(
            instance,
            SYNTAX_FONT_FACES_INLINE,
            {
              single: {
                fontFamily: 'Roboto',
              },
              multiple: {
                fontFamily: 'Circular, OtherFont, Roboto',
              },
            },
            { dir },
          );
        });

        it('handles @fallbacks', () => {
          renderAndExpect(
            instance,
            SYNTAX_FALLBACKS,
            {
              fallback: {
                background: ['red', 'linear-gradient(...)'],
                display: ['block', 'inline-block', 'flex'],
                color: ['blue'],
              },
            },
            { dir },
          );
        });

        it('handles @media', () => {
          renderAndExpect(
            instance,
            SYNTAX_MEDIA_QUERY,
            {
              media: {
                color: 'red',
                paddingLeft: 10,
                $nest: {
                  '@media (max-width: 1000px)': {
                    color: 'green',
                    paddingLeft: 20,
                  },
                  '@media (min-width: 300px)': {
                    color: 'blue',
                    paddingLeft: 15,
                  },
                },
              },
            },
            { dir },
          );
        });

        it('handles nested @media', () => {
          renderAndExpect(
            instance,
            SYNTAX_MEDIA_QUERY_NESTED,
            {
              media: {
                color: 'red',
                $nest: {
                  '@media (min-width: 300px)': {
                    color: 'blue',
                    $nest: {
                      '@media (max-width: 1000px)': {
                        color: 'green',
                      },
                    },
                  },
                },
              },
            },
            { dir },
          );
        });

        it('handles @supports', () => {
          renderAndExpect(
            instance,
            SYNTAX_SUPPORTS,
            {
              sup: {
                display: 'block',
                $nest: {
                  '@supports (display: flex)': {
                    display: 'flex',
                  },
                  '@supports not (display: flex)': {
                    float: 'left',
                  },
                },
              },
            },
            { dir },
          );
        });

        it('handles raw CSS', () => {
          renderAndExpect(instance, SYNTAX_RAW_CSS, {}, { dir });
        });
      });
    });
  });
});
