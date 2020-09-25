import { LocalBlock } from '@aesthetic/sss';
import { Utilities, SHADE_RANGES } from '@aesthetic/system';
import { checkList } from './checks';
import { BorderOptions } from './types';

export function border(
  this: Utilities<LocalBlock>,
  { palette = 'neutral', radius = true, shade = '40', size = 'df' }: BorderOptions = {},
): LocalBlock {
  if (__DEV__) {
    checkList('palette', palette, Object.keys(this.tokens.palette));
    checkList('shade', shade, SHADE_RANGES);
    checkList('size', size, Object.keys(this.tokens.border));
  }

  const rule: LocalBlock = {
    borderColor: this.var(`palette-${palette}-color-${shade}` as 'palette-neutral-color-00'),
    borderStyle: 'solid',
    borderWidth: this.var(`border-${size}-width` as 'border-df-width'),
  };

  if (radius) {
    rule.borderRadius = this.var(`border-${size}-radius` as 'border-df-radius');
  }

  return rule;
}
