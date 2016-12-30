import Adapter from '../packages/aesthetic/src/Adapter';

export const FONT_ROBOTO = {
  fontFamily: 'Roboto',
  fontStyle: 'normal',
  fontWeight: 'normal',
  src: "url('roboto.woff2') format('roboto')",
};

export const KEYFRAME_FADE = {
  from: { opacity: 0 },
  to: { opacity: 1 },
};

export const TEST_CLASS_NAMES = {
  header: '.header',
  footer: '.footer',
};

export const SYNTAX_FULL = {
  '@font-face': {
    mrroboto: FONT_ROBOTO,
  },
  '@keyframes': {
    fade: KEYFRAME_FADE,
  },
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
    '@media': {
      '(max-width: 600px)': {
        padding: '4px 8px',
      },
    },
    '@fallbacks': {
      color: '#fff',
    },
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
    roboto: FONT_ROBOTO,
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

export class TestAdapter extends Adapter {
  transformStyles(styleName, declarations) {
    if (styleName === 'foo') {
      return declarations;
    }

    return TEST_CLASS_NAMES;
  }
}
