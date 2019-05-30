/* eslint-disable jest/expect-expect */

import { createRenderer } from 'fela';
// @ts-ignore
import { renderToString } from 'fela-tools';
import webPreset from 'fela-preset-web';
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
  FONT_CIRCULAR_MULTIPLE,
  SYNTAX_MEDIA_QUERY_NESTED,
  SYNTAX_KEYFRAMES_INLINE,
  SYNTAX_FONT_FACES_INLINE,
  SYNTAX_RAW_CSS,
} from 'aesthetic/lib/testUtils';
import FelaAesthetic from '../src/FelaAesthetic';

describe('FelaAesthetic', () => {
  let instance: FelaAesthetic<any>;

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
    const options = { name: 'fela', rtl: dir === 'rtl' };
    const convertedSheet = global
      ? instance.syntax.convertGlobalSheet(styleSheet, options).toObject()
      : instance.syntax.convertStyleSheet(styleSheet, options).toObject();
    const parsedSheet = instance.parseStyleSheet(convertedSheet, 'fela');

    expect(convertedSheet).toEqual(convertDirection(expectedStyles, dir));

    expect(instance.transformStyles(Object.values(parsedSheet), options)).toBe(expectedClassName);

    expect(cleanStyles(renderToString(instance.fela))).toMatchSnapshot();
  }

  beforeEach(() => {
    instance = new FelaAesthetic(
      createRenderer({
        plugins: [...webPreset],
      }),
    );
  });

  DIRECTIONS.forEach(dir => {
    // eslint-disable-next-line jest/valid-describe
    describe(dir.toUpperCase(), () => {
      it('converts and transforms inline styles', () => {
        expect(
          instance.transformStyles([{ margin: 0 }, { padding: 2 }], { rtl: dir === 'rtl' }),
        ).toBe('a b');
      });

      describe('global sheet', () => {
        it('handles globals', () => {
          renderAndTest(SYNTAX_GLOBAL, {}, '', { dir, global: true });
        });

        it('handles @font-face', () => {
          const spy = jest.spyOn(instance.fela, 'renderFont');

          instance.syntax.convertGlobalSheet(SYNTAX_FONT_FACE, { rtl: dir === 'rtl' });

          expect(spy).toHaveBeenCalledWith('Roboto', FONT_ROBOTO.srcPaths, FONT_ROBOTO_FLAT_SRC);
          expect(spy).toHaveBeenCalledTimes(1);
        });

        it('handles mixed @font-face', () => {
          const spy = jest.spyOn(instance.fela, 'renderFont');

          instance.syntax.convertGlobalSheet(SYNTAX_FONT_FACE_MIXED, { rtl: dir === 'rtl' });

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

          instance.syntax.convertGlobalSheet(SYNTAX_FONT_FACE_MULTIPLE, { rtl: dir === 'rtl' });

          expect(spy).toHaveBeenCalledWith(
            'Circular',
            FONT_CIRCULAR_MULTIPLE[0].srcPaths,
            FONT_CIRCULAR_MULTIPLE_FLAT_SRC[0],
          );
          expect(spy).toHaveBeenCalledTimes(4);
        });

        it('handles @keyframes', () => {
          const spy = jest.spyOn(instance.fela, 'renderKeyframe');

          instance.syntax.convertGlobalSheet(SYNTAX_KEYFRAMES, { rtl: dir === 'rtl' });

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
                textAlign: 'left',
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
            { dir },
          );
        });

        it('handles properties', () => {
          renderAndTest(SYNTAX_PROPERTIES, SYNTAX_PROPERTIES, 'a b c d', { dir });
        });

        it('handles attribute selectors', () => {
          renderAndTest(SYNTAX_ATTRIBUTE, SYNTAX_ATTRIBUTE, 'a b', { dir });
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
            { dir },
          );
        });

        it('handles pseudo selectors', () => {
          renderAndTest(SYNTAX_PSEUDO, SYNTAX_PSEUDO, 'a b c', { dir });
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
            { dir },
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
            { dir },
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
            'a b c',
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
            'a b c d e f',
            { dir },
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
            { dir },
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
