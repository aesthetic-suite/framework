/* eslint-disable sort-keys */

import { create } from 'jss';
import preset from 'jss-preset-default';
import UnifiedJSSAdapter from '../src/UnifiedAdapter';
import {
  FONT_ROBOTO_FLAT_SRC,
  KEYFRAME_FADE,
  SYNTAX_UNIFIED_FULL,
  SYNTAX_FALLBACK,
  SYNTAX_AT_RULES,
  SYNTAX_PSEUDO,
  SYNTAX_FONT_FACE,
  SYNTAX_KEYFRAMES,
  SYNTAX_MEDIA_QUERY,
  SYNTAX_SUPPORTS,
} from '../../../tests/mocks';

describe('aesthetic-adapter-jss/UnifiedAdapter', () => {
  let instance;

  beforeEach(() => {
    const jss = create();
    jss.setup(preset());

    instance = new UnifiedJSSAdapter(jss);
  });

  it('transforms style declarations into class names', () => {
    expect(instance.transform('component', SYNTAX_UNIFIED_FULL)).toEqual({
      button: 'button-0-1',
    });
  });

  it('converts unified syntax to native syntax', () => {
    expect(instance.syntax.convert(SYNTAX_UNIFIED_FULL)).toEqual({
      '@font-face': [FONT_ROBOTO_FLAT_SRC],
      '@keyframes fade': KEYFRAME_FADE,
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
        fallbacks: [
          { color: '#fff' },
        ],
        '@media (max-width: 600px)': {
          padding: '4px 8px',
        },
        '@supports (display: flex)': {
          display: 'flex',
        },
      },
    });
  });

  it('allows standard at-rules', () => {
    expect(instance.syntax.convert(SYNTAX_AT_RULES)).toEqual(SYNTAX_AT_RULES);
  });

  it('supports pseudos', () => {
    expect(instance.syntax.convert(SYNTAX_PSEUDO)).toEqual({
      pseudo: {
        position: 'fixed',
        '&:hover': {
          position: 'static',
        },
        '&::before': {
          position: 'absolute',
        },
      },
    });
  });

  it('supports fallbacks', () => {
    expect(instance.syntax.convert(SYNTAX_FALLBACK)).toEqual({
      fallback: {
        background: 'linear-gradient(...)',
        display: 'flex',
        fallbacks: [
          { background: 'red' },
          { display: 'box' },
          { display: 'flex-box' },
        ],
      },
    });
  });

  it('supports font faces', () => {
    expect(instance.syntax.convert(SYNTAX_FONT_FACE)).toEqual({
      '@font-face': [FONT_ROBOTO_FLAT_SRC],
      font: {
        fontFamily: 'Roboto',
        fontSize: 20,
      },
    });
  });

  it('supports animations', () => {
    expect(instance.syntax.convert(SYNTAX_KEYFRAMES)).toEqual({
      '@keyframes fade': KEYFRAME_FADE,
      animation: {
        animationName: 'fade',
        animationDuration: '3s, 1200ms',
        animationIterationCount: 'infinite',
      },
    });
  });

  it('supports media queries', () => {
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
  });

  it('supports supports', () => {
    expect(instance.syntax.convert(SYNTAX_SUPPORTS)).toEqual({
      sup: {
        display: 'block',
        '@supports (display: flex)': {
          display: 'flex',
        },
        '@supports not (display: flex)': {
          float: 'left',
        },
      },
    });
  });
});
