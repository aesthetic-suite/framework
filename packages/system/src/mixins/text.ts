import { Rule } from '@aesthetic/types';
import { deepMerge } from '@aesthetic/utils';
import { TextSize, VarUtil } from '../types';
import { resetTypography } from './pattern';

export function text(vars: VarUtil, level: TextSize): Rule {
  return deepMerge(resetTypography(), {
    color: vars('palette-neutral-fg-base'),
    fontFamily: vars('typography-font-text'),
    fontSize: vars(`text-${level}-size` as 'text-df-size'),
    lineHeight: vars(`text-${level}-line-height` as 'text-df-line-height'),
  });
}
