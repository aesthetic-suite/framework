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

export const TEST_SYNTAX = {
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

export function pseudoOutput(className) {
  return `.${className} {
  position: fixed;
}

.${className}:hover {
  position: static;
}

.${className}::before {
  position: absolute;
}`;
}

export function fallbackOutput(className) {
  return '';
}

export function fontFaceOutput(className) {
  return `@font-face {
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  src: url('roboto.woff2') format('roboto');
}

.${className} {
  font-family: "Roboto";
  font-size: 20px;
}`;
}

export function keyframesOutput(className, animClass) {
  return `@keyframes ${animClass} {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.${className} {
  -webkit-animation-name: ${animClass};
  -webkit-animation-duration: 3s, 1200ms;
  -webkit-animation-iteration-count: infinite;
  animation-name: ${animClass};
  animation-duration: 3s, 1200ms;
  animation-iteration-count: infinite;
}`;
}

export function mediaQueryOutput(className) {
  return `.${className} {
  color: red;
}

@media (min-width: 300px) {
  .${className} {
    color: blue;
  }
}`;
}

export function syntaxOutput(buttonClass, animClass) {
  return `@font-face {
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  src: url('roboto.woff2') format('roboto');
}

@keyframes ${animClass} {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.${buttonClass} {
  -webkit-animation-duration: .3s;
  -webkit-animation-name: ${animClass};
  border: 1px solid #2e6da4;
  border-radius: 4px;
  display: inline-block;
  cursor: pointer;
  font-family: "Roboto";
  font-weight: normal;
  line-height: normal;
  padding: 6px 12px;
  text-decoration: none;
  text-align: center;
  background-color: #337ab7;
  vertical-align: middle;
  color: rgba(0, 0, 0, 0);
  animation-name: keyframe_cwjpzv;
  animation-duration: .3s;
  margin: 0px;
  white-space: nowrap;
}

.${buttonClass}:hover {
  background-color: #286090;
  border-color: #204d74;
}

.${buttonClass}::before {
  content: "★";
  display: inline-block;
  vertical-align: middle;
  margin-right: 5px;
}

@media (max-width: 600px) {
  .${buttonClass} {
    padding: 4px 8px;
  }
}`;
}

export class TestAdapter extends Adapter {
  transformStyles(styleName, declarations) {
    if (styleName === 'foo') {
      return declarations;
    }

    return TEST_CLASS_NAMES;
  }
}
