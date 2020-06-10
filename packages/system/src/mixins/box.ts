import { Declarations } from '@aesthetic/types';
import { deepMerge } from '@aesthetic/utils';
import { border } from './border';
import { BorderSize, VarUtil } from '../types';
import { LAYOUT_SHADES } from '../constants';

export function box(vars: VarUtil, size: BorderSize): Declarations {
  return deepMerge(
    {
      backgroundColor: vars(
        `palette-neutral-color-${LAYOUT_SHADES.box}` as 'palette-neutral-color-10',
      ),
    },
    border(vars, size),
  );
}
