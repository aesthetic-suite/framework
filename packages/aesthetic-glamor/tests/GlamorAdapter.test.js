import { expect } from 'chai';
import { css, speedy, flush } from 'glamor';
import GlamorAdapter from '../src/GlamorAdapter';
import {
  FONT_ROBOTO,
  KEYFRAME_FADE,
  SYNTAX_FULL,
  SYNTAX_PSEUDO,
  SYNTAX_FALLBACK,
  SYNTAX_FONT_FACE,
  SYNTAX_KEYFRAMES,
  SYNTAX_MEDIA_QUERY,
} from '../../../tests/mocks';

describe('GlamorAdapter', () => {
  let instance;

  beforeEach(() => {
    flush();
    speedy(true);

    instance = new GlamorAdapter();
  });

  it('transforms style declarations into class names', () => {
    expect(instance.transform('component', SYNTAX_FULL)).to.deep.equal({
      button: 'component-css-plme6f',
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
        fontFamily: 'Roboto',
        fontWeight: 'normal',
        lineHeight: 'normal',
        whiteSpace: 'nowrap',
        textDecoration: 'none',
        textAlign: 'center',
        backgroundColor: '#337ab7',
        verticalAlign: 'middle',
        color: ['#fff', 'rgba(0, 0, 0, 0)'],
        animationName: 'fade_1d92vx2',
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

  it('supports pseudos', () => {
    expect(instance.convert('component', SYNTAX_PSEUDO)).to.deep.equal(SYNTAX_PSEUDO);

    expect(instance.transform('component', SYNTAX_PSEUDO)).to.deep.equal({
      pseudo: 'component-css-1g7aevf',
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
      fallback: 'component-css-1nxkcks',
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
      fallback: 'component-css-1nxkcks',
    });
  });

  it('supports unified font faces', () => {
    expect(instance.convert('component', SYNTAX_FONT_FACE)).to.deep.equal({
      font: {
        fontFamily: 'Roboto',
        fontSize: 20,
      },
    });

    instance.resetGlobalCache();

    expect(instance.transform('component', SYNTAX_FONT_FACE)).to.deep.equal({
      font: 'component-css-1x6s9dk',
    });
  });

  it('supports native font faces', () => {
    instance.disableUnifiedSyntax();

    const nativeSyntax = {
      font: {
        fontFamily: css.fontFace(FONT_ROBOTO),
        fontSize: 20,
      },
    };

    expect(instance.convert('component', nativeSyntax)).to.deep.equal(nativeSyntax);

    expect(instance.transform('component', nativeSyntax)).to.deep.equal({
      font: 'component-css-1x6s9dk',
    });
  });

  it('supports unified animations', () => {
    expect(instance.convert('component', SYNTAX_KEYFRAMES)).to.deep.equal({
      animation: {
        animationName: 'fade_1d92vx2',
        animationDuration: '3s, 1200ms',
        animationIterationCount: 'infinite',
      },
    });

    instance.resetGlobalCache();

    expect(instance.transform('component', SYNTAX_KEYFRAMES)).to.deep.equal({
      animation: 'component-css-7pau8t',
    });
  });

  it('supports native animations', () => {
    instance.disableUnifiedSyntax();

    const nativeSyntax = {
      animation: {
        animationName: css.keyframes('fade', KEYFRAME_FADE),
        animationDuration: '3s, 1200ms',
        animationIterationCount: 'infinite',
      },
    };

    expect(instance.convert('component', nativeSyntax)).to.deep.equal({
      animation: {
        animationName: 'fade_1d92vx2',
        animationDuration: '3s, 1200ms',
        animationIterationCount: 'infinite',
      },
    });

    expect(instance.transform('component', nativeSyntax)).to.deep.equal({
      animation: 'component-css-7pau8t',
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
      media: 'component-css-rr71yy',
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
      media: 'component-css-rr71yy',
    });
  });
});
