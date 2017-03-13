import { create } from 'jss';
import preset from 'jss-preset-default';
import JSSAdapter from '../src/NativeAdapter';
import {
  FONT_ROBOTO,
  KEYFRAME_FADE,
  SYNTAX_NATIVE_PARTIAL,
} from '../../../tests/mocks';

describe('aesthetic-adapter-jss/NativeAdapter', () => {
  let instance;

  beforeEach(() => {
    const jss = create();
    jss.setup(preset());

    instance = new JSSAdapter(jss);
  });

  it('errors for no React Native support', () => {
    instance.native = true;

    expect(() => instance.transform()).toThrowError('JSS does not support React Native.');
  });

  it('can customize the JSS instance through the constructor', () => {
    const jss = create();
    instance = new JSSAdapter(jss);

    expect(instance.jss).toBe(jss);
  });

  it('transforms style declarations into class names', () => {
    expect(instance.transform('component', SYNTAX_NATIVE_PARTIAL)).toEqual({
      button: 'button-2887057758',
    });
  });

  it('supports pseudos', () => {
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

    expect(instance.transform('component', nativeSyntax)).toEqual({
      '.pseudo-2517623885::before': '.pseudo-2517623885::before-3271921155',
      '.pseudo-2517623885:hover': '.pseudo-2517623885:hover-130467353',
      pseudo: 'pseudo-2517623885',
    });
  });

  it('supports fallbacks', () => {
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

    expect(instance.transform('component', nativeSyntax)).toEqual({
      fallback: 'fallback-162314308',
    });
  });

  it('supports font faces', () => {
    const nativeSyntax = {
      '@font-face': FONT_ROBOTO,
      font: {
        fontFamily: 'Roboto',
        fontSize: 20,
      },
    };

    expect(instance.transform('component', nativeSyntax)).toEqual({
      font: 'font-1088627639',
    });
  });

  it('supports animations', () => {
    const nativeSyntax = {
      '@keyframes fade': KEYFRAME_FADE,
      animation: {
        animationName: 'fade',
        animationDuration: '3s, 1200ms',
        animationIterationCount: 'infinite',
      },
    };

    expect(instance.transform('component', nativeSyntax)).toEqual({
      animation: 'animation-1324444171',
    });
  });

  it('supports media queries', () => {
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

    expect(instance.transform('component', nativeSyntax)).toEqual({
      media: 'media-2861677607',
    });
  });
});
