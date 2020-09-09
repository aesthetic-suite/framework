import { Rule } from '@aesthetic/types';
import { deepMerge } from '@aesthetic/utils';
import { TextSize, VarUtil } from '../types';
import { resetTypography } from './pattern';

export function text(v: VarUtil, level: TextSize): Rule {
  return deepMerge(resetTypography(), {
    color: v('palette-neutral-fg-base'),
    fontFamily: v('typography-font-text'),
    fontSize: v(`text-${level}-size` as 'text-df-size'),
    lineHeight: v(`text-${level}-line-height` as 'text-df-line-height'),
  });
}
