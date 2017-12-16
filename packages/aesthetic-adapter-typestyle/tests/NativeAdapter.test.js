/* eslint-disable sort-keys */

import { fontFace, keyframes } from 'typestyle';
import TypeStyleAdapter from '../src/NativeAdapter';
import {
  FONT_ROBOTO_FLAT_SRC,
  KEYFRAME_FADE,
  SYNTAX_NATIVE_PARTIAL,
} from '../../../tests/mocks';
import { renderTSStyles } from '../../../tests/helpers';

describe('aesthetic-adapter-typestyle/NativeAdapter', () => {
  let instance;

  beforeEach(() => {
    instance = new TypeStyleAdapter();
  });

  it('ignores string class names', () => {
    expect(instance.transform('typestyle', {
      button: 'button',
    })).toEqual({
      button: 'button',
    });
  });

  it('transforms style declarations into class names', () => {
    expect(instance.transform('typestyle', SYNTAX_NATIVE_PARTIAL)).toEqual({
      button: 'f7tlree',
    });
  });

  it('handles pseudos', () => {
    expect(instance.transform('typestyle', {
      pseudo: {
        position: 'fixed',
        $nest: {
          ':hover': {
            position: 'static',
          },
          '::before': {
            position: 'absolute',
          },
        },
      },
    })).toEqual({
      pseudo: 'fh5c9i2',
    });

    expect(renderTSStyles(instance)).toMatchSnapshot();
  });

  it('handles fallbacks', () => {
    const nativeSyntax = {
      fallback: {
        background: ['red', 'linear-gradient(...)'],
        display: ['box', 'flex-box', 'flex'],
      },
    };

    expect(instance.transform('typestyle', nativeSyntax)).toEqual({
      fallback: 'fxr1ybm',
    });

    expect(renderTSStyles(instance)).toMatchSnapshot();
  });

  it('handles font faces', () => {
    fontFace(FONT_ROBOTO_FLAT_SRC); // No return

    const nativeSyntax = {
      font: {
        fontFamily: 'Roboto',
        fontSize: 20,
      },
    };

    expect(instance.transform('typestyle', nativeSyntax)).toEqual({
      font: 'fd14wa4',
    });

    expect(renderTSStyles(instance)).toMatchSnapshot();
  });

  it('handles animations', () => {
    const nativeSyntax = {
      animation: {
        animationName: keyframes(KEYFRAME_FADE),
        animationDuration: '3s, 1200ms',
        animationIterationCount: 'infinite',
      },
    };

    expect(instance.transform('typestyle', nativeSyntax)).toEqual({
      animation: 'f14e9xg1',
    });

    expect(renderTSStyles(instance)).toMatchSnapshot();
  });

  it('handles media queries', () => {
    const nativeSyntax = {
      media: {
        color: 'red',
        $nest: {
          '@media (min-width: 300px)': {
            color: 'blue',
          },
          '@media (max-width: 1000px)': {
            color: 'green',
          },
        },
      },
    };

    expect(instance.transform('typestyle', nativeSyntax)).toEqual({
      media: 'fuxmg1k',
    });

    expect(renderTSStyles(instance)).toMatchSnapshot();
  });

  it('handles supports', () => {
    const nativeSyntax = {
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
    };

    expect(instance.transform('typestyle', nativeSyntax)).toEqual({
      sup: 'f6m6wzj',
    });

    expect(renderTSStyles(instance)).toMatchSnapshot();
  });
});
