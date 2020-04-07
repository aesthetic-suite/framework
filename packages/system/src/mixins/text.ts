import { DeclarationBlock } from '@aesthetic/sss';
import { TextSize, VarUtil } from '../types';
import { resetTypography } from './pattern';
import { LAYOUT_SHADES } from '../constants';

export function text(vars: VarUtil, level: TextSize): DeclarationBlock {
  return Object.assign(resetTypography(), {
    color: vars(`palette-neutral-color-${LAYOUT_SHADES.text}` as 'palette-neutral-color-80'),
    fontFamily: vars('typography-font-text'),
    fontSize: vars(`text-${level}-size` as 'text-df-size'),
    lineHeight: vars(`text-${level}-line-height` as 'text-df-line-height'),
  });
}
