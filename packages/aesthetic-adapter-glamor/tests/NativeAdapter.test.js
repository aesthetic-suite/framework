/* eslint-disable sort-keys */

import { css, speedy, flush, styleSheet } from 'glamor';
import GlamorAdapter from '../src/NativeAdapter';
import {
  FONT_ROBOTO_FLAT_SRC,
  KEYFRAME_FADE,
  SYNTAX_NATIVE_PARTIAL,
  SYNTAX_PSEUDO,
} from '../../../tests/mocks';

function renderToString() {
  return styleSheet.rules().map(r => r.cssText).join('').replace(/\n/g, '');
}

describe('aesthetic-adapter-glamor/NativeAdapter', () => {
  let instance;

  beforeEach(() => {
    flush();
    speedy(true);

    instance = new GlamorAdapter();
  });

  it('errors for no React Native support', () => {
    instance.native = true;

    expect(() => instance.transform()).toThrowError('Glamor does not support React Native.');
  });

  it('ignores string class names', () => {
    expect(instance.transform('glamor', {
      button: 'button',
    })).toEqual({
      button: 'button',
    });
  });

  it('transforms style declarations into class names', () => {
    expect(instance.transform('glamor', SYNTAX_NATIVE_PARTIAL)).toEqual({
      button: 'css-1n8n9n3',
    });
  });

  it('handles pseudos', () => {
    expect(instance.transform('glamor', SYNTAX_PSEUDO)).toEqual({
      pseudo: 'css-1g7aevf',
    });

    expect(renderToString())
      .toBe('.css-1g7aevf,[data-css-1g7aevf] {position: fixed;}.css-1g7aevf:hover,[data-css-1g7aevf]:hover {position: static;}.css-1g7aevf::before,[data-css-1g7aevf]::before {position: absolute;}');
  });

  it('handles fallbacks', () => {
    const nativeSyntax = {
      fallback: {
        background: ['red', 'linear-gradient(...)'],
        display: ['box', 'flex-box', 'flex'],
      },
    };

    expect(instance.transform('glamor', nativeSyntax)).toEqual({
      fallback: 'css-1nxkcks',
    });

    // Verified it ran but fallbacks don't appear in the output
    expect(renderToString())
      .toBe('.css-1nxkcks,[data-css-1nxkcks] {background: linear-gradient(...); display: flex;}');
  });

  it('handles font faces', () => {
    css.fontFace(FONT_ROBOTO_FLAT_SRC);

    const nativeSyntax = {
      font: {
        fontFamily: 'Roboto',
        fontSize: 20,
      },
    };

    expect(instance.transform('glamor', nativeSyntax)).toEqual({
      font: 'css-1x6s9dk',
    });

    expect(renderToString())
      .toBe("@font-face {font-family: Roboto; font-style: normal; font-weight: normal; src: url('fonts/Roboto.woff2') format('woff2'), url('fonts/Roboto.ttf') format('truetype');}.css-1x6s9dk,[data-css-1x6s9dk] {font-family: Roboto; font-size: 20px;}");
  });

  it('handles animations', () => {
    const nativeSyntax = {
      animation: {
        animationName: css.keyframes('fade', KEYFRAME_FADE),
        animationDuration: '3s, 1200ms',
        animationIterationCount: 'infinite',
      },
    };

    expect(instance.transform('glamor', nativeSyntax)).toEqual({
      animation: 'css-s8bawe',
    });

    expect(renderToString())
      .toBe('@-webkit-keyframes fade_1q3syk4 {   from {opacity: 0;}   to {opacity: 1;} }@-moz-keyframes fade_1q3syk4 {   from {opacity: 0;}   to {opacity: 1;} }@-o-keyframes fade_1q3syk4 {   from {opacity: 0;}   to {opacity: 1;} }@keyframes fade_1q3syk4 {   from {opacity: 0;}   to {opacity: 1;} }.css-s8bawe,[data-css-s8bawe] {animation-name: fade_1q3syk4; animation-duration: 3s, 1200ms; animation-iteration-count: infinite; -webkit-animation-name: fade_1q3syk4; -webkit-animation-duration: 3s, 1200ms; -webkit-animation-iteration-count: infinite;}');
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

    expect(instance.transform('glamor', nativeSyntax)).toEqual({
      media: 'css-rr71yy',
    });

    expect(renderToString())
      .toBe('.css-rr71yy,[data-css-rr71yy] {color: red;}@media (min-width: 300px) {.css-rr71yy,[data-css-rr71yy] {color: blue;}}@media (max-width: 1000px) {.css-rr71yy,[data-css-rr71yy] {color: green;}}');
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

    expect(instance.transform('glamor', nativeSyntax)).toEqual({
      sup: 'css-1sp1mbh',
    });

    // Verified it ran but supports don't appear in the output
    expect(renderToString())
      .toBe('.css-1sp1mbh,[data-css-1sp1mbh] {display: block;}');
  });
});
