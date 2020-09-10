import { Rule } from '@aesthetic/types';
import { deepMerge } from '@aesthetic/utils';
import { Utilities } from '../types';
import { checkList } from './checks';

export interface HeadingOptions {
  level: 1 | 2 | 3 | 4 | 5 | 6;
}

export function heading(this: Utilities, { level }: HeadingOptions): Rule {
  if (__DEV__) {
    checkList('level', level, [1, 2, 3, 4, 5, 6]);
  }

  return deepMerge(this.mixin.resetTypography(), {
    color: this.var('palette-neutral-fg-base'),
    letterSpacing: this.var(`heading-l${level}-letter-spacing` as 'heading-l1-letter-spacing'),
    lineHeight: this.var(`heading-l${level}-line-height` as 'heading-l1-line-height'),
    fontFamily: this.var('typography-font-heading'),
    fontSize: this.var(`heading-l${level}-size` as 'heading-l1-size'),
  });
}
