import { LocalBlock } from '@aesthetic/sss';
import { Utilities } from '@aesthetic/system';
import { checkList } from './checks';
import { HeadingOptions } from './types';

export function heading(
  this: Utilities<LocalBlock>,
  { level = 1 }: HeadingOptions = {},
): LocalBlock {
  if (__DEV__) {
    checkList(
      'level',
      level,
      Object.keys(this.tokens.heading).map((l) => Number(l.slice(1))),
    );
  }

  return this.mixin.resetTypography({
    color: this.var('palette-neutral-text'),
    letterSpacing: this.var(`heading-l${level}-letter-spacing` as 'heading-l1-letter-spacing'),
    lineHeight: this.var(`heading-l${level}-line-height` as 'heading-l1-line-height'),
    fontFamily: this.var('typography-font-heading'),
    fontSize: this.var(`heading-l${level}-size` as 'heading-l1-size'),
  });
}
