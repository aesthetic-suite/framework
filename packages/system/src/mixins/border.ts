import { Rule } from '@aesthetic/types';
import { BorderSize, VarUtil } from '../types';

export function border(vars: VarUtil, size: BorderSize): Rule {
  return {
    borderColor: vars('palette-neutral-color-40'),
    borderRadius: vars(`border-${size}-radius` as 'border-df-radius'),
    borderStyle: 'solid',
    borderWidth: vars(`border-${size}-width` as 'border-df-width'),
  };
}
