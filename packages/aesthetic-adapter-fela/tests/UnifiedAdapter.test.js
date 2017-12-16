/* eslint-disable sort-keys */

import { createRenderer } from 'fela';
import { renderToString } from 'fela-tools';
import webPreset from 'fela-preset-web';
import UnifiedFelaAdapter from '../src/UnifiedAdapter';
import {
  SYNTAX_UNIFIED_FULL,
  SYNTAX_CHARSET,
  SYNTAX_DOCUMENT,
  SYNTAX_FALLBACKS,
  SYNTAX_FONT_FACE,
  SYNTAX_IMPORT,
  SYNTAX_KEYFRAMES,
  SYNTAX_MEDIA_QUERY,
  SYNTAX_NAMESPACE,
  SYNTAX_PAGE,
  SYNTAX_PROPERTIES,
  SYNTAX_PSEUDO,
  SYNTAX_SUPPORTS,
  SYNTAX_VIEWPORT,
} from '../../../tests/mocks';

describe('aesthetic-adapter-fela/UnifiedAdapter', () => {
  let instance;

  beforeEach(() => {
    instance = new UnifiedFelaAdapter(createRenderer({
      plugins: [...webPreset],
    }));
  });

  it('transforms style declarations into class names', () => {
    expect(instance.transform('fela', SYNTAX_UNIFIED_FULL)).toEqual({
      button: 'a b c d e f g h i j k l m n o p q r s t u v w x',
    });
  });

  it('converts unified syntax to native syntax', () => {
    expect(instance.syntax.convert(SYNTAX_UNIFIED_FULL)).toEqual({
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

  it('handles properties', () => {
    expect(instance.syntax.convert(SYNTAX_PROPERTIES)).toEqual(SYNTAX_PROPERTIES);

    expect(instance.transform('fela', SYNTAX_PROPERTIES)).toEqual({
      props: 'a b c',
    });

    expect(renderToString(instance.fela))
      .toBe('.a{color:black}.b{display:inline}.c{margin:10px}');
  });

  it('handles pseudos', () => {
    expect(instance.syntax.convert(SYNTAX_PSEUDO)).toEqual({
      pseudo: {
        position: 'fixed',
        ':hover': {
          position: 'static',
        },
        '::before': {
          position: 'absolute',
        },
      },
    });

    expect(instance.transform('fela', SYNTAX_PSEUDO)).toEqual({
      pseudo: 'a b c',
    });

    expect(renderToString(instance.fela))
      .toBe('.a{position:fixed}.b::before{position:absolute}.c:hover{position:static}');
  });

  it('handles @charset', () => {
    expect(() => {
      instance.transform('fela', SYNTAX_CHARSET);
    }).toThrowError();
  });

  it('handles @document', () => {
    expect(() => {
      instance.transform('fela', SYNTAX_DOCUMENT);
    }).toThrowError();
  });

  it('handles @fallbacks', () => {
    expect(instance.syntax.convert(SYNTAX_FALLBACKS)).toEqual({
      fallback: {
        background: ['linear-gradient(...)', 'red'],
        display: ['flex', 'box', 'flex-box'],
      },
    });

    expect(instance.transform('fela', SYNTAX_FALLBACKS)).toEqual({
      fallback: 'a b',
    });

    expect(renderToString(instance.fela))
      .toBe('.a{background:-webkit-linear-gradient(...);background:-moz-linear-gradient(...);background:linear-gradient(...);background:red}.b{display:-webkit-box;display:-moz-box;display:-ms-flexbox;display:-webkit-flex;display:flex;display:box;display:flex-box}');
  });

  it('handles @font-face', () => {
    expect(instance.syntax.convert(SYNTAX_FONT_FACE)).toEqual({
      font: {
        fontFamily: 'Roboto',
        fontSize: 20,
      },
    });

    instance.syntax.fontFaces = {};

    expect(instance.transform('fela', SYNTAX_FONT_FACE)).toEqual({
      font: 'a b',
    });

    expect(renderToString(instance.fela))
      .toBe("@font-face{font-family:\"Roboto\";font-style:normal;font-weight:normal;src: local('Robo'), url('fonts/Roboto.woff2') format('woff2'),url('fonts/Roboto.ttf') format('truetype')}.a{font-family:Roboto}.b{font-size:20px}");
  });

  it('handles @import', () => {
    expect(() => {
      instance.transform('fela', SYNTAX_IMPORT);
    }).toThrowError();
  });

  it('handles @keyframes', () => {
    expect(instance.syntax.convert(SYNTAX_KEYFRAMES)).toEqual({
      animation: {
        animationName: 'k1',
        animationDuration: '3s, 1200ms',
        animationIterationCount: 'infinite',
      },
    });

    instance.syntax.keyframes = {};

    expect(instance.transform('fela', SYNTAX_KEYFRAMES)).toEqual({
      animation: 'a b c',
    });

    expect(renderToString(instance.fela))
      .toBe('@-webkit-keyframes k1{from{opacity:0}to{opacity:1}}@-moz-keyframes k1{from{opacity:0}to{opacity:1}}@keyframes k1{from{opacity:0}to{opacity:1}}.a{animation-name:k1;-webkit-animation-name:k1}.b{animation-duration:3s, 1200ms;-webkit-animation-duration:3s, 1200ms}.c{animation-iteration-count:infinite;-webkit-animation-iteration-count:infinite}');
  });

  it('handles @media', () => {
    expect(instance.syntax.convert(SYNTAX_MEDIA_QUERY)).toEqual({
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

    expect(instance.transform('fela', SYNTAX_MEDIA_QUERY)).toEqual({
      media: 'a b c',
    });

    expect(renderToString(instance.fela))
      .toBe('.a{color:red}@media (min-width: 300px){.b{color:blue}}@media (max-width: 1000px){.c{color:green}}');
  });

  it('handles @namespace', () => {
    expect(() => {
      instance.transform('fela', SYNTAX_NAMESPACE);
    }).toThrowError();
  });

  it('handles @page', () => {
    expect(() => {
      instance.transform('fela', SYNTAX_PAGE);
    }).toThrowError();
  });

  it('handles @supports', () => {
    expect(instance.syntax.convert(SYNTAX_SUPPORTS)).toEqual({
      sup: {
        display: 'block',
        '@supports (display: flex)': {
          display: 'flex',
        },
        '@supports not (display: flex)': {
          float: 'left',
        },
      },
    });

    expect(instance.transform('fela', SYNTAX_SUPPORTS)).toEqual({
      sup: 'a b c',
    });

    expect(renderToString(instance.fela))
      .toBe('.a{display:block}@supports (display: flex){.b{display:-webkit-box;display:-moz-box;display:-ms-flexbox;display:-webkit-flex;display:flex}}@supports not (display: flex){.c{float:left}}');
  });

  it('handles @viewport', () => {
    expect(() => {
      instance.transform('fela', SYNTAX_VIEWPORT);
    }).toThrowError();
  });
});
