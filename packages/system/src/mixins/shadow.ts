import { Declarations } from '@aesthetic/types';
import { ShadowSize, VarUtil } from '../types';
import { LAYOUT_SHADES } from '../constants';

export function shadow(vars: VarUtil, size: ShadowSize): Declarations {
  return {
    boxShadow: [
      vars(`shadow-${size}-x` as 'shadow-sm-x'),
      vars(`shadow-${size}-y` as 'shadow-sm-y'),
      vars(`shadow-${size}-blur` as 'shadow-sm-blur'),
      vars(`shadow-${size}-spread` as 'shadow-sm-spread'),
      vars(`palette-neutral-color-${LAYOUT_SHADES.shadow}` as 'palette-neutral-color-90'),
    ].join(' '),
  };
}
