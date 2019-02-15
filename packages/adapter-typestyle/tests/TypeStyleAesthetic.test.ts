/* eslint-disable jest/expect-expect, no-underscore-dangle */

import { TypeStyle } from 'typestyle';
import TypeStyleAesthetic from '../src/TypeStyleAesthetic';
import {
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
} from '../../../tests/mocks';
import { cleanStyles } from '../../../tests/helpers';

describe('TypeStyleAesthetic', () => {
  let instance: TypeStyleAesthetic<any>;

  function renderAndTest(
    styles: any,
    expStyles: any,
    expClassName: string,
    global: boolean = false,
  ) {
    const nativeSheet = global
      ? instance.syntax.convertGlobalSheet(styles).toObject()
      : instance.syntax.convertStyleSheet(styles).toObject();
    // @ts-ignore Allow access
    const styleSheet = instance.processStyleSheet(nativeSheet, 'fela');

    expect(nativeSheet).toEqual(expStyles);

    expect(instance.transformStyles(...Object.values(styleSheet))).toBe(expClassName);

    // @ts-ignore
    expect(cleanStyles(instance.typeStyle._freeStyle.sheet.join(''))).toMatchSnapshot();
  }

  beforeEach(() => {
    instance = new TypeStyleAesthetic(new TypeStyle({ autoGenerateTag: false }));
  });

  it('converts and transforms inline styles', () => {
    // @ts-ignore Allow access
    expect(instance.transformToClassName([{ margin: 0 }, { padding: 2 }])).toBe('f1rvgqmz');
  });

  describe('global sheet', () => {
    it('handles globals', () => {
      renderAndTest(SYNTAX_GLOBAL, {}, '', true);
    });

    it('handles @font-face', () => {
      const spy = jest.spyOn(instance.typeStyle, 'fontFace');

      instance.syntax.convertGlobalSheet(SYNTAX_FONT_FACE);

      expect(spy).toHaveBeenCalledWith(FONT_ROBOTO_FLAT_SRC);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('handles mixed @font-face', () => {
      const spy = jest.spyOn(instance.typeStyle, 'fontFace');

      instance.syntax.convertGlobalSheet(SYNTAX_FONT_FACE_MIXED);

      expect(spy).toHaveBeenCalledWith(FONT_ROBOTO_FLAT_SRC);
      expect(spy).toHaveBeenCalledWith(FONT_CIRCULAR_MULTIPLE_FLAT_SRC[0]);
      expect(spy).toHaveBeenCalledTimes(5);
    });

    it('handles multiple @font-face', () => {
      const spy = jest.spyOn(instance.typeStyle, 'fontFace');

      instance.syntax.convertGlobalSheet(SYNTAX_FONT_FACE_MULTIPLE);

      expect(spy).toHaveBeenCalledWith(FONT_CIRCULAR_MULTIPLE_FLAT_SRC[0]);
      expect(spy).toHaveBeenCalledTimes(4);
    });

    it('handles @keyframes', () => {
      const spy = jest.spyOn(instance.typeStyle, 'keyframes');

      instance.syntax.convertGlobalSheet(SYNTAX_KEYFRAMES);

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
            textAlign: 'center',
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
        'fkp30lv',
      );
    });

    it('handles properties', () => {
      renderAndTest(SYNTAX_PROPERTIES, SYNTAX_PROPERTIES, 'f1tzsa69');
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
      );
    });

    it('handles inline @keyframes', () => {
      renderAndTest(
        SYNTAX_KEYFRAMES_INLINE,
        {
          single: {
            animationName: 'f1croar1',
          },
          multiple: {
            animationName: 'f1croar1, unknown, f1gwuh0p',
          },
        },
        'f1dmlnkq',
      );
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
      );
    });

    it('handles @media', () => {
      renderAndTest(
        SYNTAX_MEDIA_QUERY,
        {
          media: {
            color: 'red',
            $nest: {
              '@media (max-width: 1000px)': {
                color: 'green',
              },
              '@media (min-width: 300px)': {
                color: 'blue',
              },
            },
          },
        },
        'fuxmg1k',
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
        'f6m6wzj',
      );
    });
  });
});
