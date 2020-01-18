import { DeclarationBlock } from '@aesthetic/sss';
import { Tokens } from '../types';

export function breakWord(): DeclarationBlock {
  return {
    overflowWrap: 'break-word',
    wordWrap: 'break-word',
    wordBreak: 'break-word',
  };
}

export function root({ typography }: Tokens): DeclarationBlock {
  return {
    fontFamily: typography.font.text,
    fontSize: typography.rootTextSize,
    lineHeight: typography.rootLineHeight,
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
