import { LocalBlock } from '@aesthetic/sss';
import { Utilities } from '@aesthetic/system';
import { checkList } from './checks';
import { BackgroundOptions } from './types';

export function background(
  this: Utilities<LocalBlock>,
  { palette = 'neutral' }: BackgroundOptions = {},
): LocalBlock {
  if (__DEV__) {
    checkList('palette', palette, Object.keys(this.tokens.palette));
  }

  return {
    backgroundColor: this.var(`palette-${palette}-bg-base` as 'palette-neutral-bg-base'),
  };
}
