/* eslint-disable sort-keys */

import UnifiedTypeStyleAdapter from '../src/UnifiedAdapter';
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

describe('aesthetic-adapter-typestyle/UnifiedAdapter', () => {
  let instance;

  beforeEach(() => {
    instance = new UnifiedTypeStyleAdapter();
  });

  it('transforms style declarations into class names', () => {
    expect(instance.transform('component', SYNTAX_UNIFIED_FULL)).toEqual({
      button: 'f1hfp49j',
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
        color: ['#fff', 'rgba(0, 0, 0, 0)'],
        animationName: ['f1gwuh0p'],
        animationDuration: '.3s',
        $nest: {
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
          '@supports (display: flex)': {
            display: 'flex',
          },
        },
      },
    });
  });

  it('handles properties', () => {
    expect(instance.syntax.convert(SYNTAX_PROPERTIES)).toEqual(SYNTAX_PROPERTIES);

    expect(instance.transform('typestyle', SYNTAX_PROPERTIES)).toEqual({
      props: 'f1tzsa69',
    });

    expect(instance.typeStyle.getStyles())
      .toBe('.f1tzsa69{color:black;display:inline;margin:10px}');
  });

  it('handles pseudos', () => {
    expect(instance.syntax.convert(SYNTAX_PSEUDO)).toEqual({
      pseudo: {
        position: 'fixed',
        $nest: {
          '&:hover': {
            position: 'static',
          },
          '&::before': {
            position: 'absolute',
          },
        },
      },
    });

    expect(instance.transform('typestyle', SYNTAX_PSEUDO)).toEqual({
      pseudo: 'fmow1iy',
    });

    expect(instance.typeStyle.getStyles())
      .toBe('.fmow1iy{position:fixed}.fmow1iy:hover{position:static}.fmow1iy::before{position:absolute}');
  });

  it('handles @charset', () => {
    expect(() => {
      instance.transform('typestyle', SYNTAX_CHARSET);
    }).toThrowError();
  });

  it('handles @document', () => {
    expect(() => {
      instance.transform('typestyle', SYNTAX_DOCUMENT);
    }).toThrowError();
  });

  it('handles @fallbacks', () => {
    expect(instance.syntax.convert(SYNTAX_FALLBACKS)).toEqual({
      fallback: {
        background: ['red', 'linear-gradient(...)'],
        display: ['box', 'flex-box', 'flex'],
      },
    });

    expect(instance.transform('typestyle', SYNTAX_FALLBACKS)).toEqual({
      fallback: 'fxr1ybm',
    });

    expect(instance.typeStyle.getStyles())
      .toBe('.fxr1ybm{background:red;background:linear-gradient(...);display:box;display:flex-box;display:flex}');
  });

  it('handles @font-face', () => {
    expect(instance.syntax.convert(SYNTAX_FONT_FACE)).toEqual({
      font: {
        fontFamily: 'Roboto',
        fontSize: 20,
      },
    });

    expect(instance.transform('typestyle', SYNTAX_FONT_FACE)).toEqual({
      font: 'fd14wa4',
    });

    expect(instance.typeStyle.getStyles())
      .toBe("@font-face{font-family:Roboto;font-style:normal;font-weight:normal;src:url('fonts/Roboto.woff2') format('woff2'), url('fonts/Roboto.ttf') format('truetype');src-paths:fonts/Roboto.woff2;src-paths:fonts/Roboto.ttf}.fd14wa4{font-family:Roboto;font-size:20px}");
  });

  it('handles @import', () => {
    expect(() => {
      instance.transform('typestyle', SYNTAX_IMPORT);
    }).toThrowError();
  });

  it('handles @keyframes', () => {
    expect(instance.syntax.convert(SYNTAX_KEYFRAMES)).toEqual({
      animation: {
        animationName: ['f1gwuh0p'],
        animationDuration: '3s, 1200ms',
        animationIterationCount: 'infinite',
      },
    });

    expect(instance.transform('typestyle', SYNTAX_KEYFRAMES)).toEqual({
      animation: 'f14e9xg1',
    });

    expect(instance.typeStyle.getStyles())
      .toBe('@keyframes f1gwuh0p{from{opacity:0}to{opacity:1}}.f14e9xg1{animation-duration:3s, 1200ms;animation-iteration-count:infinite;animation-name:f1gwuh0p}');
  });

  it('handles @media', () => {
    expect(instance.syntax.convert(SYNTAX_MEDIA_QUERY)).toEqual({
      media: {
        color: 'red',
        $nest: {
          '@media (max-width: 1000px)': {
            color: 'green',
          },
          '@media (min-width: 300px)': {
            color: 'blue',
          },
        },
      },
    });

    expect(instance.transform('typestyle', SYNTAX_MEDIA_QUERY)).toEqual({
      media: 'fuxmg1k',
    });

    expect(instance.typeStyle.getStyles())
      .toBe('.fuxmg1k{color:red}@media (min-width: 300px){.fuxmg1k{color:blue}}@media (max-width: 1000px){.fuxmg1k{color:green}}');
  });

  it('handles @namespace', () => {
    expect(() => {
      instance.transform('typestyle', SYNTAX_NAMESPACE);
    }).toThrowError();
  });

  it('handles @page', () => {
    expect(() => {
      instance.transform('typestyle', SYNTAX_PAGE);
    }).toThrowError();
  });

  it('handles @supports', () => {
    expect(instance.syntax.convert(SYNTAX_SUPPORTS)).toEqual({
      sup: {
        display: 'block',
        $nest: {
          '@supports (display: flex)': {
            display: 'flex',
          },
          '@supports not (display: flex)': {
            float: 'left',
          },
        },
      },
    });

    expect(instance.transform('typestyle', SYNTAX_SUPPORTS)).toEqual({
      sup: 'f6m6wzj',
    });

    expect(instance.typeStyle.getStyles())
      .toBe('.f6m6wzj{display:block}@supports (display: flex){.f6m6wzj{display:flex}}@supports not (display: flex){.f6m6wzj{float:left}}');
  });

  it('handles @viewport', () => {
    expect(() => {
      instance.transform('typestyle', SYNTAX_VIEWPORT);
    }).toThrowError();
  });
});
