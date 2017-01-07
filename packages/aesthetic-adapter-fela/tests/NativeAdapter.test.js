import { expect } from 'chai';
import webPreset from 'fela-preset-web';
import FelaAdapter from '../src/NativeAdapter';
import {
  FONT_ROBOTO,
  KEYFRAME_FADE,
  SYNTAX_NATIVE_PARTIAL,
  SYNTAX_PSEUDO,
} from '../../../tests/mocks';

describe('FelaAdapter', () => {
  let instance;

  beforeEach(() => {
    instance = new FelaAdapter({
      plugins: [...webPreset],
    });
  });

  it('transforms style declarations into class names', () => {
    expect(instance.transform('component', SYNTAX_NATIVE_PARTIAL)).to.deep.equal({
      button: 'a b c d e f g h i j k l m n o p q r s t u v w',
    });
  });

  it('supports pseudos', () => {
    expect(instance.transform('component', SYNTAX_PSEUDO)).to.deep.equal({
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

    expect(instance.transform('component', nativeSyntax)).to.deep.equal({
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

    expect(instance.transform('component', nativeSyntax)).to.deep.equal({
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

    expect(instance.transform('component', nativeSyntax)).to.deep.equal({
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

    expect(instance.transform('component', nativeSyntax)).to.deep.equal({
      media: 'a b c',
    });
  });
});
