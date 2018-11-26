/* eslint-disable jest/expect-expect */

import { StyleSheetTestUtils } from 'aphrodite';
import AphroditeAesthetic from '../src/AphroditeAesthetic';
import {
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
} from '../../../tests/mocks';
import { cleanStyles } from '../../../tests/helpers';

describe('AphroditeAesthetic', () => {
  let instance: AphroditeAesthetic<any>;

  function renderAndTest(
    styles: any,
    expStyles: any,
    expClassName: string,
    global: boolean = false,
  ) {
    const nativeSheet = global
      ? instance.syntax.convertGlobalSheet(styles).toObject()
      : instance.syntax.convertStyleSheet(styles).toObject();
    const styleSheet = instance.processStyleSheet(nativeSheet);

    expect(nativeSheet).toEqual(expStyles);

    expect(instance.transformStyles(...Object.values(styleSheet))).toBe(expClassName);

    expect(cleanStyles(StyleSheetTestUtils.getBufferedStyles().join(''))).toMatchSnapshot();
  }

  beforeEach(() => {
    StyleSheetTestUtils.suppressStyleInjection();
    instance = new AphroditeAesthetic();
  });

  afterEach(() => {
    StyleSheetTestUtils.clearBufferAndResumeStyleInjection();
  });

  it('converts and transforms inline styles', () => {
    expect(instance.transformToClassName([{ margin: 0 }, { padding: 2 }])).toBe(
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
        true,
      );
    });

    it('handles @font-face', () => {
      instance.syntax.convertGlobalSheet(SYNTAX_FONT_FACE);

      expect(instance.fontFaces).toEqual({
        Roboto: [
          {
            ...FONT_ROBOTO_FLAT_SRC,
            fontFamily: ['Roboto'],
          },
        ],
      });
    });

    it('handles mixed @font-face', () => {
      instance.syntax.convertGlobalSheet(SYNTAX_FONT_FACE_MIXED);

      expect(instance.fontFaces).toEqual({
        Roboto: [
          {
            ...FONT_ROBOTO_FLAT_SRC,
            fontFamily: ['Roboto'],
          },
        ],
        Circular: FONT_CIRCULAR_MULTIPLE_FLAT_SRC.map(face => ({
          ...face,
          fontFamily: ['Circular'],
        })),
      });
    });

    it('handles multiple @font-face', () => {
      instance.syntax.convertGlobalSheet(SYNTAX_FONT_FACE_MULTIPLE);

      expect(instance.fontFaces).toEqual({
        Circular: FONT_CIRCULAR_MULTIPLE_FLAT_SRC.map(face => ({
          ...face,
          fontFamily: ['Circular'],
        })),
      });
    });

    it('handles @keyframes', () => {
      instance.syntax.convertGlobalSheet(SYNTAX_KEYFRAMES);

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
            textAlign: 'center',
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
        'button_jr9ve',
      );
    });

    it('handles properties', () => {
      renderAndTest(SYNTAX_PROPERTIES, SYNTAX_PROPERTIES, 'props_1pbzc6n');
    });

    it('handles attribute selectors', () => {
      renderAndTest(SYNTAX_ATTRIBUTE, SYNTAX_ATTRIBUTE, 'attr_424cv8');
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
      );
    });

    it('handles pseudo selectors', () => {
      renderAndTest(SYNTAX_PSEUDO, SYNTAX_PSEUDO, 'pseudo_q2zd6k');
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
        'single_1j39j3w-o_O-multiple_19eoumq',
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
        'media_1yqe7pa',
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
      );
    });
  });
});
