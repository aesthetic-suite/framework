/* eslint-disable jest/expect-expect */

import { StyleSheetTestUtils } from 'aphrodite';
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
  SYNTAX_FONT_FACE,
  SYNTAX_FONT_FACE_MIXED,
  SYNTAX_FONT_FACE_MULTIPLE,
  SYNTAX_GLOBAL,
  SYNTAX_KEYFRAMES,
  SYNTAX_MEDIA_QUERY,
  SYNTAX_MULTI_SELECTOR,
  SYNTAX_PROPERTIES,
  SYNTAX_PSEUDO,
  SYNTAX_MEDIA_QUERY_NESTED,
  SYNTAX_KEYFRAMES_INLINE,
  KEYFRAME_SLIDE_PERCENT,
  SYNTAX_FONT_FACES_INLINE,
  SYNTAX_RAW_CSS,
} from 'aesthetic/lib/testUtils';
import AphroditeAesthetic from '../src/AphroditeAesthetic';

describe('AphroditeAesthetic', () => {
  let instance: AphroditeAesthetic<any>;

  function renderAndTest(
    styleSheet: any,
    expectedStyles: any = {},
    expectedClassName: string = '',
    {
      dir,
      global = false,
      raw = false,
    }: {
      dir: Direction;
      global?: boolean;
      raw?: boolean;
    },
  ) {
    const options = { dir, name: 'aphrodite' };
    const convertedSheet = global
      ? instance.syntax.convertGlobalSheet(styleSheet, options).toObject()
      : instance.syntax.convertStyleSheet(styleSheet, options).toObject();
    // @ts-ignore Allow access
    const styles = instance.processStyleSheet(convertedSheet, 'aphrodite');

    expect(convertedSheet).toEqual(convertDirection(expectedStyles, dir));

    expect(instance.transformStyles(Object.values(styles), options)).toBe(expectedClassName);

    if (raw) {
      // @ts-ignore
      expect(cleanStyles(instance.getStyleSheetManager().getInjectedStyles())).toMatchSnapshot();
    } else {
      expect(cleanStyles(StyleSheetTestUtils.getBufferedStyles().join(''))).toMatchSnapshot();
    }
  }

  beforeEach(() => {
    StyleSheetTestUtils.suppressStyleInjection();
    instance = new AphroditeAesthetic();
  });

  afterEach(() => {
    StyleSheetTestUtils.clearBufferAndResumeStyleInjection();
  });

  DIRECTIONS.forEach(dir => {
    describe(dir, () => {
      it('converts and transforms inline styles', () => {
        expect(instance.transformStyles([{ margin: 0 }, { padding: 2 }], { dir })).toBe(
          'inline-0_16pg94n-o_O-inline-1_igcoje',
        );
      });

      describe('global sheet', () => {
        it('handles globals', () => {
          renderAndTest(
            SYNTAX_GLOBAL,
            {
              globals: {
                '*body': { margin: 0 },
                '*html': { height: '100%' },
                '*a': {
                  color: 'red',
                  ':hover': {
                    color: 'darkred',
                  },
                },
              },
            },
            'globals_vyedjg',
            { dir, global: true },
          );
        });

        it('handles @font-face', () => {
          instance.syntax.convertGlobalSheet(SYNTAX_FONT_FACE, { dir });

          expect(instance.fontFaces).toEqual({
            Roboto: [FONT_ROBOTO_FLAT_SRC],
          });
        });

        it('handles mixed @font-face', () => {
          instance.syntax.convertGlobalSheet(SYNTAX_FONT_FACE_MIXED, { dir });

          expect(instance.fontFaces).toEqual({
            Roboto: [FONT_ROBOTO_FLAT_SRC],
            Circular: FONT_CIRCULAR_MULTIPLE_FLAT_SRC,
          });
        });

        it('handles multiple @font-face', () => {
          instance.syntax.convertGlobalSheet(SYNTAX_FONT_FACE_MULTIPLE, { dir });

          expect(instance.fontFaces).toEqual({
            Circular: FONT_CIRCULAR_MULTIPLE_FLAT_SRC,
          });
        });

        it('handles @keyframes', () => {
          instance.syntax.convertGlobalSheet(SYNTAX_KEYFRAMES, { dir });

          expect(instance.keyframes).toEqual({
            fade: KEYFRAME_FADE,
          });
        });
      });

      describe('style sheet', () => {
        it('converts unified syntax to native syntax and transforms to a class name', () => {
          instance.fontFaces.Roboto = [FONT_ROBOTO_FLAT_SRC as any];
          instance.keyframes.fade = KEYFRAME_FADE;

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
                fontFamily: [FONT_ROBOTO_FLAT_SRC],
                fontWeight: 'normal',
                lineHeight: 'normal',
                whiteSpace: 'nowrap',
                textDecoration: 'none',
                textAlign: 'left',
                backgroundColor: '#337ab7',
                verticalAlign: 'middle',
                color: 'rgba(0, 0, 0, 0)',
                animationName: [KEYFRAME_FADE],
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
            dir === 'ltr' ? 'button_1dmte4q' : 'button_pvvr1m',
            { dir },
          );
        });

        it('handles properties', () => {
          renderAndTest(
            SYNTAX_PROPERTIES,
            SYNTAX_PROPERTIES,
            dir === 'ltr' ? 'props_n2jmqg' : 'props_1k579qb',
            { dir },
          );
        });

        it('handles attribute selectors', () => {
          renderAndTest(SYNTAX_ATTRIBUTE, SYNTAX_ATTRIBUTE, 'attr_424cv8', { dir });
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
            'list_1lo5lhe',
            { dir },
          );
        });

        it('handles pseudo selectors', () => {
          renderAndTest(
            SYNTAX_PSEUDO,
            SYNTAX_PSEUDO,
            dir === 'ltr' ? 'pseudo_q2zd6k' : 'pseudo_q2zd6k',
            { dir },
          );
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
            'multi_1xnvdcd',
            { dir },
          );
        });

        it('handles inline @keyframes', () => {
          renderAndTest(
            SYNTAX_KEYFRAMES_INLINE,
            {
              single: {
                animationName: [KEYFRAME_SLIDE_PERCENT],
              },
              multiple: {
                animationName: [KEYFRAME_SLIDE_PERCENT, 'unknown', KEYFRAME_FADE],
              },
            },
            dir === 'ltr'
              ? 'single_zl2yc5-o_O-multiple_1r8o3nf'
              : 'single_7ive5q-o_O-multiple_ysjk3k',
            { dir },
          );
        });

        it('handles inline @font-face', () => {
          renderAndTest(
            SYNTAX_FONT_FACES_INLINE,
            {
              single: {
                fontFamily: [FONT_ROBOTO_FLAT_SRC],
              },
              multiple: {
                fontFamily: [...FONT_CIRCULAR_MULTIPLE_FLAT_SRC, 'OtherFont', FONT_ROBOTO_FLAT_SRC],
              },
            },
            'single_vfwy7z-o_O-multiple_17z04zp',
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
            dir === 'ltr' ? 'media_1jcccqt' : 'media_1xdaj1a',
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
            'media_y3eou6',
            { dir },
          );
        });

        it('handles raw CSS', () => {
          renderAndTest(SYNTAX_RAW_CSS, {}, '', { dir, raw: true });
        });
      });
    });
  });
});
