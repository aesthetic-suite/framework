import { Rule } from '@aesthetic/types';
import { ShadowSize, VarUtil } from '../types';

export function shadow(v: VarUtil, size: ShadowSize): Rule {
  return {
    boxShadow: [
      v(`shadow-${size}-x` as 'shadow-sm-x'),
      v(`shadow-${size}-y` as 'shadow-sm-y'),
      v(`shadow-${size}-blur` as 'shadow-sm-blur'),
      v(`shadow-${size}-spread` as 'shadow-sm-spread'),
      v('palette-neutral-color-90'),
    ].join(' '),
  };
}
