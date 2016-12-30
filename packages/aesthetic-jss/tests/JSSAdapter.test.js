import { expect } from 'chai';
import { create } from 'jss';
import preset from 'jss-preset-default';
import JSSAdapter from '../src/JSSAdapter';
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

describe('JSSAdapter', () => {
  let instance;

  beforeEach(() => {
    const jss = create();
    jss.setup(preset());

    instance = new JSSAdapter(jss);
  });

  it('can customize the JSS instance through the constructor', () => {
    const jss = create();
    instance = new JSSAdapter(jss);

    expect(instance.jss).to.equal(jss);
  });

  it('formats fallbacks correctly', () => {
    expect(instance.formatFallbacks({
      display: 'flex-box',
    })).to.deep.equal([
      { display: 'flex-box' },
    ]);

    expect(instance.formatFallbacks({
      display: ['box', 'flex-box'],
    })).to.deep.equal([
      { display: 'box' },
      { display: 'flex-box' },
    ]);

    expect(instance.formatFallbacks({
      background: 'red',
      display: ['box', 'flex-box'],
    })).to.deep.equal([
      { background: 'red' },
      { display: 'box' },
      { display: 'flex-box' },
    ]);
  });

  it('transforms style declarations into class names', () => {
    expect(instance.transform('component', SYNTAX_FULL)).to.deep.equal({
      '.button-1475604568::before': '.button-1475604568::before-3099321837',
      '.button-1475604568:hover': '.button-1475604568:hover-4108293577',
      button: 'button-1475604568',
    });
  });

  it('converts unified syntax to native syntax', () => {
    expect(instance.convert('component', SYNTAX_FULL)).to.deep.equal({
      '@font-face': [FONT_ROBOTO],
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
      },
      '@media (max-width: 600px)': {
        button: {
          padding: '4px 8px',
        },
      },
    });
  });

  it('supports unified pseudos', () => {
    expect(instance.convert('component', SYNTAX_PSEUDO)).to.deep.equal({
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

    expect(instance.transform('component', SYNTAX_PSEUDO)).to.deep.equal({
      '.pseudo-2517623885::before': '.pseudo-2517623885::before-3271921155',
      '.pseudo-2517623885:hover': '.pseudo-2517623885:hover-130467353',
      pseudo: 'pseudo-2517623885',
    });
  });

  it('supports native pseudos', () => {
    instance.disableUnifiedSyntax();

    const nativeSyntax = {
      pseudo: {
        position: 'fixed',
        '&:hover': {
          position: 'static',
        },
        '&::before': {
          position: 'absolute',
        },
      },
    };

    expect(instance.convert('component', nativeSyntax)).to.deep.equal(nativeSyntax);

    expect(instance.transform('component', nativeSyntax)).to.deep.equal({
      '.pseudo-2517623885::before': '.pseudo-2517623885::before-3271921155',
      '.pseudo-2517623885:hover': '.pseudo-2517623885:hover-130467353',
      pseudo: 'pseudo-2517623885',
    });
  });

  it('supports unified fallbacks', () => {
    expect(instance.convert('component', SYNTAX_FALLBACK)).to.deep.equal({
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

    expect(instance.transform('component', SYNTAX_FALLBACK)).to.deep.equal({
      fallback: 'fallback-162314308',
    });
  });

  it('supports native fallbacks', () => {
    instance.disableUnifiedSyntax();

    const nativeSyntax = {
      fallback: {
        background: 'linear-gradient(...)',
        display: 'flex',
        fallbacks: [
          { background: 'red' },
          { display: 'box' },
          { display: 'flex-box' },
        ],
      },
    };

    expect(instance.convert('component', nativeSyntax)).to.deep.equal(nativeSyntax);

    expect(instance.transform('component', nativeSyntax)).to.deep.equal({
      fallback: 'fallback-162314308',
    });
  });

  it('supports unified font faces', () => {
    expect(instance.convert('component', SYNTAX_FONT_FACE)).to.deep.equal({
      '@font-face': [FONT_ROBOTO],
      font: {
        fontFamily: 'Roboto',
        fontSize: 20,
      },
    });

    instance.resetGlobalCache();

    expect(instance.transform('component', SYNTAX_FONT_FACE)).to.deep.equal({
      font: 'font-1088627639',
    });
  });

  it('supports native font faces', () => {
    instance.disableUnifiedSyntax();

    const nativeSyntax = {
      '@font-face': FONT_ROBOTO,
      font: {
        fontFamily: 'Roboto',
        fontSize: 20,
      },
    };

    expect(instance.convert('component', nativeSyntax)).to.deep.equal(nativeSyntax);

    instance.resetGlobalCache();

    expect(instance.transform('component', nativeSyntax)).to.deep.equal({
      font: 'font-1088627639',
    });
  });

  it('supports unified animations', () => {
    expect(instance.convert('component', SYNTAX_KEYFRAMES)).to.deep.equal({
      '@keyframes fade': KEYFRAME_FADE,
      animation: {
        animationName: 'fade',
        animationDuration: '3s, 1200ms',
        animationIterationCount: 'infinite',
      },
    });

    instance.resetGlobalCache();

    expect(instance.transform('component', SYNTAX_KEYFRAMES)).to.deep.equal({
      animation: 'animation-1324444171',
    });
  });

  it('supports native animations', () => {
    instance.disableUnifiedSyntax();

    const nativeSyntax = {
      '@keyframes fade': KEYFRAME_FADE,
      animation: {
        animationName: 'fade',
        animationDuration: '3s, 1200ms',
        animationIterationCount: 'infinite',
      },
    };

    expect(instance.convert('component', nativeSyntax)).to.deep.equal({
      '@keyframes fade': KEYFRAME_FADE,
      animation: {
        animationName: 'fade',
        animationDuration: '3s, 1200ms',
        animationIterationCount: 'infinite',
      },
    });

    expect(instance.transform('component', nativeSyntax)).to.deep.equal({
      animation: 'animation-1324444171',
    });
  });

  it('supports unified media queries', () => {
    expect(instance.convert('component', SYNTAX_MEDIA_QUERY)).to.deep.equal({
      media: {
        color: 'red',
      },
      '@media (max-width: 1000px)': {
        media: {
          color: 'green',
        },
      },
      '@media (min-width: 300px)': {
        media: {
          color: 'blue',
        },
      },
    });

    expect(instance.transform('component', SYNTAX_MEDIA_QUERY)).to.deep.equal({
      media: 'media-2861677607',
    });
  });

  it('supports native media queries', () => {
    instance.disableUnifiedSyntax();

    const nativeSyntax = {
      media: {
        color: 'red',
      },
      '@media (max-width: 1000px)': {
        media: {
          color: 'green',
        },
      },
      '@media (min-width: 300px)': {
        media: {
          color: 'blue',
        },
      },
    };

    expect(instance.convert('component', nativeSyntax)).to.deep.equal(nativeSyntax);

    expect(instance.transform('component', nativeSyntax)).to.deep.equal({
      media: 'media-2861677607',
    });
  });
});
