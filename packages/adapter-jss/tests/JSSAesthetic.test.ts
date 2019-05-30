/* eslint-disable jest/expect-expect */

import { create } from 'jss';
// @ts-ignore
import preset from 'jss-preset-default';
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
  SYNTAX_VIEWPORT,
  SYNTAX_CHARSET,
  SYNTAX_IMPORT,
  SYNTAX_IMPORT_MULTIPLE,
  SYNTAX_MEDIA_QUERY_NESTED,
  SYNTAX_KEYFRAMES_INLINE,
  KEYFRAME_SLIDE_PERCENT,
  SYNTAX_FONT_FACES_INLINE,
  SYNTAX_RAW_CSS,
} from 'aesthetic/lib/testUtils';
import JSSAesthetic from '../src/JSSAesthetic';

jest.mock('uuid/v4', () => () => 'uuid');

describe('JSSAesthetic', () => {
  let instance: JSSAesthetic<any>;

  function testSnapshot(raw: boolean = false) {
    if (raw) {
      // @ts-ignore
      expect(cleanStyles(instance.getStyleSheetManager().getInjectedStyles())).toMatchSnapshot();

      return;
    }

    let snapshot = '';

    Object.keys(instance.sheets).forEach(name => {
      snapshot += instance.sheets[name].toString();
    });

    expect(cleanStyles(snapshot)).toMatchSnapshot();
  }

  function renderAndTest(
    styleSheet: any,
    expectedStyles: any = {},
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
    const options = { name: 'jss', rtl: dir === 'rtl' };
    const convertedSheet = global
      ? instance.syntax.convertGlobalSheet(styleSheet, options).toObject()
      : instance.syntax.convertStyleSheet(styleSheet, options).toObject();
    // @ts-ignore Allow access
    const styles = instance.processStyleSheet(convertedSheet, 'jss');

    expect(convertedSheet).toEqual(convertDirection(expectedStyles, dir));

    expect(instance.transformStyles(Object.values(styles), options)).toMatchSnapshot();

    testSnapshot(raw);
  }

  beforeEach(() => {
    const jss = create();
    jss.setup(preset());

    instance = new JSSAesthetic(jss);
  });

  DIRECTIONS.forEach(dir => {
    // eslint-disable-next-line jest/valid-describe
    describe(dir.toUpperCase(), () => {
      it('converts and transforms inline styles', () => {
        expect(
          instance.transformStyles(['foo', { margin: 0 }, { padding: 2 }], { rtl: dir === 'rtl' }),
        ).toBe(
          dir === 'ltr'
            ? 'foo inline-0-0-1-1 inline-1-0-1-2'
            : 'foo inline-0-0-24-1 inline-1-0-24-2',
        );
        testSnapshot();

        // @ts-ignore Allow null
        expect(instance.transformStyles(['foo', null], { dir })).toBe('foo');
        testSnapshot();
      });

      describe('global sheet', () => {
        it('handles globals', () => {
          renderAndTest(
            SYNTAX_GLOBAL,
            {
              '@global': {
                body: { margin: 0 },
                html: { height: '100%' },
                a: {
                  color: 'red',
                  '&:hover': {
                    color: 'darkred',
                  },
                },
              },
            },
            { dir, global: true },
          );
        });

        it('handles @font-face', () => {
          renderAndTest(
            SYNTAX_FONT_FACE,
            {
              '@font-face': [FONT_ROBOTO_FLAT_SRC],
            },
            { dir, global: true },
          );
        });

        it('handles mixed @font-face', () => {
          renderAndTest(
            SYNTAX_FONT_FACE_MIXED,
            {
              '@font-face': [FONT_ROBOTO_FLAT_SRC, ...FONT_CIRCULAR_MULTIPLE_FLAT_SRC],
            },
            { dir, global: true },
          );
        });

        it('handles multiple @font-face', () => {
          renderAndTest(
            SYNTAX_FONT_FACE_MULTIPLE,
            {
              '@font-face': FONT_CIRCULAR_MULTIPLE_FLAT_SRC,
            },
            { dir, global: true },
          );
        });

        it('handles @keyframes', () => {
          renderAndTest(
            SYNTAX_KEYFRAMES,
            {
              '@keyframes fade-0': KEYFRAME_FADE,
            },
            { dir, global: true },
          );
        });

        it('handles @viewport', () => {
          renderAndTest(
            SYNTAX_VIEWPORT,
            {
              '@viewport': {
                width: 'device-width',
                orientation: 'landscape',
              },
            },
            { dir, global: true },
          );
        });

        it('handles @charset', () => {
          renderAndTest(
            SYNTAX_CHARSET,
            {
              '@charset': 'utf8',
            },
            { dir, global: true },
          );
        });

        it('handles single @import', () => {
          renderAndTest(
            SYNTAX_IMPORT,
            {
              '@import': ['./some/path.css'],
            },
            { dir, global: true },
          );
        });

        it('handles multiple @import', () => {
          renderAndTest(
            SYNTAX_IMPORT_MULTIPLE,
            {
              '@import': ['./some/path.css', './another/path.css'],
            },
            { dir, global: true },
          );
        });
      });

      describe('style sheet', () => {
        it('converts unified syntax to native syntax and transforms to a class name', () => {
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
                animationName: 'fade',
                animationDuration: '.3s',
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
            { dir },
          );
        });

        it('handles properties', () => {
          renderAndTest(SYNTAX_PROPERTIES, SYNTAX_PROPERTIES, { dir });
        });

        it('handles attribute selectors', () => {
          renderAndTest(
            SYNTAX_ATTRIBUTE,
            {
              attr: {
                display: 'block',
                '&[disabled]': {
                  opacity: 0.5,
                },
              },
            },
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
                '&> li': {
                  listStyle: 'bullet',
                },
              },
            },
            { dir },
          );
        });

        it('handles pseudo selectors', () => {
          renderAndTest(
            SYNTAX_PSEUDO,
            {
              pseudo: {
                position: 'fixed',
                '&:hover': {
                  position: 'static',
                },
                '&::before': {
                  position: 'absolute',
                },
              },
            },
            { dir },
          );
        });

        it('handles multiple selectors (comma separated)', () => {
          renderAndTest(
            SYNTAX_MULTI_SELECTOR,
            {
              multi: {
                cursor: 'pointer',
                '&:disabled': { cursor: 'default' },
                '&[disabled]': { cursor: 'default' },
                '&> span': { cursor: 'default' },
              },
            },
            { dir },
          );
        });

        it('handles inline @keyframes', () => {
          renderAndTest(
            SYNTAX_KEYFRAMES_INLINE,
            {
              '@keyframes slide-0': KEYFRAME_SLIDE_PERCENT,
              '@keyframes keyframe-1-1': KEYFRAME_FADE,
              single: {
                animationName: 'slide-0',
              },
              multiple: {
                animationName: 'slide-0, unknown, keyframe-1-1',
              },
            },
            { dir },
          );
        });

        it('handles inline @font-face', () => {
          renderAndTest(
            SYNTAX_FONT_FACES_INLINE,
            {
              '@font-face': [
                FONT_ROBOTO_FLAT_SRC,
                ...FONT_CIRCULAR_MULTIPLE_FLAT_SRC,
                FONT_ROBOTO_FLAT_SRC,
              ],
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
          renderAndTest(
            SYNTAX_FALLBACKS,
            {
              fallback: {
                background: 'linear-gradient(...)',
                display: 'flex',
                fallbacks: [
                  { background: 'red' },
                  { display: 'block' },
                  { display: 'inline-block' },
                  { color: 'blue' },
                ],
              },
            },
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
            { dir },
          );
        });

        it('handles raw CSS', () => {
          renderAndTest(SYNTAX_RAW_CSS, {}, { dir, raw: true });
        });
      });
    });
  });
});
