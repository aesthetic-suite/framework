import { expect } from 'chai';
import webPreset from 'fela-preset-web';
import FelaAdapter from '../src/FelaAdapter';
import {
  FONT_ROBOTO,
  KEYFRAME_FADE,
  SYNTAX_FULL,
  SYNTAX_AT_RULES,
  SYNTAX_PSEUDO,
  SYNTAX_FALLBACK,
  SYNTAX_FONT_FACE,
  SYNTAX_KEYFRAMES,
  SYNTAX_MEDIA_QUERY,
} from '../../../tests/mocks';

describe('FelaAdapter', () => {
  let instance;

  beforeEach(() => {
    instance = new FelaAdapter({
      plugins: [...webPreset],
    });
  });

  it('transforms style declarations into class names', () => {
    expect(instance.transform('component', SYNTAX_FULL)).to.deep.equal({
      button: 'a b c d e f g h i j k l m n o p q r s t u v w x',
    });
  });

  it('converts unified syntax to native syntax', () => {
    expect(instance.convert('component', SYNTAX_FULL)).to.deep.equal({
      button: {
        margin: 0,
        padding: '6px 12px',
        border: '1px solid #2e6da4',
        borderRadius: 4,
        display: 'inline-block',
        cursor: 'pointer',
        fontFamily: '"Roboto"',
        fontWeight: 'normal',
        lineHeight: 'normal',
        whiteSpace: 'nowrap',
        textDecoration: 'none',
        textAlign: 'center',
        backgroundColor: '#337ab7',
        verticalAlign: 'middle',
        color: ['#fff', 'rgba(0, 0, 0, 0)'],
        animationName: 'k1',
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

  it('allows standard at-rules', () => {
    expect(instance.convert('component', SYNTAX_AT_RULES)).to.deep.equal(SYNTAX_AT_RULES);
  });

  it('supports pseudos', () => {
    expect(instance.convert('component', SYNTAX_PSEUDO)).to.deep.equal(SYNTAX_PSEUDO);

    expect(instance.transform('component', SYNTAX_PSEUDO)).to.deep.equal({
      pseudo: 'a b c',
    });
  });

  it('supports unified fallbacks', () => {
    expect(instance.convert('component', SYNTAX_FALLBACK)).to.deep.equal({
      fallback: {
        background: ['red', 'linear-gradient(...)'],
        display: ['box', 'flex-box', 'flex'],
      },
    });

    expect(instance.transform('component', SYNTAX_FALLBACK)).to.deep.equal({
      fallback: 'a b',
    });
  });

  it('supports native fallbacks', () => {
    instance.disableUnifiedSyntax();

    const nativeSyntax = {
      fallback: {
        background: ['red', 'linear-gradient(...)'],
        display: ['box', 'flex-box', 'flex'],
      },
    };

    expect(instance.convert('component', nativeSyntax)).to.deep.equal(nativeSyntax);

    expect(instance.transform('component', nativeSyntax)).to.deep.equal({
      fallback: 'a b',
    });
  });

  it('supports unified font faces', () => {
    expect(instance.convert('component', SYNTAX_FONT_FACE)).to.deep.equal({
      font: {
        fontFamily: '"Roboto"',
        fontSize: 20,
      },
    });

    instance.resetGlobalCache();

    expect(instance.transform('component', SYNTAX_FONT_FACE)).to.deep.equal({
      font: 'a b',
    });
  });

  it('supports native font faces', () => {
    instance.disableUnifiedSyntax();

    const nativeSyntax = {
      font: {
        fontFamily: instance.fela.renderFont('Roboto', ['roboto.woff2'], FONT_ROBOTO),
        fontSize: 20,
      },
    };

    expect(instance.convert('component', nativeSyntax)).to.deep.equal(nativeSyntax);

    expect(instance.transform('component', nativeSyntax)).to.deep.equal({
      font: 'a b',
    });
  });

  it('supports unified animations', () => {
    expect(instance.convert('component', SYNTAX_KEYFRAMES)).to.deep.equal({
      animation: {
        animationName: 'k1',
        animationDuration: '3s, 1200ms',
        animationIterationCount: 'infinite',
      },
    });

    instance.resetGlobalCache();

    expect(instance.transform('component', SYNTAX_KEYFRAMES)).to.deep.equal({
      animation: 'a b c',
    });
  });

  it('supports native animations', () => {
    instance.disableUnifiedSyntax();

    const nativeSyntax = {
      animation: {
        animationName: instance.fela.renderKeyframe(() => KEYFRAME_FADE),
        animationDuration: '3s, 1200ms',
        animationIterationCount: 'infinite',
      },
    };

    expect(instance.convert('component', nativeSyntax)).to.deep.equal({
      animation: {
        animationName: 'k1',
        animationDuration: '3s, 1200ms',
        animationIterationCount: 'infinite',
      },
    });

    expect(instance.transform('component', nativeSyntax)).to.deep.equal({
      animation: 'a b c',
    });
  });

  it('supports unified media queries', () => {
    expect(instance.convert('component', SYNTAX_MEDIA_QUERY)).to.deep.equal({
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

    expect(instance.transform('component', SYNTAX_MEDIA_QUERY)).to.deep.equal({
      media: 'a b c',
    });
  });

  it('supports native media queries', () => {
    instance.disableUnifiedSyntax();

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

    expect(instance.convert('component', nativeSyntax)).to.deep.equal(nativeSyntax);

    expect(instance.transform('component', nativeSyntax)).to.deep.equal({
      media: 'a b c',
    });
  });
});
