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
      button: 'button-0-0',
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
      '.pseudo-0-1::before': '.pseudo-0-1::before-0-3',
      '.pseudo-0-1:hover': '.pseudo-0-1:hover-0-2',
      pseudo: 'pseudo-0-1',
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
      fallback: 'fallback-0-4',
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
      font: 'font-0-5',
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
      animation: 'animation-0-6',
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
      media: 'media-0-7',
    });
  });
});
