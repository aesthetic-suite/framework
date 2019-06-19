/* eslint-disable jest/expect-expect */

import { create } from 'jss';
// @ts-ignore
import preset from 'jss-preset-default';
import {
  cleanupStyleElements,
  getFlushedStyles,
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

  beforeEach(() => {
    const jss = create();
    jss.setup(preset());

    instance = new JSSAesthetic(jss);
  });

  afterEach(() => {
    cleanupStyleElements();
  });

  DIRECTIONS.forEach(dir => {
    // eslint-disable-next-line jest/valid-describe
    describe(dir.toUpperCase(), () => {
      it('converts and transforms inline styles', () => {
        expect(instance.transformStyles(['foo', { margin: 0 }, { padding: 2 }], { dir })).toBe(
          dir === 'ltr'
            ? 'foo inline-0-0-1-1 inline-1-0-1-2'
            : 'foo inline-0-0-25-1 inline-1-0-25-2',
        );
        expect(getFlushedStyles()).toMatchSnapshot();

        // @ts-ignore Allow null
        expect(instance.transformStyles(['foo', null], { dir })).toBe('foo');
        expect(getFlushedStyles()).toMatchSnapshot();
      });

      it('flushes and purges styles from the DOM', () => {
        const styles = { test: { display: 'block' } };

        renderAndExpect(instance, styles, styles, { dir });

        instance.purgeStyles();

        expect(getFlushedStyles()).toMatchSnapshot();
      });

      describe('global sheet', () => {
        it('handles globals', () => {
          renderAndExpect(
            instance,
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
          renderAndExpect(
            instance,
            SYNTAX_FONT_FACE,
            {
              '@font-face': [FONT_ROBOTO_FLAT_SRC],
            },
            { dir, global: true },
          );
        });

        it('handles mixed @font-face', () => {
          renderAndExpect(
            instance,
            SYNTAX_FONT_FACE_MIXED,
            {
              '@font-face': [FONT_ROBOTO_FLAT_SRC, ...FONT_CIRCULAR_MULTIPLE_FLAT_SRC],
            },
            { dir, global: true },
          );
        });

        it('handles multiple @font-face', () => {
          renderAndExpect(
            instance,
            SYNTAX_FONT_FACE_MULTIPLE,
            {
              '@font-face': FONT_CIRCULAR_MULTIPLE_FLAT_SRC,
            },
            { dir, global: true },
          );
        });

        it('handles @keyframes', () => {
          renderAndExpect(
            instance,
            SYNTAX_KEYFRAMES,
            {
              '@keyframes fade-0': KEYFRAME_FADE,
            },
            { dir, global: true },
          );
        });

        it('handles @viewport', () => {
          renderAndExpect(
            instance,
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
          renderAndExpect(
            instance,
            SYNTAX_CHARSET,
            {
              '@charset': '"utf8"',
            },
            { dir, global: true },
          );
        });

        it('handles single @import', () => {
          renderAndExpect(
            instance,
            SYNTAX_IMPORT,
            {
              '@import': ['url("./some/path.css")'],
            },
            { dir, global: true },
          );
        });

        it('handles multiple @import', () => {
          renderAndExpect(
            instance,
            SYNTAX_IMPORT_MULTIPLE,
            {
              '@import': ['url("./some/path.css")', 'url("./another/path.css")'],
            },
            { dir, global: true },
          );
        });
      });

      describe('style sheet', () => {
        it('converts unified syntax to native syntax and transforms to a class name', () => {
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
          renderAndExpect(instance, SYNTAX_PROPERTIES, SYNTAX_PROPERTIES, { dir });
        });

        it('handles attribute selectors', () => {
          renderAndExpect(
            instance,
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
          renderAndExpect(
            instance,
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
          renderAndExpect(
            instance,
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
          renderAndExpect(
            instance,
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
          renderAndExpect(
            instance,
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
          renderAndExpect(
            instance,
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
          renderAndExpect(
            instance,
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
          renderAndExpect(
            instance,
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
          renderAndExpect(
            instance,
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
          renderAndExpect(
            instance,
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
          renderAndExpect(instance, SYNTAX_RAW_CSS, {}, { dir });
        });
      });
    });
  });
});
