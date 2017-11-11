/* eslint-disable sort-keys */

import { createRenderer } from 'fela';
// import { createRenderer as createNativeRenderer } from 'fela-native';
import webPreset from 'fela-preset-web';
import FelaAdapter from '../src/NativeAdapter';
import {
  FONT_ROBOTO,
  KEYFRAME_FADE,
  SYNTAX_NATIVE_PARTIAL,
  SYNTAX_PSEUDO,
} from '../../../tests/mocks';

describe('aesthetic-adapter-fela/NativeAdapter', () => {
  let instance;

  beforeEach(() => {
    instance = new FelaAdapter(createRenderer({
      plugins: [...webPreset],
    }));
  });

  it('can customize the fela instance through the constructor', () => {
    const renderer = createRenderer({ plugins: [] });
    const newInstance = new FelaAdapter(renderer);

    expect(newInstance.fela).not.toEqual(instance.fela);
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
      button: 'a b c d e f g h i j k l m n o p q r s t u v w',
    });
  });

  it('supports pseudos', () => {
    expect(instance.transform('component', SYNTAX_PSEUDO)).toEqual({
      pseudo: 'a b c',
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
      fallback: 'a b',
    });
  });

  it('supports font faces', () => {
    const nativeSyntax = {
      font: {
        fontFamily: instance.fela.renderFont('Roboto', ['roboto.woff2'], FONT_ROBOTO),
        fontSize: 20,
      },
    };

    expect(instance.transform('component', nativeSyntax)).toEqual({
      font: 'a b',
    });
  });

  it('supports animations', () => {
    const nativeSyntax = {
      animation: {
        animationName: instance.fela.renderKeyframe(() => KEYFRAME_FADE),
        animationDuration: '3s, 1200ms',
        animationIterationCount: 'infinite',
      },
    };

    expect(instance.transform('component', nativeSyntax)).toEqual({
      animation: 'a b c',
    });
  });

  it('supports media queries', () => {
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

    expect(instance.transform('component', nativeSyntax)).toEqual({
      media: 'a b c',
    });
  });
});

/*
 * describe('adapters/fela/NativeAdapter (React Native)', () => {
 * let instance;
 *
 * beforeEach(() => {
 * instance = new FelaAdapter(createNativeRenderer({
 * plugins: [...webPreset],
 * }));
 * });
 *
 * it('returns the style declarations as-is', () => {
 * expect(instance.transform('component', SYNTAX_NATIVE_PARTIAL)).toEqual(SYNTAX_NATIVE_PARTIAL);
 * });
 * });
 */
