/* eslint-disable sort-keys */

import { create } from 'jss';
import preset from 'jss-preset-default';
import JSSAdapter from '../src/NativeAdapter';
import {
  FONT_ROBOTO_FLAT_SRC,
  KEYFRAME_FADE,
  SYNTAX_NATIVE_PARTIAL,
} from '../../../tests/mocks';
import { renderJSSStyles } from '../../../tests/helpers';

describe('aesthetic-adapter-jss/NativeAdapter', () => {
  let instance;

  beforeEach(() => {
    const jss = create();
    jss.setup(preset());

    instance = new JSSAdapter(jss);
  });

  it('can customize the JSS instance through the constructor', () => {
    const jss = create();
    instance = new JSSAdapter(jss);

    expect(instance.jss).toBe(jss);
  });

  it('transforms style declarations into class names', () => {
    expect(instance.transform('component', SYNTAX_NATIVE_PARTIAL)).toEqual({
      button: 'button-0-1',
    });
  });

  it('handles pseudos', () => {
    expect(instance.transform('jss', {
      pseudo: {
        position: 'fixed',
        '&:hover': {
          position: 'static',
        },
        '&::before': {
          position: 'absolute',
        },
      },
    })).toEqual({
      pseudo: 'pseudo-0-1',
    });

    expect(renderJSSStyles(instance)).toMatchSnapshot();
  });

  it('handles fallbacks', () => {
    const nativeSyntax = {
      fallback: {
        background: 'red',
        display: 'flex',
        fallbacks: [
          { background: 'linear-gradient(...)' },
          { display: 'flex-box' },
          { display: 'box' },
        ],
      },
    };

    expect(instance.transform('jss', nativeSyntax)).toEqual({
      fallback: 'fallback-0-1',
    });

    expect(renderJSSStyles(instance)).toMatchSnapshot();
  });

  it('handles font faces', () => {
    const nativeSyntax = {
      '@font-face': FONT_ROBOTO_FLAT_SRC,
      font: {
        fontFamily: 'Roboto',
        fontSize: 20,
      },
    };

    expect(instance.transform('jss', nativeSyntax)).toEqual({
      font: 'font-0-1',
    });

    expect(renderJSSStyles(instance)).toMatchSnapshot();
  });

  it('handles animations', () => {
    const nativeSyntax = {
      '@keyframes fade': KEYFRAME_FADE,
      animation: {
        animationName: 'fade',
        animationDuration: '3s, 1200ms',
        animationIterationCount: 'infinite',
      },
    };

    expect(instance.transform('jss', nativeSyntax)).toEqual({
      animation: 'animation-0-1',
    });

    expect(renderJSSStyles(instance)).toMatchSnapshot();
  });

  it('handles media queries', () => {
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

    expect(instance.transform('jss', nativeSyntax)).toEqual({
      media: 'media-0-1',
    });

    expect(renderJSSStyles(instance)).toMatchSnapshot();
  });

  it('handles supports', () => {
    const nativeSyntax = {
      sup: {
        display: 'block',
        '@supports (display: flex)': {
          display: 'flex',
        },
        '@supports not (display: flex)': {
          float: 'left',
        },
      },
    };

    expect(instance.transform('jss', nativeSyntax)).toEqual({
      sup: 'sup-0-1',
    });

    expect(renderJSSStyles(instance)).toMatchSnapshot();
  });
});
