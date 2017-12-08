/* eslint-disable sort-keys */

import UnifiedTypeStyleAdapter from '../src/UnifiedAdapter';
import {
  SYNTAX_UNIFIED_FULL,
  SYNTAX_FALLBACK,
  SYNTAX_AT_RULES,
  SYNTAX_PSEUDO,
  SYNTAX_FONT_FACE,
  SYNTAX_KEYFRAMES,
  SYNTAX_MEDIA_QUERY,
  SYNTAX_SUPPORTS,
} from '../../../tests/mocks';

describe('aesthetic-adapter-typestyle/UnifiedAdapter', () => {
  let instance;

  beforeEach(() => {
    instance = new UnifiedTypeStyleAdapter();
  });

  it('transforms style declarations into class names', () => {
    expect(instance.transform('component', SYNTAX_UNIFIED_FULL)).toEqual({
      button: 'f1hfp49j',
    });
  });

  it('converts unified syntax to native syntax', () => {
    expect(instance.convert(SYNTAX_UNIFIED_FULL)).toEqual({
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
        color: ['#fff', 'rgba(0, 0, 0, 0)'],
        animationName: 'f1gwuh0p',
        animationDuration: '.3s',
        $nest: {
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
          '@supports (display: flex)': {
            display: 'flex',
          },
        },
      },
    });
  });

  it('allows standard at-rules', () => {
    expect(instance.convert(SYNTAX_AT_RULES)).toEqual(SYNTAX_AT_RULES);
  });

  it('supports pseudos', () => {
    expect(instance.convert(SYNTAX_PSEUDO)).toEqual({
      pseudo: {
        position: 'fixed',
        $nest: {
          '&:hover': {
            position: 'static',
          },
          '&::before': {
            position: 'absolute',
          },
        },
      },
    });
  });

  it('supports fallbacks', () => {
    expect(instance.convert(SYNTAX_FALLBACK)).toEqual({
      fallback: {
        background: ['red', 'linear-gradient(...)'],
        display: ['box', 'flex-box', 'flex'],
      },
    });
  });

  it('supports font faces', () => {
    expect(instance.convert(SYNTAX_FONT_FACE)).toEqual({
      font: {
        fontFamily: 'Roboto',
        fontSize: 20,
      },
    });
  });

  it('supports animations', () => {
    expect(instance.convert(SYNTAX_KEYFRAMES)).toEqual({
      animation: {
        animationName: 'f1gwuh0p',
        animationDuration: '3s, 1200ms',
        animationIterationCount: 'infinite',
      },
    });
  });

  it('supports media queries', () => {
    expect(instance.convert(SYNTAX_MEDIA_QUERY)).toEqual({
      media: {
        color: 'red',
        $nest: {
          '@media (max-width: 1000px)': {
            color: 'green',
          },
          '@media (min-width: 300px)': {
            color: 'blue',
          },
        },
      },
    });
  });

  it('supports supports', () => {
    expect(instance.convert(SYNTAX_SUPPORTS)).toEqual({
      sup: {
        display: 'block',
        $nest: {
          '@supports (display: flex)': {
            display: 'flex',
          },
          '@supports not (display: flex)': {
            float: 'left',
          },
        },
      },
    });
  });
});
