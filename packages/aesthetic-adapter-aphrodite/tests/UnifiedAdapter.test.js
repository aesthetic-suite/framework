/* eslint-disable sort-keys */

import { StyleSheet, StyleSheetTestUtils } from 'aphrodite';
import UnifiedAphroditeAdapter from '../src/UnifiedAdapter';
import {
  FONT_ROBOTO_FLAT_SRC,
  KEYFRAME_FADE,
  SYNTAX_UNIFIED_FULL,
  SYNTAX_CHARSET,
  SYNTAX_FALLBACKS,
  SYNTAX_FONT_FACE,
  SYNTAX_IMPORT,
  SYNTAX_KEYFRAMES,
  SYNTAX_MEDIA_QUERY,
  SYNTAX_NAMESPACE,
  SYNTAX_PAGE,
  SYNTAX_PROPERTIES,
  SYNTAX_PSEUDO,
  SYNTAX_SUPPORTS,
  SYNTAX_VIEWPORT,
} from '../../../tests/mocks';
import { renderAphroditeStyles } from '../../../tests/helpers';

describe('aesthetic-adapter-aphrodite/UnifiedAdapter', () => {
  let instance;

  beforeEach(() => {
    StyleSheetTestUtils.suppressStyleInjection();
    instance = new UnifiedAphroditeAdapter(StyleSheet);
  });

  afterEach(() => {
    StyleSheetTestUtils.clearBufferAndResumeStyleInjection();
  });

  it('transforms style declarations into class names', () => {
    expect(instance.transform(instance.create(SYNTAX_UNIFIED_FULL).button)).toBe('button_jr9ve');
  });

  it('converts unified syntax to native syntax', () => {
    expect(instance.syntax.convert(SYNTAX_UNIFIED_FULL)).toEqual({
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
    });
  });

  it('handles properties', () => {
    expect(instance.syntax.convert(SYNTAX_PROPERTIES)).toEqual(SYNTAX_PROPERTIES);

    expect(instance.transform(instance.create(SYNTAX_PROPERTIES).props)).toBe('props_1pbzc6n');

    expect(renderAphroditeStyles(instance)).toMatchSnapshot();
  });

  it('handles pseudos', () => {
    expect(instance.syntax.convert(SYNTAX_PSEUDO)).toEqual({
      pseudo: {
        position: 'fixed',
        ':hover': {
          position: 'static',
        },
        '::before': {
          position: 'absolute',
        },
      },
    });

    expect(instance.transform(instance.create(SYNTAX_PSEUDO).pseudo)).toBe('pseudo_q2zd6k');

    expect(renderAphroditeStyles(instance)).toMatchSnapshot();
  });

  it('handles @charset', () => {
    expect(() => {
      instance.transform(instance.create(SYNTAX_CHARSET));
    }).toThrowError();
  });

  it('handles @fallbacks', () => {
    expect(() => {
      instance.transform(instance.create(SYNTAX_FALLBACKS).fallback);
    }).toThrowError();
  });

  it('handles @font-face', () => {
    expect(instance.syntax.convert(SYNTAX_FONT_FACE)).toEqual({
      font: {
        fontFamily: [FONT_ROBOTO_FLAT_SRC],
        fontSize: 20,
      },
    });

    instance.syntax.fontFaces = {};

    expect(instance.transform(instance.create(SYNTAX_FONT_FACE).font)).toBe('font_uk6a9p');

    expect(renderAphroditeStyles(instance)).toMatchSnapshot();
  });

  it('handles @import', () => {
    expect(() => {
      instance.transform(instance.create(SYNTAX_IMPORT));
    }).toThrowError();
  });

  it('handles @keyframes', () => {
    expect(instance.syntax.convert(SYNTAX_KEYFRAMES)).toEqual({
      animation: {
        animationName: [KEYFRAME_FADE],
        animationDuration: '3s, 1200ms',
        animationIterationCount: 'infinite',
      },
    });

    instance.syntax.keyframes = {};

    expect(instance.transform(instance.create(SYNTAX_KEYFRAMES).animation))
      .toBe('animation_1s7muh9');

    expect(renderAphroditeStyles(instance)).toMatchSnapshot();
  });

  it('handles @media', () => {
    expect(instance.syntax.convert(SYNTAX_MEDIA_QUERY)).toEqual({
      media: {
        color: 'red',
        '@media (max-width: 1000px)': {
          color: 'green',
        },
        '@media (min-width: 300px)': {
          color: 'blue',
        },
      },
    });

    expect(instance.transform(instance.create(SYNTAX_MEDIA_QUERY).media)).toBe('media_1yqe7pa');

    expect(renderAphroditeStyles(instance)).toMatchSnapshot();
  });

  it('handles @namespace', () => {
    expect(() => {
      instance.transform(instance.create(SYNTAX_NAMESPACE));
    }).toThrowError();
  });

  it('handles @page', () => {
    expect(() => {
      instance.transform(instance.create(SYNTAX_PAGE));
    }).toThrowError();
  });

  it('handles @supports', () => {
    expect(() => {
      instance.transform(instance.create(SYNTAX_SUPPORTS).sup);
    }).toThrowError();
  });

  it('handles @viewport', () => {
    expect(() => {
      instance.transform(instance.create(SYNTAX_VIEWPORT));
    }).toThrowError();
  });
});
