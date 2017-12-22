/* eslint-disable sort-keys */

import { create } from 'jss';
import preset from 'jss-preset-default';
import UnifiedJSSAdapter from '../src/UnifiedAdapter';
import {
  FONT_ROBOTO_FLAT_SRC,
  KEYFRAME_FADE,
  SYNTAX_UNIFIED_FULL,
  SYNTAX_CHARSET,
  SYNTAX_FALLBACKS,
  SYNTAX_FONT_FACE,
  SYNTAX_GLOBAL,
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
import { renderJSSStyles } from '../../../tests/helpers';

describe('aesthetic-adapter-jss/UnifiedAdapter', () => {
  let instance;

  beforeEach(() => {
    const jss = create();
    jss.setup(preset());

    instance = new UnifiedJSSAdapter(jss);
  });

  it('transforms style declarations into class names', () => {
    expect(instance.transform(instance.create(SYNTAX_UNIFIED_FULL).button)).toBe('button-0-1');
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

  it('handles globals', () => {
    expect(instance.syntax.convert(SYNTAX_GLOBAL)).toEqual({
      '@global': {
        body: { margin: 0 },
        html: { height: '100%' },
        a: {
          color: 'red',
          '&:hover': {
            color: 'darkred',
          },
        },
      },
    });

    instance.transform(instance.create(SYNTAX_GLOBAL));

    expect(renderJSSStyles(instance)).toMatchSnapshot();
  });

  it('handles properties', () => {
    expect(instance.syntax.convert(SYNTAX_PROPERTIES)).toEqual(SYNTAX_PROPERTIES);

    expect(instance.transform(instance.create(SYNTAX_PROPERTIES).props)).toBe('props-0-1');

    expect(renderJSSStyles(instance)).toMatchSnapshot();
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

    expect(instance.transform(instance.create(SYNTAX_PSEUDO).pseudo)).toBe('pseudo-0-1');

    expect(renderJSSStyles(instance)).toMatchSnapshot();
  });

  it('handles @charset', () => {
    expect(instance.syntax.convert(SYNTAX_CHARSET)).toEqual({
      '@charset': 'utf8',
    });

    expect(instance.transform(instance.create(SYNTAX_CHARSET))).toBe('');

    expect(renderJSSStyles(instance)).toMatchSnapshot();
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

    expect(instance.transform(instance.create(SYNTAX_FALLBACKS).fallback)).toBe('fallback-0-1');

    expect(renderJSSStyles(instance)).toMatchSnapshot();
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

    expect(instance.transform(instance.create(SYNTAX_FONT_FACE).font)).toBe('font-0-1');

    expect(renderJSSStyles(instance)).toMatchSnapshot();
  });

  it('handles @import', () => {
    expect(instance.syntax.convert(SYNTAX_IMPORT)).toEqual({
      '@import': './some/path.css',
    });

    expect(instance.transform(instance.create(SYNTAX_IMPORT))).toBe('');

    expect(renderJSSStyles(instance)).toMatchSnapshot();
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

    expect(instance.transform(instance.create(SYNTAX_KEYFRAMES).animation)).toBe('animation-0-1');

    expect(renderJSSStyles(instance)).toMatchSnapshot();
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

    expect(instance.transform(instance.create(SYNTAX_MEDIA_QUERY).media)).toBe('media-0-1');

    expect(renderJSSStyles(instance)).toMatchSnapshot();
  });

  it('handles @namespace', () => {
    expect(instance.syntax.convert(SYNTAX_NAMESPACE)).toEqual({
      '@namespace': 'url(http://www.w3.org/1999/xhtml)',
    });

    expect(instance.transform(instance.create(SYNTAX_NAMESPACE))).toBe('');

    expect(renderJSSStyles(instance)).toMatchSnapshot();
  });

  it('handles @page', () => {
    expect(() => {
      instance.transform(instance.create(SYNTAX_PAGE));
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

    expect(instance.transform(instance.create(SYNTAX_SUPPORTS).sup)).toBe('sup-0-1');

    expect(renderJSSStyles(instance)).toMatchSnapshot();
  });

  it('handles @viewport', () => {
    expect(instance.syntax.convert(SYNTAX_VIEWPORT)).toEqual({
      '@viewport': {
        width: 'device-width',
        orientation: 'landscape',
      },
    });

    expect(instance.transform(instance.create(SYNTAX_VIEWPORT))).toBe('');

    expect(renderJSSStyles(instance)).toMatchSnapshot();
  });
});
