/* eslint-disable sort-keys */

import { speedy, flush, styleSheet } from 'glamor';
import UnifiedGlamorAdapter from '../src/UnifiedAdapter';
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

function renderToString() {
  return styleSheet.rules().map(r => r.cssText).join('').replace(/\n/g, '');
}

describe('aesthetic-adapter-glamor/UnifiedAdapter', () => {
  let instance;

  beforeEach(() => {
    flush();
    speedy(true);

    instance = new UnifiedGlamorAdapter();
  });

  it('transforms style declarations into class names', () => {
    expect(instance.transform('glamor', SYNTAX_UNIFIED_FULL)).toEqual({
      button: 'css-1hkljsl',
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
        animationName: 'fade_1q3syk4',
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

    expect(instance.transform('glamor', SYNTAX_PROPERTIES)).toEqual({
      props: 'css-115cnno',
    });

    expect(renderToString())
      .toBe('.css-115cnno,[data-css-115cnno] {color: black; display: inline; margin: 10px;}');
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

    expect(instance.transform('glamor', SYNTAX_PSEUDO)).toEqual({
      pseudo: 'css-1g7aevf',
    });

    expect(renderToString())
      .toBe('.css-1g7aevf,[data-css-1g7aevf] {position: fixed;}.css-1g7aevf:hover,[data-css-1g7aevf]:hover {position: static;}.css-1g7aevf::before,[data-css-1g7aevf]::before {position: absolute;}');
  });

  it('handles @charset', () => {
    expect(() => {
      instance.transform('glamor', SYNTAX_CHARSET);
    }).toThrowError();
  });

  it('handles @document', () => {
    expect(() => {
      instance.transform('glamor', SYNTAX_DOCUMENT);
    }).toThrowError();
  });

  it('handles @fallbacks', () => {
    expect(instance.syntax.convert(SYNTAX_FALLBACKS)).toEqual({
      fallback: {
        background: ['red', 'linear-gradient(...)'],
        display: ['box', 'flex-box', 'flex'],
      },
    });

    expect(instance.transform('glamor', SYNTAX_FALLBACKS)).toEqual({
      fallback: 'css-1nxkcks',
    });

    // Verified it ran but fallbacks don't appear in the output
    expect(renderToString())
      .toBe('.css-1nxkcks,[data-css-1nxkcks] {background: linear-gradient(...); display: flex;}');
  });

  it('handles @font-face', () => {
    expect(instance.syntax.convert(SYNTAX_FONT_FACE)).toEqual({
      font: {
        fontFamily: 'Roboto',
        fontSize: 20,
      },
    });

    instance.syntax.fontFaces = {};

    expect(instance.transform('glamor', SYNTAX_FONT_FACE)).toEqual({
      font: 'css-1x6s9dk',
    });

    expect(renderToString())
      .toBe("@font-face {font-family: Roboto; font-style: normal; font-weight: normal; src: url('fonts/Roboto.woff2') format('woff2'), url('fonts/Roboto.ttf') format('truetype');}.css-1x6s9dk,[data-css-1x6s9dk] {font-family: Roboto; font-size: 20px;}");
  });

  it('handles @import', () => {
    expect(() => {
      instance.transform('glamor', SYNTAX_IMPORT);
    }).toThrowError();
  });

  it('handles @keyframes', () => {
    expect(instance.syntax.convert(SYNTAX_KEYFRAMES)).toEqual({
      animation: {
        animationName: 'fade_1q3syk4',
        animationDuration: '3s, 1200ms',
        animationIterationCount: 'infinite',
      },
    });

    instance.syntax.keyframes = {};

    expect(instance.transform('glamor', SYNTAX_KEYFRAMES)).toEqual({
      animation: 'css-s8bawe',
    });

    expect(renderToString())
      .toBe('@-webkit-keyframes fade_1q3syk4 {   from {opacity: 0;}   to {opacity: 1;} }@-moz-keyframes fade_1q3syk4 {   from {opacity: 0;}   to {opacity: 1;} }@-o-keyframes fade_1q3syk4 {   from {opacity: 0;}   to {opacity: 1;} }@keyframes fade_1q3syk4 {   from {opacity: 0;}   to {opacity: 1;} }.css-s8bawe,[data-css-s8bawe] {animation-name: fade_1q3syk4; animation-duration: 3s, 1200ms; animation-iteration-count: infinite; -webkit-animation-name: fade_1q3syk4; -webkit-animation-duration: 3s, 1200ms; -webkit-animation-iteration-count: infinite;}');
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

    expect(instance.transform('glamor', SYNTAX_MEDIA_QUERY)).toEqual({
      media: 'css-rr71yy',
    });

    expect(renderToString())
      .toBe('.css-rr71yy,[data-css-rr71yy] {color: red;}@media (min-width: 300px) {.css-rr71yy,[data-css-rr71yy] {color: blue;}}@media (max-width: 1000px) {.css-rr71yy,[data-css-rr71yy] {color: green;}}');
  });

  it('handles @namespace', () => {
    expect(() => {
      instance.transform('glamor', SYNTAX_NAMESPACE);
    }).toThrowError();
  });

  it('handles @page', () => {
    expect(() => {
      instance.transform('glamor', SYNTAX_PAGE);
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

    expect(instance.transform('glamor', SYNTAX_SUPPORTS)).toEqual({
      sup: 'css-1sp1mbh',
    });

    // Verified it ran but supports don't appear in the output
    expect(renderToString())
      .toBe('.css-1sp1mbh,[data-css-1sp1mbh] {display: block;}');
  });

  it('handles @viewport', () => {
    expect(() => {
      instance.transform('glamor', SYNTAX_VIEWPORT);
    }).toThrowError();
  });
});
