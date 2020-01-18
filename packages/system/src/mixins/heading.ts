import { DeclarationBlock } from '@aesthetic/sss';
import { Tokens, HeadingSize } from '../types';
import { resetTypography } from './pattern';

export function heading(
  { heading: h, typography, ui }: Tokens,
  level: HeadingSize,
): DeclarationBlock {
  const { letterSpacing, lineHeight, size } = h[level];

  return {
    ...resetTypography(),
    color: ui.text.base,
    letterSpacing,
    lineHeight,
    fontFamily: typography.font.heading,
    fontSize: size,
  };
}
