import { Rule } from '@aesthetic/types';
import { BREAKPOINT_SIZES } from '../constants';
import { VarUtil, BreakpointTokens } from '../types';

export function hideCompletely(): Rule {
  return {
    display: 'none',
  };
}

export function hideOffscreen(): Rule {
  return {
    clipPath: 'rect(1px, 1px, 1px, 1px)',
    height: 1,
    left: '-5vw',
    overflow: 'hidden',
    position: 'fixed',
    width: 1,
  };
}

export function hideVisually(): Rule {
  return {
    [':not(:focus):not(:active)' as ':focus']: {
      border: 0,
      clip: 'rect(0, 0, 0, 0)',
      clipPath: 'inset(50%)',
      height: 1,
      margin: 0,
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      whiteSpace: 'nowrap',
      width: 1,
    } as const,
  };
}

export function resetButton(): Rule {
  return {
    appearance: 'none',
    backgroundColor: 'transparent',
    border: 0,
    cursor: 'pointer',
    display: 'inline-block',
    fontSize: 'inherit',
    margin: 0,
    padding: 0,
    textDecoration: 'none',
    userSelect: 'auto',
    verticalAlign: 'middle',
  };
}

export function resetInput(): Rule {
  return {
    appearance: 'none',
    backgroundColor: 'transparent',
    margin: 0,
    padding: 0,
    width: '100%',
    '::-moz-focus-outer': {
      border: 0,
    },
  };
}

export function resetList(): Rule {
  return {
    listStyle: 'none',
    margin: 0,
    padding: 0,
  };
}

export function resetMedia(): Rule {
  return {
    display: 'block',
    verticalAlign: 'middle',
  };
}

export function resetTypography(): Rule {
  return {
    fontFamily: 'inherit',
    fontSize: 'inherit',
    fontWeight: 'normal',
    wordWrap: 'break-word',
  };
}

export function root(vars: VarUtil, breakpoints: BreakpointTokens): Rule {
  const declaration: Rule = {
    backgroundColor: vars('palette-neutral-bg-base'),
    color: vars('palette-neutral-fg-base'),
    fontFamily: vars('typography-font-text'),
    fontSize: vars('typography-root-text-size'),
    lineHeight: vars('typography-root-line-height'),
    textRendering: 'optimizeLegibility',
    textSizeAdjust: '100%',
    margin: 0,
    padding: 0,
    '-webkit-font-smoothing': 'antialiased',
    '-moz-osx-font-smoothing': 'grayscale',
  };

  // Fluid typography!
  BREAKPOINT_SIZES.forEach((size) => {
    declaration[`@media screen and ${breakpoints[size].query}`] = {
      fontSize: vars(`breakpoint-${size}-root-text-size` as 'breakpoint-md-root-text-size'),
      lineHeight: vars(`breakpoint-${size}-root-line-height` as 'breakpoint-md-root-line-height'),
    };
  });

  return declaration;
}

export function textBreak(): Rule {
  return {
    overflowWrap: 'break-word',
    wordWrap: 'break-word',
    wordBreak: 'break-word',
  };
}

export function textTruncate(): Rule {
  return {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };
}

export function textWrap(): Rule {
  return {
    overflowWrap: 'normal',
    wordWrap: 'normal',
    wordBreak: 'normal',
  };
}
