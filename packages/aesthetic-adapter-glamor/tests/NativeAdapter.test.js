import { expect } from 'chai';
import { css, speedy, flush } from 'glamor';
import GlamorAdapter from '../src/NativeAdapter';
import {
  FONT_ROBOTO,
  KEYFRAME_FADE,
  SYNTAX_NATIVE_PARTIAL,
  SYNTAX_PSEUDO,
} from '../../../tests/mocks';

describe('GlamorAdapter', () => {
  let instance;

  beforeEach(() => {
    flush();
    speedy(true);

    instance = new GlamorAdapter();
  });

  it('transforms style declarations into class names', () => {
    expect(instance.transform('component', SYNTAX_NATIVE_PARTIAL)).to.deep.equal({
      button: 'component-css-1n8n9n3',
    });
  });

  it('supports pseudos', () => {
    expect(instance.transform('component', SYNTAX_PSEUDO)).to.deep.equal({
      pseudo: 'component-css-1g7aevf',
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
      fallback: 'component-css-1nxkcks',
    });
  });

  it('supports font faces', () => {
    const nativeSyntax = {
      font: {
        fontFamily: css.fontFace(FONT_ROBOTO),
        fontSize: 20,
      },
    };

    expect(instance.transform('component', nativeSyntax)).to.deep.equal({
      font: 'component-css-1x6s9dk',
    });
  });

  it('supports animations', () => {
    const nativeSyntax = {
      animation: {
        animationName: css.keyframes('fade', KEYFRAME_FADE),
        animationDuration: '3s, 1200ms',
        animationIterationCount: 'infinite',
      },
    };

    expect(instance.transform('component', nativeSyntax)).to.deep.equal({
      animation: 'component-css-7pau8t',
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
      media: 'component-css-rr71yy',
    });
  });
});
