/* eslint-disable sort-keys */

import { createRenderer } from 'fela';
import { renderToString } from 'fela-tools';
import webPreset from 'fela-preset-web';
import FelaAdapter from '../src/NativeAdapter';
import {
  FONT_ROBOTO_FLAT_SRC,
  KEYFRAME_FADE,
  SYNTAX_NATIVE_PARTIAL,
  SYNTAX_PSEUDO,
} from '../../../tests/mocks';

describe('aesthetic-adapter-fela/NativeAdapter', () => {
  let instance;

  beforeEach(() => {
    instance = new FelaAdapter(createRenderer({
      plugins: [...webPreset],
    }));
  });

  it('can customize the fela instance through the constructor', () => {
    const renderer = createRenderer({ plugins: [] });
    const newInstance = new FelaAdapter(renderer);

    expect(newInstance.fela).not.toEqual(instance.fela);
  });

  it('ignores string class names', () => {
    expect(instance.transform('fela', {
      button: 'button',
    })).toEqual({
      button: 'button',
    });
  });

  it('transforms style declarations into class names', () => {
    expect(instance.transform('fela', SYNTAX_NATIVE_PARTIAL)).toEqual({
      button: 'a b c d e f g h i j k l m n o p q r s t u v w',
    });
  });

  it('handles pseudos', () => {
    expect(instance.transform('fela', SYNTAX_PSEUDO)).toEqual({
      pseudo: 'a b c',
    });

    expect(renderToString(instance.fela))
      .toBe('.a{position:fixed}.b::before{position:absolute}.c:hover{position:static}');
  });

  it('handles fallbacks', () => {
    const nativeSyntax = {
      fallback: {
        background: ['red', 'linear-gradient(...)'],
        display: ['box', 'flex-box', 'flex'],
      },
    };

    expect(instance.transform('fela', nativeSyntax)).toEqual({
      fallback: 'a b',
    });

    expect(renderToString(instance.fela))
      .toBe('.a{background:red;background:-webkit-linear-gradient(...);background:-moz-linear-gradient(...);background:linear-gradient(...)}.b{display:box;display:flex-box;display:-webkit-box;display:-moz-box;display:-ms-flexbox;display:-webkit-flex;display:flex}');
  });

  it('handles font faces', () => {
    instance.fela.renderFont('Roboto', ['fonts/roboto.woff2'], FONT_ROBOTO_FLAT_SRC);

    const nativeSyntax = {
      font: {
        fontFamily: 'Roboto',
        fontSize: 20,
      },
    };

    expect(instance.transform('fela', nativeSyntax)).toEqual({
      font: 'a b',
    });

    expect(renderToString(instance.fela))
      .toBe("@font-face{font-family:\"Roboto\";font-style:normal;font-weight:normal;src:url('fonts/roboto.woff2') format('woff2')}.a{font-family:Roboto}.b{font-size:20px}");
  });

  it('handles animations', () => {
    const nativeSyntax = {
      animation: {
        animationName: instance.fela.renderKeyframe(() => KEYFRAME_FADE),
        animationDuration: '3s, 1200ms',
        animationIterationCount: 'infinite',
      },
    };

    expect(instance.transform('fela', nativeSyntax)).toEqual({
      animation: 'a b c',
    });

    expect(renderToString(instance.fela))
      .toBe('@-webkit-keyframes k1{from{opacity:0}to{opacity:1}}@-moz-keyframes k1{from{opacity:0}to{opacity:1}}@keyframes k1{from{opacity:0}to{opacity:1}}.a{animation-name:k1;-webkit-animation-name:k1}.b{animation-duration:3s, 1200ms;-webkit-animation-duration:3s, 1200ms}.c{animation-iteration-count:infinite;-webkit-animation-iteration-count:infinite}');
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

    expect(instance.transform('fela', nativeSyntax)).toEqual({
      media: 'a b c',
    });

    expect(renderToString(instance.fela))
      .toBe('.a{color:red}@media (min-width: 300px){.b{color:blue}}@media (max-width: 1000px){.c{color:green}}');
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

    expect(instance.transform('fela', nativeSyntax)).toEqual({
      sup: 'a b c',
    });

    expect(renderToString(instance.fela))
      .toBe('.a{display:block}@supports (display: flex){.b{display:-webkit-box;display:-moz-box;display:-ms-flexbox;display:-webkit-flex;display:flex}}@supports not (display: flex){.c{float:left}}');
  });
});
