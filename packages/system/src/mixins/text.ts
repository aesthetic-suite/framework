import { DeclarationBlock } from '@aesthetic/sss';
import { Tokens, TextSize } from '../types';
import { resetTypography } from './pattern';

export function text({ text: t, typography, ui }: Tokens, level: TextSize): DeclarationBlock {
  const { lineHeight, size } = t[level];

  return {
    ...resetTypography(),
    color: ui.text.base,
    fontFamily: typography.font.text,
    fontSize: size,
    lineHeight,
  };
}
