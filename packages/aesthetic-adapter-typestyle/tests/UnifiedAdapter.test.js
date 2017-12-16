/* eslint-disable sort-keys */

import UnifiedTypeStyleAdapter from '../src/UnifiedAdapter';
import {
  SYNTAX_UNIFIED_FULL,
  SYNTAX_CHARSET,
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
import { renderTSStyles } from '../../../tests/helpers';

describe('aesthetic-adapter-typestyle/UnifiedAdapter', () => {
  let instance;

  beforeEach(() => {
    instance = new UnifiedTypeStyleAdapter();
  });

  it('transforms style declarations into class names', () => {
    expect(instance.transform('typestyle', SYNTAX_UNIFIED_FULL)).toEqual({
      button: 'fkp30lv',
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
        },
      },
    });
  });

  it('handles properties', () => {
    expect(instance.syntax.convert(SYNTAX_PROPERTIES)).toEqual(SYNTAX_PROPERTIES);

    expect(instance.transform('typestyle', SYNTAX_PROPERTIES)).toEqual({
      props: 'f1tzsa69',
    });

    expect(renderTSStyles(instance)).toMatchSnapshot();
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

    expect(renderTSStyles(instance)).toMatchSnapshot();
  });

  it('handles @charset', () => {
    expect(() => {
      instance.transform('typestyle', SYNTAX_CHARSET);
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

    expect(renderTSStyles(instance)).toMatchSnapshot();
  });

  it('handles @font-face', () => {
    expect(instance.syntax.convert(SYNTAX_FONT_FACE)).toEqual({
      font: {
        fontFamily: 'Roboto',
        fontSize: 20,
      },
    });

    instance.syntax.fontFaces = {};

    expect(instance.transform('typestyle', SYNTAX_FONT_FACE)).toEqual({
      font: 'fd14wa4',
    });

    expect(renderTSStyles(instance)).toMatchSnapshot();
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

    instance.syntax.keyframes = {};

    expect(instance.transform('typestyle', SYNTAX_KEYFRAMES)).toEqual({
      animation: 'f14e9xg1',
    });

    expect(renderTSStyles(instance)).toMatchSnapshot();
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

    expect(renderTSStyles(instance)).toMatchSnapshot();
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

    expect(renderTSStyles(instance)).toMatchSnapshot();
  });

  it('handles @viewport', () => {
    expect(() => {
      instance.transform('typestyle', SYNTAX_VIEWPORT);
    }).toThrowError();
  });
});
