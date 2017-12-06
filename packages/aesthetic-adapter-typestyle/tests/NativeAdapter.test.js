/* eslint-disable sort-keys */

import { fontFace, keyframes } from 'typestyle';
import TypeStyleAdapter from '../src/NativeAdapter';
import {
  FONT_ROBOTO_FLAT_SRC,
  KEYFRAME_FADE,
  SYNTAX_NATIVE_PARTIAL,
} from '../../../tests/mocks';

describe('aesthetic-adapter-typestyle/NativeAdapter', () => {
  let instance;

  beforeEach(() => {
    instance = new TypeStyleAdapter();
  });

  it('errors for no React Native support', () => {
    instance.native = true;

    expect(() => instance.transform()).toThrowError('TypeStyle does not support React Native.');
  });

  it('ignores string class names', () => {
    expect(instance.transform('component', {
      button: 'button',
    })).toEqual({
      button: 'button',
    });
  });

  it('transforms style declarations into class names', () => {
    expect(instance.transform('component', SYNTAX_NATIVE_PARTIAL)).toEqual({
      button: 'f7tlree',
    });
  });

  it('supports pseudos', () => {
    expect(instance.transform('component', {
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
  });

  it('supports fallbacks', () => {
    const nativeSyntax = {
      fallback: {
        background: ['red', 'linear-gradient(...)'],
        display: ['box', 'flex-box', 'flex'],
      },
    };

    expect(instance.transform('component', nativeSyntax)).toEqual({
      fallback: 'fxr1ybm',
    });
  });

  it('supports font faces', () => {
    fontFace(FONT_ROBOTO_FLAT_SRC); // No return

    const nativeSyntax = {
      font: {
        fontFamily: 'Roboto',
        fontSize: 20,
      },
    };

    expect(instance.transform('component', nativeSyntax)).toEqual({
      font: 'fd14wa4',
    });
  });

  it('supports animations', () => {
    const nativeSyntax = {
      animation: {
        animationName: keyframes(KEYFRAME_FADE),
        animationDuration: '3s, 1200ms',
        animationIterationCount: 'infinite',
      },
    };

    expect(instance.transform('component', nativeSyntax)).toEqual({
      animation: 'f14e9xg1',
    });
  });

  it('supports media queries', () => {
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

    expect(instance.transform('component', nativeSyntax)).toEqual({
      media: 'fuxmg1k',
    });
  });
});
