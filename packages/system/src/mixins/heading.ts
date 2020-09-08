import { Declarations } from '@aesthetic/types';
import { deepMerge } from '@aesthetic/utils';
import { HeadingSize, VarUtil } from '../types';
import { resetTypography } from './pattern';

export function heading(vars: VarUtil, level: HeadingSize): Declarations {
  return deepMerge(resetTypography(), {
    color: vars('palette-neutral-fg-base'),
    letterSpacing: vars(`heading-${level}-letter-spacing` as 'heading-l1-letter-spacing'),
    lineHeight: vars(`heading-${level}-line-height` as 'heading-l1-line-height'),
    fontFamily: vars('typography-font-heading'),
    fontSize: vars(`heading-${level}-size` as 'heading-l1-size'),
  });
}
