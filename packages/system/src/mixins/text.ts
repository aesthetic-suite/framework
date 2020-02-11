import { DeclarationBlock } from '@aesthetic/sss';
import { Tokens, TextSize } from '../types';
import { resetTypography } from './pattern';
import { LAYOUT_SHADES } from '../constants';

export function text({ text: t, typography, palette }: Tokens, level: TextSize): DeclarationBlock {
  const { lineHeight, size } = t[level];

  return {
    ...resetTypography(),
    color: palette.neutral.color[LAYOUT_SHADES.text],
    fontFamily: typography.font.text,
    fontSize: size,
    lineHeight,
  };
}
