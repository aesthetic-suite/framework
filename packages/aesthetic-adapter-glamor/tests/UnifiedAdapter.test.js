/* eslint-disable sort-keys */

import { speedy, flush } from 'glamor';
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
import { renderGlamorStyles } from '../../../tests/helpers';

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

    expect(renderGlamorStyles(instance)).toMatchSnapshot();
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

    expect(renderGlamorStyles(instance)).toMatchSnapshot();
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
        background: ['linear-gradient(...)', 'red'],
        display: ['flex', 'box', 'flex-box'],
      },
    });

    expect(instance.transform('glamor', SYNTAX_FALLBACKS)).toEqual({
      fallback: 'css-1806hfp',
    });

    // Verified it ran but fallbacks don't appear in the output
    expect(renderGlamorStyles(instance)).toMatchSnapshot();
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

    expect(renderGlamorStyles(instance)).toMatchSnapshot();
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

    expect(renderGlamorStyles(instance)).toMatchSnapshot();
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

    expect(renderGlamorStyles(instance)).toMatchSnapshot();
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
    expect(renderGlamorStyles(instance)).toMatchSnapshot();
  });

  it('handles @viewport', () => {
    expect(() => {
      instance.transform('glamor', SYNTAX_VIEWPORT);
    }).toThrowError();
  });
});
