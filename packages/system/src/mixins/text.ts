import { DeclarationBlock } from '@aesthetic/sss';
import { TextToken } from '../types';
import { resetTypography } from './ui';

// TODO color
export function text({ lineHeight, size }: TextToken): DeclarationBlock {
  return {
    ...resetTypography(),
    color: '#000',
    fontSize: size,
    letterSpacing: 'initial',
    lineHeight,
    textTransform: 'initial',
  };
}
