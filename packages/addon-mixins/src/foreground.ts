import { LocalBlock } from '@aesthetic/sss';
import { Utilities, PALETTE_TYPES } from '@aesthetic/system';
import { checkList } from './checks';
import { ForegroundOptions } from './types';

export function foreground(
  this: Utilities<LocalBlock>,
  { palette = 'neutral' }: ForegroundOptions = {},
): LocalBlock {
  if (__DEV__) {
    checkList('palette', palette, PALETTE_TYPES);
  }

  return {
    color: this.var(`palette-${palette}-fg-base` as 'palette-neutral-fg-base'),
  };
}
