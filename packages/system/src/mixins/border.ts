import { Rule } from '@aesthetic/types';
import { BorderSize, VarUtil } from '../types';

export function border(v: VarUtil, size: BorderSize): Rule {
  return {
    borderColor: v('palette-neutral-color-40'),
    borderRadius: v(`border-${size}-radius` as 'border-df-radius'),
    borderStyle: 'solid',
    borderWidth: v(`border-${size}-width` as 'border-df-width'),
  };
}
