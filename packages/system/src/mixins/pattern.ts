import { Declarations } from '@aesthetic/types';
import { VarUtil } from '../types';

export function hidden(): Declarations {
  return {
    display: 'none',
  };
}

export function hiddenOffscreen(): Declarations {
  return {
    clipPath: 'rect(1px, 1px, 1px, 1px)',
    height: 1,
    left: '-5vw',
    overflow: 'hidden',
    position: 'fixed',
    width: 1,
  };
}

export function resetButton(): Declarations {
  return {
    appearance: 'none',
    backgroundColor: 'transparent',
    border: 0,
    cursor: 'pointer',
    display: 'inline-flex',
    fontSize: 'inherit',
    margin: 0,
    padding: 0,
    textDecoration: 'none',
    userSelect: 'auto',
    verticalAlign: 'middle',
  };
}

export function resetInput(): Declarations {
  return {
    appearance: 'none',
    backgroundColor: 'transparent',
    margin: 0,
    padding: 0,
    width: '100%',
    // @ts-expect-error
    '::-moz-focus-outer': {
      border: 0,
    },
  };
}

export function resetList(): Declarations {
  return {
    listStyle: 'none',
    margin: 0,
    padding: 0,
  };
}

export function resetTypography(): Declarations {
  return {
    fontFamily: 'inherit',
    fontWeight: 'normal',
    wordWrap: 'break-word',
  };
}

export function textBreak(): Declarations {
  return {
    overflowWrap: 'break-word',
    wordWrap: 'break-word',
    wordBreak: 'break-word',
  };
}

export function root(vars: VarUtil): Declarations {
  return {
    fontFamily: vars('typography-font-text'),
    fontSize: vars('typography-root-text-size'),
    lineHeight: vars('typography-root-line-height'),
    textRendering: 'optimizeLegibility',
    textSizeAdjust: '100%',
    margin: 0,
    padding: 0,
    // @ts-expect-error
    '-webkit-font-smoothing': 'antialiased',
    '-moz-osx-font-smoothing': 'grayscale',
  };
}

export function textTruncate(): Declarations {
  return {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };
}

export function textWrap(): Declarations {
  return {
    overflowWrap: 'normal',
    wordWrap: 'normal',
    wordBreak: 'normal',
  };
}
