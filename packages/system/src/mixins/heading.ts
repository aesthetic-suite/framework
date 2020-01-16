import { DeclarationBlock } from '@aesthetic/sss';
import { HeadingToken } from '../types';
import { resetTypography } from './ui';

// TODO color
export function heading({ letterSpacing, lineHeight, size }: HeadingToken): DeclarationBlock {
  return {
    ...resetTypography(),
    color: '#000',
    letterSpacing,
    lineHeight,
    fontSize: size,
    fontWeight: 'bold',
  };
}
