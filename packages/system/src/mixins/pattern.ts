import { DeclarationBlock } from '@aesthetic/sss';

export function hidden(): DeclarationBlock {
  return {
    display: 'none',
  };
}

export function hiddenOffscreen(): DeclarationBlock {
  return {
    clipPath: 'rect(1px, 1px, 1px, 1px)',
    height: 1,
    left: '-5vw',
    overflow: 'hidden',
    position: 'fixed',
    width: 1,
  };
}

export function resetButton(): DeclarationBlock {
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

export function resetInput(): DeclarationBlock {
  return {
    appearance: 'none',
    backgroundColor: 'transparent',
    margin: 0,
    padding: 0,
    width: '100%',
    // @ts-ignore
    '::-moz-focus-outer': {
      border: 0,
    },
  };
}

export function resetList(): DeclarationBlock {
  return {
    listStyle: 'none',
    margin: 0,
    padding: 0,
  };
}

export function resetTypography(): DeclarationBlock {
  return {
    fontFamily: 'inherit',
    fontWeight: 'normal',
    wordWrap: 'break-word',
  };
}

export function textBreak(): DeclarationBlock {
  return {
    overflowWrap: 'break-word',
    wordWrap: 'break-word',
    wordBreak: 'break-word',
  };
}

// export function root({ typography }: Tokens): DeclarationBlock {
//   return {
//     fontFamily: typography.font.text,
//     fontSize: typography.rootTextSize,
//     lineHeight: typography.rootLineHeight,
//     textRendering: 'optimizeLegibility',
//     textSizeAdjust: '100%',
//     // @ts-ignore
//     '-moz-osx-font-smoothing': 'grayscale',
//     // @ts-ignore
//     '-webkit-font-smoothing': 'antialiased',
//   };
// }

export function textTruncate(): DeclarationBlock {
  return {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };
}

export function textWrap(): DeclarationBlock {
  return {
    overflowWrap: 'normal',
    wordWrap: 'normal',
    wordBreak: 'normal',
  };
}
