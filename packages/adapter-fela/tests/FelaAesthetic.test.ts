/* eslint-disable jest/expect-expect */

import { createRenderer } from 'fela';
// @ts-ignore
import { renderToString } from 'fela-tools';
import webPreset from 'fela-preset-web';
import FelaAesthetic from '../src/FelaAesthetic';
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
  FONT_CIRCULAR_MULTIPLE,
  SYNTAX_MEDIA_QUERY_NESTED,
  SYNTAX_KEYFRAMES_INLINE,
  SYNTAX_FONT_FACES_INLINE,
  SYNTAX_RAW_CSS,
} from '../../../tests/mocks';
import { cleanStyles } from '../../../tests/helpers';

describe('FelaAesthetic', () => {
  let instance: FelaAesthetic<any>;

  function renderAndTest(
    styles: any,
    expStyles: any,
    expClassName: string,
    global: boolean = false,
  ) {
    const nativeSheet = global
      ? instance.syntax.convertGlobalSheet(styles).toObject()
      : instance.syntax.convertStyleSheet(styles, 'fela').toObject();
    // @ts-ignore Allow access
    const styleSheet = instance.processStyleSheet(nativeSheet, 'fela');

    expect(nativeSheet).toEqual(expStyles);

    expect(instance.transformStyles(...Object.values(styleSheet))).toBe(expClassName);

    expect(cleanStyles(renderToString(instance.fela))).toMatchSnapshot();
  }

  beforeEach(() => {
    instance = new FelaAesthetic(
      createRenderer({
        plugins: [...webPreset],
      }),
    );
  });

  it('converts and transforms inline styles', () => {
    // @ts-ignore Allow access
    expect(instance.transformToClassName([{ margin: 0 }, { padding: 2 }])).toBe('a b');
  });

  describe('global sheet', () => {
    it('handles globals', () => {
      renderAndTest(SYNTAX_GLOBAL, {}, '', true);
    });

    it('handles @font-face', () => {
      const spy = jest.spyOn(instance.fela, 'renderFont');

      instance.syntax.convertGlobalSheet(SYNTAX_FONT_FACE);

      expect(spy).toHaveBeenCalledWith('Roboto', FONT_ROBOTO.srcPaths, FONT_ROBOTO_FLAT_SRC);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('handles mixed @font-face', () => {
      const spy = jest.spyOn(instance.fela, 'renderFont');

      instance.syntax.convertGlobalSheet(SYNTAX_FONT_FACE_MIXED);

      expect(spy).toHaveBeenCalledWith('Roboto', FONT_ROBOTO.srcPaths, FONT_ROBOTO_FLAT_SRC);
      expect(spy).toHaveBeenCalledWith(
        'Circular',
        FONT_CIRCULAR_MULTIPLE[0].srcPaths,
        FONT_CIRCULAR_MULTIPLE_FLAT_SRC[0],
      );
      expect(spy).toHaveBeenCalledTimes(5);
    });

    it('handles multiple @font-face', () => {
      const spy = jest.spyOn(instance.fela, 'renderFont');

      instance.syntax.convertGlobalSheet(SYNTAX_FONT_FACE_MULTIPLE);

      expect(spy).toHaveBeenCalledWith(
        'Circular',
        FONT_CIRCULAR_MULTIPLE[0].srcPaths,
        FONT_CIRCULAR_MULTIPLE_FLAT_SRC[0],
      );
      expect(spy).toHaveBeenCalledTimes(4);
    });

    it('handles @keyframes', () => {
      const spy = jest.spyOn(instance.fela, 'renderKeyframe');

      instance.syntax.convertGlobalSheet(SYNTAX_KEYFRAMES);

      expect(spy).toHaveBeenCalledWith(expect.anything(), {});
    });
  });

  describe('style sheet', () => {
    it('converts unified syntax to native syntax and transforms to a class name', () => {
      instance.fela.renderFont('Roboto', FONT_ROBOTO.srcPaths, FONT_ROBOTO);

      instance.keyframes.fade = instance.fela.renderKeyframe(() => KEYFRAME_FADE as any, {});

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
            animationName: 'k1',
            animationDuration: '.3s',
            ':hover': {
              backgroundColor: '#286090',
              borderColor: '#204d74',
            },
            '::before': {
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
        'a b c d e f g h i j k l m n o p q r s t u v w x',
      );
    });

    it('handles properties', () => {
      renderAndTest(SYNTAX_PROPERTIES, SYNTAX_PROPERTIES, 'a b c');
    });

    it('handles attribute selectors', () => {
      renderAndTest(SYNTAX_ATTRIBUTE, SYNTAX_ATTRIBUTE, 'a b');
    });

    it('handles descendant selectors', () => {
      renderAndTest(
        SYNTAX_DESCENDANT,
        {
          list: {
            margin: 0,
            padding: 0,
            '> li': {
              listStyle: 'bullet',
            },
          },
        },
        'a b c',
      );
    });

    it('handles pseudo selectors', () => {
      renderAndTest(SYNTAX_PSEUDO, SYNTAX_PSEUDO, 'a b c');
    });

    it('handles multiple selectors (comma separated)', () => {
      renderAndTest(
        SYNTAX_MULTI_SELECTOR,
        {
          multi: {
            cursor: 'pointer',
            ':disabled': { cursor: 'default' },
            '[disabled]': { cursor: 'default' },
            '> span': { cursor: 'default' },
          },
        },
        'a b c d',
      );
    });

    it('handles inline @keyframes', () => {
      renderAndTest(
        SYNTAX_KEYFRAMES_INLINE,
        {
          single: {
            animationName: 'k1',
          },
          multiple: {
            animationName: 'k1, unknown, k2',
          },
        },
        'a',
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
        'a',
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
        'a b c',
      );
    });

    it('handles @media', () => {
      renderAndTest(
        SYNTAX_MEDIA_QUERY,
        {
          media: {
            color: 'red',
            '@media (max-width: 1000px)': {
              color: 'green',
            },
            '@media (min-width: 300px)': {
              color: 'blue',
            },
          },
        },
        'a b c',
      );
    });

    it('handles nested @media', () => {
      renderAndTest(
        SYNTAX_MEDIA_QUERY_NESTED,
        {
          media: {
            color: 'red',
            '@media (min-width: 300px)': {
              color: 'blue',
              '@media (max-width: 1000px)': {
                color: 'green',
              },
            },
          },
        },
        'a b c',
      );
    });

    it('handles @supports', () => {
      renderAndTest(
        SYNTAX_SUPPORTS,
        {
          sup: {
            display: 'block',
            '@supports (display: flex)': {
              display: 'flex',
            },
            '@supports not (display: flex)': {
              float: 'left',
            },
          },
        },
        'a b c',
      );
    });

    it('handles raw CSS', () => {
      renderAndTest(
        SYNTAX_RAW_CSS,
        {
          button: 'fela-button',
        },
        'fela-button',
      );
    });
  });
});
