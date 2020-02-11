import { DeclarationBlock } from '@aesthetic/sss';
import { Tokens, HeadingSize } from '../types';
import { resetTypography } from './pattern';
import { LAYOUT_SHADES } from '../constants';

export function heading(
  { heading: h, typography, palette }: Tokens,
  level: HeadingSize,
): DeclarationBlock {
  const { letterSpacing, lineHeight, size } = h[level];

  return {
    ...resetTypography(),
    color: palette.neutral.color[LAYOUT_SHADES.text],
    letterSpacing,
    lineHeight,
    fontFamily: typography.font.heading,
    fontSize: size,
  };
}
