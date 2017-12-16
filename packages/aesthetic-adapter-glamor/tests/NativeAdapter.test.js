/* eslint-disable sort-keys */

import { css, speedy, flush } from 'glamor';
import GlamorAdapter from '../src/NativeAdapter';
import {
  FONT_ROBOTO_FLAT_SRC,
  KEYFRAME_FADE,
  SYNTAX_NATIVE_PARTIAL,
  SYNTAX_PSEUDO,
} from '../../../tests/mocks';
import { renderGlamorStyles } from '../../../tests/helpers';

describe('aesthetic-adapter-glamor/NativeAdapter', () => {
  let instance;

  beforeEach(() => {
    flush();
    speedy(true);

    instance = new GlamorAdapter();
  });

  it('ignores string class names', () => {
    expect(instance.transform('glamor', {
      button: 'button',
    })).toEqual({
      button: 'button',
    });
  });

  it('transforms style declarations into class names', () => {
    expect(instance.transform('glamor', SYNTAX_NATIVE_PARTIAL)).toEqual({
      button: 'css-1n8n9n3',
    });
  });

  it('handles pseudos', () => {
    expect(instance.transform('glamor', SYNTAX_PSEUDO)).toEqual({
      pseudo: 'css-1g7aevf',
    });

    expect(renderGlamorStyles(instance)).toMatchSnapshot();
  });

  it('handles fallbacks', () => {
    const nativeSyntax = {
      fallback: {
        background: ['red', 'linear-gradient(...)'],
        display: ['box', 'flex-box', 'flex'],
      },
    };

    expect(instance.transform('glamor', nativeSyntax)).toEqual({
      fallback: 'css-1nxkcks',
    });

    // Verified it ran but fallbacks don't appear in the output
    expect(renderGlamorStyles(instance)).toMatchSnapshot();
  });

  it('handles font faces', () => {
    css.fontFace(FONT_ROBOTO_FLAT_SRC);

    const nativeSyntax = {
      font: {
        fontFamily: 'Roboto',
        fontSize: 20,
      },
    };

    expect(instance.transform('glamor', nativeSyntax)).toEqual({
      font: 'css-1x6s9dk',
    });

    expect(renderGlamorStyles(instance)).toMatchSnapshot();
  });

  it('handles animations', () => {
    const nativeSyntax = {
      animation: {
        animationName: css.keyframes('fade', KEYFRAME_FADE),
        animationDuration: '3s, 1200ms',
        animationIterationCount: 'infinite',
      },
    };

    expect(instance.transform('glamor', nativeSyntax)).toEqual({
      animation: 'css-s8bawe',
    });

    expect(renderGlamorStyles(instance)).toMatchSnapshot();
  });

  it('handles media queries', () => {
    const nativeSyntax = {
      media: {
        color: 'red',
        '@media (min-width: 300px)': {
          color: 'blue',
        },
        '@media (max-width: 1000px)': {
          color: 'green',
        },
      },
    };

    expect(instance.transform('glamor', nativeSyntax)).toEqual({
      media: 'css-rr71yy',
    });

    expect(renderGlamorStyles(instance)).toMatchSnapshot();
  });

  it('handles supports', () => {
    const nativeSyntax = {
      sup: {
        display: 'block',
        '@supports (display: flex)': {
          display: 'flex',
        },
        '@supports not (display: flex)': {
          float: 'left',
        },
      },
    };

    expect(instance.transform('glamor', nativeSyntax)).toEqual({
      sup: 'css-1sp1mbh',
    });

    // Verified it ran but supports don't appear in the output
    expect(renderGlamorStyles(instance)).toMatchSnapshot();
  });
});
