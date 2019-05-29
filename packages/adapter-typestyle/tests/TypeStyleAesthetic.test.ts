/* eslint-disable jest/expect-expect, no-underscore-dangle */

import { TypeStyle } from 'typestyle';
import { Direction } from 'aesthetic';
import {
  cleanStyles,
  convertDirection,
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

  function renderAndTest(
    styleSheet: any,
    expectedStyles: any = {},
    expectedClassName: string = '',
    {
      dir,
      global = false,
    }: {
      dir: Direction;
      global?: boolean;
    },
  ) {
    const options = { dir, name: 'typestyle' };
    const convertedSheet = global
      ? instance.syntax.convertGlobalSheet(styleSheet, options).toObject()
      : instance.syntax.convertStyleSheet(styleSheet, options).toObject();
    // @ts-ignore Allow access
    const styles = instance.processStyleSheet(convertedSheet, 'typestyle');

    expect(convertedSheet).toEqual(convertDirection(expectedStyles, dir));

    expect(instance.transformStyles(Object.values(styles), options)).toBe(expectedClassName);

    // @ts-ignore
    if (instance.typeStyle._raw) {
      // @ts-ignore
      expect(cleanStyles(instance.typeStyle._raw)).toMatchSnapshot();
    } else {
      // @ts-ignore
      expect(cleanStyles(instance.typeStyle._freeStyle.sheet.join(''))).toMatchSnapshot();
    }
  }

  beforeEach(() => {
    instance = new TypeStyleAesthetic(new TypeStyle({ autoGenerateTag: false }));
  });

  DIRECTIONS.forEach(dir => {
    // eslint-disable-next-line jest/valid-describe
    describe(dir.toUpperCase(), () => {
      it('converts and transforms inline styles', () => {
        expect(instance.transformStyles([{ margin: 0 }, { padding: 2 }], { dir })).toBe('f1rvgqmz');
      });

      describe('global sheet', () => {
        it('handles globals', () => {
          renderAndTest(SYNTAX_GLOBAL, {}, '', { dir, global: true });
        });

        it('handles @font-face', () => {
          const spy = jest.spyOn(instance.typeStyle, 'fontFace');

          instance.syntax.convertGlobalSheet(SYNTAX_FONT_FACE, { dir });

          expect(spy).toHaveBeenCalledWith(FONT_ROBOTO_FLAT_SRC);
          expect(spy).toHaveBeenCalledTimes(1);
        });

        it('handles mixed @font-face', () => {
          const spy = jest.spyOn(instance.typeStyle, 'fontFace');

          instance.syntax.convertGlobalSheet(SYNTAX_FONT_FACE_MIXED, { dir });

          expect(spy).toHaveBeenCalledWith(FONT_ROBOTO_FLAT_SRC);
          expect(spy).toHaveBeenCalledWith(FONT_CIRCULAR_MULTIPLE_FLAT_SRC[0]);
          expect(spy).toHaveBeenCalledTimes(5);
        });

        it('handles multiple @font-face', () => {
          const spy = jest.spyOn(instance.typeStyle, 'fontFace');

          instance.syntax.convertGlobalSheet(SYNTAX_FONT_FACE_MULTIPLE, { dir });

          expect(spy).toHaveBeenCalledWith(FONT_CIRCULAR_MULTIPLE_FLAT_SRC[0]);
          expect(spy).toHaveBeenCalledTimes(4);
        });

        it('handles @keyframes', () => {
          const spy = jest.spyOn(instance.typeStyle, 'keyframes');

          instance.syntax.convertGlobalSheet(SYNTAX_KEYFRAMES, { dir });

          expect(spy).toHaveBeenCalledWith(KEYFRAME_FADE);
        });
      });

      describe('style sheet', () => {
        it('converts unified syntax to native syntax and transforms to a class name', () => {
          instance.typeStyle.fontFace(FONT_ROBOTO as any);

          instance.keyframes.fade = instance.typeStyle.keyframes(KEYFRAME_FADE as any);

          renderAndTest(
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
            dir === 'ltr' ? 'f1sm9ltv' : 'fjoi737',
            { dir },
          );
        });

        it('handles properties', () => {
          renderAndTest(
            SYNTAX_PROPERTIES,
            SYNTAX_PROPERTIES,
            dir === 'ltr' ? 'f1tfh618' : 'f1jaotx3',
            { dir },
          );
        });

        it('handles attribute selectors', () => {
          renderAndTest(
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
            'f14zstro',
            { dir },
          );
        });

        it('handles descendant selectors', () => {
          renderAndTest(
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
            'f1qve63s',
            { dir },
          );
        });

        it('handles pseudo selectors', () => {
          renderAndTest(
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
            'fmow1iy',
            { dir },
          );
        });

        it('handles multiple selectors (comma separated)', () => {
          renderAndTest(
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
            'fkkhpct',
            { dir },
          );
        });

        it('handles inline @keyframes', () => {
          if (dir === 'ltr') {
            renderAndTest(
              SYNTAX_KEYFRAMES_INLINE,
              {
                single: {
                  animationName: 'f1pf291g',
                },
                multiple: {
                  animationName: 'f1pf291g, unknown, f1gwuh0p',
                },
              },
              'f1tug0x9',
              { dir },
            );
          } else {
            renderAndTest(
              SYNTAX_KEYFRAMES_INLINE,
              {
                single: {
                  animationName: 'fx4te0v',
                },
                multiple: {
                  animationName: 'fx4te0v, unknown, f1gwuh0p',
                },
              },
              'f1cpoezw',
              { dir },
            );
          }
        });

        it('handles inline @font-face', () => {
          renderAndTest(
            SYNTAX_FONT_FACES_INLINE,
            {
              single: {
                fontFamily: 'Roboto',
              },
              multiple: {
                fontFamily: 'Circular, OtherFont, Roboto',
              },
            },
            'fqopoa',
            { dir },
          );
        });

        it('handles @fallbacks', () => {
          renderAndTest(
            SYNTAX_FALLBACKS,
            {
              fallback: {
                background: ['red', 'linear-gradient(...)'],
                display: ['block', 'inline-block', 'flex'],
                color: ['blue'],
              },
            },
            'f35p7vi',
            { dir },
          );
        });

        it('handles @media', () => {
          renderAndTest(
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
            dir === 'ltr' ? 'f7f3kmp' : 'f8c0g22',
            { dir },
          );
        });

        it('handles nested @media', () => {
          renderAndTest(
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
            'fuxmg1k',
            { dir },
          );
        });

        it('handles @supports', () => {
          renderAndTest(
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
            dir === 'ltr' ? 'f6m6wzj' : 'f7hcf0k',
            { dir },
          );
        });

        it('handles raw CSS', () => {
          renderAndTest(SYNTAX_RAW_CSS, {}, '', { dir });
        });
      });
    });
  });
});
