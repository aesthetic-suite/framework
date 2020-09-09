import { Rule } from '@aesthetic/types';
import { deepMerge } from '@aesthetic/utils';
import { HeadingSize, VarUtil } from '../types';
import { resetTypography } from './pattern';

export function heading(v: VarUtil, level: HeadingSize): Rule {
  return deepMerge(resetTypography(), {
    color: v('palette-neutral-fg-base'),
    letterSpacing: v(`heading-${level}-letter-spacing` as 'heading-l1-letter-spacing'),
    lineHeight: v(`heading-${level}-line-height` as 'heading-l1-line-height'),
    fontFamily: v('typography-font-heading'),
    fontSize: v(`heading-${level}-size` as 'heading-l1-size'),
  });
}
