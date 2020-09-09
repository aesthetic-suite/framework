import { Rule } from '@aesthetic/types';
import { BorderSize, VarUtil } from '../types';

export function border(v: VarUtil, size: BorderSize): Rule {
  return {
    borderRadius: v(`border-${size}-radius` as 'border-df-radius'),
    borderStyle: 'solid',
    borderWidth: v(`border-${size}-width` as 'border-df-width'),
  };
}
