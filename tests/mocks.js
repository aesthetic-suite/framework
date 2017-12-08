/* eslint-disable sort-keys */

import Adapter from '../packages/aesthetic/src/Adapter';

export const FONT_ROBOTO = {
  fontFamily: 'Roboto',
  fontStyle: 'normal',
  fontWeight: 'normal',
  src: ['fonts/Roboto.woff2', 'fonts/Roboto.ttf'],
};

export const FONT_ROBOTO_FLAT_SRC = {
  fontFamily: 'Roboto',
  fontStyle: 'normal',
  fontWeight: 'normal',
  src: "url('fonts/Roboto.woff2') format('woff2'), url('fonts/Roboto.ttf') format('truetype')",
};

export const KEYFRAME_FADE = {
  from: { opacity: 0 },
  to: { opacity: 1 },
};

export const TEST_CLASS_NAMES = {
  header: '.header',
  footer: '.footer',
};

export const SYNTAX_NATIVE_PARTIAL = {
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
  },
};

export const SYNTAX_UNIFIED_FULL = {
  '@font-face': {
    Roboto: FONT_ROBOTO,
  },
  '@keyframes': {
    fade: KEYFRAME_FADE,
  },
  button: {
    ...SYNTAX_NATIVE_PARTIAL.button,
    '@media': {
      '(max-width: 600px)': {
        padding: '4px 8px',
      },
    },
    '@supports': {
      '(display: flex)': {
        display: 'flex',
      },
    },
    '@fallbacks': {
      color: '#fff',
    },
  },
};

export const SYNTAX_AT_RULES = {
  '@charset': 'UTF-8',
  '@page :left': {
    size: 'A4 landscape',
  },
  '@viewport': {
    orientation: 'landscape',
  },
};

export const SYNTAX_PSEUDO = {
  pseudo: {
    position: 'fixed',
    ':hover': {
      position: 'static',
    },
    '::before': {
      position: 'absolute',
    },
  },
};

export const SYNTAX_FALLBACK = {
  fallback: {
    background: 'linear-gradient(...)',
    display: 'flex',
    '@fallbacks': {
      background: 'red',
      display: ['box', 'flex-box'],
    },
  },
};

export const SYNTAX_FONT_FACE = {
  '@font-face': {
    Roboto: FONT_ROBOTO,
  },
  font: {
    fontFamily: 'Roboto',
    fontSize: 20,
  },
};

export const SYNTAX_KEYFRAMES = {
  '@keyframes': {
    fade: KEYFRAME_FADE,
  },
  animation: {
    animationName: 'fade',
    animationDuration: '3s, 1200ms',
    animationIterationCount: 'infinite',
  },
};

export const SYNTAX_MEDIA_QUERY = {
  media: {
    color: 'red',
    '@media': {
      '(min-width: 300px)': {
        color: 'blue',
      },
      '(max-width: 1000px)': {
        color: 'green',
      },
    },
  },
};

export const SYNTAX_SUPPORTS = {
  sup: {
    display: 'block',
    '@supports': {
      '(display: flex)': {
        display: 'flex',
      },
      'not (display: flex)': {
        float: 'left',
      },
    },
  },
};

export class TestAdapter extends Adapter {
  lastTransform = {};

  transform(styleName, declarations) {
    if (styleName === 'foo') {
      return declarations;
    }

    this.lastTransform = declarations;

    return TEST_CLASS_NAMES;
  }
}
