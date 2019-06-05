/* eslint-disable jest/expect-expect */

import { StyleSheetTestUtils } from 'aphrodite';
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

  beforeEach(() => {
    StyleSheetTestUtils.suppressStyleInjection();
    instance = new AphroditeAesthetic();
  });

  afterEach(() => {
    StyleSheetTestUtils.clearBufferAndResumeStyleInjection();
    cleanupStyleElements();
  });

  DIRECTIONS.forEach(dir => {
    // eslint-disable-next-line jest/valid-describe
    describe(dir.toUpperCase(), () => {
      it('converts and transforms inline styles', () => {
        expect(
          instance.transformStyles([{ margin: 0 }, { padding: 2 }], { rtl: dir === 'rtl' }),
        ).toBe('inline-0_16pg94n-o_O-inline-1_igcoje');
      });

      it('flushes and purges styles from the DOM', () => {});

      describe('global sheet', () => {
        it('handles globals', () => {
          renderAndExpect(
            instance,
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
            { dir, global: true },
          );
        });

        it('handles @font-face', () => {
          instance.syntax.convertGlobalSheet(SYNTAX_FONT_FACE, { rtl: dir === 'rtl' });

          expect(instance.fontFaces).toEqual({
            Roboto: [FONT_ROBOTO_FLAT_SRC],
          });
        });

        it('handles mixed @font-face', () => {
          instance.syntax.convertGlobalSheet(SYNTAX_FONT_FACE_MIXED, { rtl: dir === 'rtl' });

          expect(instance.fontFaces).toEqual({
            Roboto: [FONT_ROBOTO_FLAT_SRC],
            Circular: FONT_CIRCULAR_MULTIPLE_FLAT_SRC,
          });
        });

        it('handles multiple @font-face', () => {
          instance.syntax.convertGlobalSheet(SYNTAX_FONT_FACE_MULTIPLE, { rtl: dir === 'rtl' });

          expect(instance.fontFaces).toEqual({
            Circular: FONT_CIRCULAR_MULTIPLE_FLAT_SRC,
          });
        });

        it('handles @keyframes', () => {
          instance.syntax.convertGlobalSheet(SYNTAX_KEYFRAMES, { rtl: dir === 'rtl' });

          expect(instance.keyframes).toEqual({
            fade: KEYFRAME_FADE,
          });
        });
      });

      describe('style sheet', () => {
        it('converts unified syntax to native syntax and transforms to a class name', () => {
          instance.fontFaces.Roboto = [FONT_ROBOTO_FLAT_SRC as any];
          instance.keyframes.fade = KEYFRAME_FADE;

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
            { dir },
          );
        });

        it('handles properties', () => {
          renderAndExpect(instance, SYNTAX_PROPERTIES, SYNTAX_PROPERTIES, { dir });
        });

        it('handles attribute selectors', () => {
          renderAndExpect(instance, SYNTAX_ATTRIBUTE, SYNTAX_ATTRIBUTE, { dir });
        });

        it('handles descendant selectors', () => {
          renderAndExpect(
            instance,
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
            { dir },
          );
        });

        it('handles pseudo selectors', () => {
          renderAndExpect(instance, SYNTAX_PSEUDO, SYNTAX_PSEUDO, { dir });
        });

        it('handles multiple selectors (comma separated)', () => {
          renderAndExpect(
            instance,
            SYNTAX_MULTI_SELECTOR,
            {
              multi: {
                cursor: 'pointer',
                ':disabled': { cursor: 'default' },
                '[disabled]': { cursor: 'default' },
                '> span': { cursor: 'default' },
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
              single: {
                animationName: [KEYFRAME_SLIDE_PERCENT],
              },
              multiple: {
                animationName: [KEYFRAME_SLIDE_PERCENT, 'unknown', KEYFRAME_FADE],
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
                fontFamily: [FONT_ROBOTO_FLAT_SRC],
              },
              multiple: {
                fontFamily: [...FONT_CIRCULAR_MULTIPLE_FLAT_SRC, 'OtherFont', FONT_ROBOTO_FLAT_SRC],
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

        it('handles raw CSS', () => {
          renderAndExpect(instance, SYNTAX_RAW_CSS, {}, { dir });
        });
      });
    });
  });
});
