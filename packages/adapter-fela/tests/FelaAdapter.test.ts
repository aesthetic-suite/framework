/* eslint-disable jest/expect-expect */

import { createRenderer } from 'fela';
import webPreset from 'fela-preset-web';
import { Aesthetic, GLOBAL_STYLE_NAME } from 'aesthetic';
import {
  setupAesthetic,
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
  FONT_ROBOTO,
  FONT_CIRCULAR_MULTIPLE,
  SYNTAX_MEDIA_QUERY_NESTED,
  SYNTAX_KEYFRAMES_INLINE,
  SYNTAX_FONT_FACES_INLINE,
  SYNTAX_RAW_CSS,
} from 'aesthetic/lib/testing';
import FelaAdapter from '../src/FelaAdapter';

describe('FelaAdapter', () => {
  let instance: FelaAdapter;

  beforeEach(() => {
    instance = new FelaAdapter(
      createRenderer({
        plugins: [...webPreset],
      }),
    );

    setupAesthetic(new Aesthetic(), instance);
  });

  afterEach(() => {
    cleanupStyleElements();
  });

  DIRECTIONS.forEach(dir => {
    describe(`${dir.toUpperCase()}`, () => {
      it('converts and transforms inline styles', () => {
        expect(instance.transformStyles([{ margin: 0 }, { padding: 2 }], { dir })).toBe('a b');
      });

      describe('global sheet', () => {
        it('flushes and purges global styles from the DOM', () => {
          renderAndExpect(instance, SYNTAX_GLOBAL, {}, { dir, global: true });

          instance.purgeStyles(GLOBAL_STYLE_NAME);

          expect(getFlushedStyles()).toMatchSnapshot();
        });

        it('handles @font-face', () => {
          const spy = jest.spyOn(instance.fela, 'renderFont');

          instance.syntax.convertGlobalSheet(SYNTAX_FONT_FACE, { dir });

          expect(spy).toHaveBeenCalledWith('Roboto', FONT_ROBOTO.srcPaths, FONT_ROBOTO_FLAT_SRC);
          expect(spy).toHaveBeenCalledTimes(1);
        });

        it('handles mixed @font-face', () => {
          const spy = jest.spyOn(instance.fela, 'renderFont');

          instance.syntax.convertGlobalSheet(SYNTAX_FONT_FACE_MIXED, { dir });

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

          instance.syntax.convertGlobalSheet(SYNTAX_FONT_FACE_MULTIPLE, { dir });

          expect(spy).toHaveBeenCalledWith(
            'Circular',
            FONT_CIRCULAR_MULTIPLE[0].srcPaths,
            FONT_CIRCULAR_MULTIPLE_FLAT_SRC[0],
          );
          expect(spy).toHaveBeenCalledTimes(4);
        });

        it('handles @keyframes', () => {
          const spy = jest.spyOn(instance.fela, 'renderKeyframe');

          instance.syntax.convertGlobalSheet(SYNTAX_KEYFRAMES, { dir });

          expect(spy).toHaveBeenCalledWith(expect.anything(), {});
        });
      });

      describe('style sheet', () => {
        it('flushes and purges all styles from the DOM', () => {
          const styles = { test: { display: 'block' } };

          renderAndExpect(instance, styles, styles, { dir });

          instance.purgeStyles();

          expect(getFlushedStyles()).toMatchSnapshot();
        });

        it('converts unified syntax to native syntax and transforms to a class name', () => {
          instance.fela.renderFont('Roboto', FONT_ROBOTO.srcPaths, FONT_ROBOTO);

          // @ts-ignore
          instance.keyframes.fade = instance.fela.renderKeyframe(() => KEYFRAME_FADE, {});

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
                animationName: 'k1',
              },
              multiple: {
                animationName: 'k1, unknown, k2',
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
