import { LocalBlock } from '@aesthetic/sss';
import { Utilities, SHADE_RANGES } from '@aesthetic/system';
import { checkList } from './checks';
import { ShadowOptions } from './types';

export function shadow(
  this: Utilities<LocalBlock>,
  { palette = 'neutral', shade = '90', size = 'md' }: ShadowOptions = {},
): LocalBlock {
  if (__DEV__) {
    checkList('palette', palette, Object.keys(this.tokens.palette));
    checkList('shade', shade, SHADE_RANGES);
    checkList('size', size, Object.keys(this.tokens.shadow));
  }

  return {
    boxShadow: [
      this.var(`shadow-${size}-x` as 'shadow-sm-x'),
      this.var(`shadow-${size}-y` as 'shadow-sm-y'),
      this.var(`shadow-${size}-blur` as 'shadow-sm-blur'),
      this.var(`shadow-${size}-spread` as 'shadow-sm-spread'),
      this.var(`palette-${palette}-color-${shade}` as 'palette-neutral-color-90'),
    ].join(' '),
  };
}
