import { DeclarationBlock } from '@aesthetic/sss';

export function breakWord(): DeclarationBlock {
  return {
    overflowWrap: 'break-word',
    wordWrap: 'break-word',
    wordBreak: 'break-word',
  };
}

// TODO
export function root(): DeclarationBlock {
  return {
    // fontFamily,
    // fontSize,
    textRendering: 'optimizeLegibility',
    textSizeAdjust: '100%',
    // @ts-ignore
    '-moz-osx-font-smoothing': 'grayscale',
    // @ts-ignore
    '-webkit-font-smoothing': 'antialiased',
  };
}

export function truncate(): DeclarationBlock {
  return {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };
}

export function wrapWord(): DeclarationBlock {
  return {
    overflowWrap: 'normal',
    wordWrap: 'normal',
    wordBreak: 'normal',
  };
}
