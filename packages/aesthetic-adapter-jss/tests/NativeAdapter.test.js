/* eslint-disable sort-keys */

import { create } from 'jss';
import preset from 'jss-preset-default';
import JSSAdapter from '../src/NativeAdapter';
import {
  FONT_ROBOTO_FLAT_SRC,
  KEYFRAME_FADE,
  SYNTAX_NATIVE_PARTIAL,
} from '../../../tests/mocks';

function renderToString(sheet) {
  return sheet.toString().replace(/\n/g, '').replace(/\s{2,}/g, '');
}

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

    expect(renderToString(instance.sheet))
      .toBe('.pseudo-0-1 {position: fixed;}.pseudo-0-1:hover {position: static;}.pseudo-0-1::before {position: absolute;}');
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

    expect(renderToString(instance.sheet))
      .toBe('.fallback-0-1 {background: linear-gradient(...);display: flex-box;display: box;display: flex;background: red;}');
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

    expect(renderToString(instance.sheet))
      .toBe("@font-face {font-family: Roboto;font-style: normal;font-weight: normal;src: local('Robo'), url('fonts/Roboto.woff2') format('woff2'), url('fonts/Roboto.ttf') format('truetype');}.font-0-1 {font-size: 20px;font-family: Roboto;}");
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

    expect(renderToString(instance.sheet))
      .toBe('@keyframes fade {from {opacity: 0;}to {opacity: 1;}}.animation-0-1 {animation-name: fade;animation-duration: 3s, 1200ms;animation-iteration-count: infinite;}');
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

    expect(renderToString(instance.sheet))
      .toBe('.media-0-1 {color: red;}@media (min-width: 300px) {.media-0-1 {color: blue;}}@media (max-width: 1000px) {.media-0-1 {color: green;}}');
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

    expect(renderToString(instance.sheet))
      .toBe('.sup-0-1 {display: block;}@supports (display: flex) {.sup-0-1 {display: flex;}}@supports not (display: flex) {.sup-0-1 {float: left;}}');
  });
});
