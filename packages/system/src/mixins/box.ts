import { Rule } from '@aesthetic/types';
import { deepMerge } from '@aesthetic/utils';
import { border } from './border';
import { BorderSize, VarUtil } from '../types';

export function box(vars: VarUtil, size: BorderSize): Rule {
  return deepMerge(
    {
      backgroundColor: vars('palette-neutral-bg-base'),
    },
    border(vars, size),
  );
}
