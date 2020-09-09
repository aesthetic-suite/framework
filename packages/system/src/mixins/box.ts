import { Rule } from '@aesthetic/types';
import { deepMerge } from '@aesthetic/utils';
import { border } from './border';
import { BorderSize, VarUtil } from '../types';

export function box(v: VarUtil, size: BorderSize): Rule {
  return deepMerge(
    {
      backgroundColor: v('palette-neutral-bg-base'),
    },
    border(v, size),
  );
}
