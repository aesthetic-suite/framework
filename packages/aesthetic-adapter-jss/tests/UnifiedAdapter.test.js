/* eslint-disable sort-keys */

import { create } from 'jss';
import preset from 'jss-preset-default';
import UnifiedJSSAdapter from '../src/UnifiedAdapter';
import {
  FONT_ROBOTO_FLAT_SRC,
  KEYFRAME_FADE,
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

function renderToString(sheet) {
  return sheet.toString().replace(/\n/g, '').replace(/\s{2,}/g, '');
}

describe('aesthetic-adapter-jss/UnifiedAdapter', () => {
  let instance;

  beforeEach(() => {
    const jss = create();
    jss.setup(preset());

    instance = new UnifiedJSSAdapter(jss);
  });

  it('transforms style declarations into class names', () => {
    expect(instance.transform('component', SYNTAX_UNIFIED_FULL)).toEqual({
      button: 'button-0-1',
    });
  });

  it('converts unified syntax to native syntax', () => {
    expect(instance.syntax.convert(SYNTAX_UNIFIED_FULL)).toEqual({
      '@font-face': [FONT_ROBOTO_FLAT_SRC],
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
        '@media (max-width: 600px)': {
          padding: '4px 8px',
        },
      },
    });
  });

  it('handles properties', () => {
    expect(instance.syntax.convert(SYNTAX_PROPERTIES)).toEqual(SYNTAX_PROPERTIES);

    expect(instance.transform('jss', SYNTAX_PROPERTIES)).toEqual({
      props: 'props-0-1',
    });

    expect(renderToString(instance.sheet))
      .toBe('.props-0-1 {color: black;margin: 10px;display: inline;}');
  });

  it('handles pseudos', () => {
    expect(instance.syntax.convert(SYNTAX_PSEUDO)).toEqual({
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

    expect(instance.transform('jss', SYNTAX_PSEUDO)).toEqual({
      pseudo: 'pseudo-0-1',
    });

    expect(renderToString(instance.sheet))
      .toBe('.pseudo-0-1 {position: fixed;}.pseudo-0-1:hover {position: static;}.pseudo-0-1::before {position: absolute;}');
  });

  it('handles @charset', () => {
    expect(instance.syntax.convert(SYNTAX_CHARSET)).toEqual({
      '@charset': 'utf8',
    });

    expect(instance.transform('jss', SYNTAX_CHARSET)).toEqual({});

    expect(renderToString(instance.sheet))
      .toBe('@charset utf8;');
  });

  it('handles @document', () => {
    expect(() => {
      instance.transform('jss', SYNTAX_DOCUMENT);
    }).toThrowError();
  });

  it('handles @fallbacks', () => {
    expect(instance.syntax.convert(SYNTAX_FALLBACKS)).toEqual({
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

    expect(instance.transform('jss', SYNTAX_FALLBACKS)).toEqual({
      fallback: 'fallback-0-1',
    });

    expect(renderToString(instance.sheet))
      .toBe('.fallback-0-1 {background: red;display: box;display: flex-box;display: flex;background: linear-gradient(...);}');
  });

  it('handles @font-face', () => {
    expect(instance.syntax.convert(SYNTAX_FONT_FACE)).toEqual({
      '@font-face': [FONT_ROBOTO_FLAT_SRC],
      font: {
        fontFamily: 'Roboto',
        fontSize: 20,
      },
    });

    instance.syntax.fontFaces = {};

    expect(instance.transform('jss', SYNTAX_FONT_FACE)).toEqual({
      font: 'font-0-1',
    });

    expect(renderToString(instance.sheet))
      .toBe("@font-face {font-family: Roboto;font-style: normal;font-weight: normal;src: local('Robo'), url('fonts/Roboto.woff2') format('woff2'), url('fonts/Roboto.ttf') format('truetype');}.font-0-1 {font-size: 20px;font-family: Roboto;}");
  });

  it('handles @import', () => {
    expect(instance.syntax.convert(SYNTAX_IMPORT)).toEqual({
      '@import': './some/path.css',
    });

    expect(instance.transform('jss', SYNTAX_IMPORT)).toEqual({});

    expect(renderToString(instance.sheet))
      .toBe('@import ./some/path.css;');
  });

  it('handles @keyframes', () => {
    expect(instance.syntax.convert(SYNTAX_KEYFRAMES)).toEqual({
      '@keyframes fade': KEYFRAME_FADE,
      animation: {
        animationName: 'fade',
        animationDuration: '3s, 1200ms',
        animationIterationCount: 'infinite',
      },
    });

    instance.syntax.keyframes = {};

    expect(instance.transform('jss', SYNTAX_KEYFRAMES)).toEqual({
      animation: 'animation-0-1',
    });

    expect(renderToString(instance.sheet))
      .toBe('@keyframes fade {from {opacity: 0;}to {opacity: 1;}}.animation-0-1 {animation-name: fade;animation-duration: 3s, 1200ms;animation-iteration-count: infinite;}');
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

    expect(instance.transform('jss', SYNTAX_MEDIA_QUERY)).toEqual({
      media: 'media-0-1',
    });

    expect(renderToString(instance.sheet))
      .toBe('.media-0-1 {color: red;}@media (min-width: 300px) {.media-0-1 {color: blue;}}@media (max-width: 1000px) {.media-0-1 {color: green;}}');
  });

  it('handles @namespace', () => {
    expect(instance.syntax.convert(SYNTAX_NAMESPACE)).toEqual({
      '@namespace': 'url(http://www.w3.org/1999/xhtml)',
    });

    expect(instance.transform('jss', SYNTAX_NAMESPACE)).toEqual({});

    expect(renderToString(instance.sheet))
      .toBe('@namespace url(http://www.w3.org/1999/xhtml);');
  });

  it('handles @page', () => {
    expect(() => {
      instance.transform('jss', SYNTAX_PAGE);
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

    expect(instance.transform('jss', SYNTAX_SUPPORTS)).toEqual({
      sup: 'sup-0-1',
    });

    expect(renderToString(instance.sheet))
      .toBe('.sup-0-1 {display: block;}@supports (display: flex) {.sup-0-1 {display: flex;}}@supports not (display: flex) {.sup-0-1 {float: left;}}');
  });

  it('handles @viewport', () => {
    expect(instance.syntax.convert(SYNTAX_VIEWPORT)).toEqual({
      '@viewport': {
        width: 'device-width',
        orientation: 'landscape',
      },
    });

    expect(instance.transform('jss', SYNTAX_VIEWPORT)).toEqual({});

    expect(renderToString(instance.sheet))
      .toBe('@viewport {width: device-width;orientation: landscape;}');
  });
});
