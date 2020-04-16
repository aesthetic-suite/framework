import { DeclarationBlock } from '@aesthetic/sss';
import { deepMerge } from '@aesthetic/utils';
import { border } from './border';
import { BorderSize, VarUtil } from '../types';
import { LAYOUT_SHADES } from '../constants';

export function box(vars: VarUtil, size: BorderSize): DeclarationBlock {
  return deepMerge(
    {
      backgroundColor: vars(
        `palette-neutral-color-${LAYOUT_SHADES.box}` as 'palette-neutral-color-10',
      ),
    },
    border(vars, size),
  );
}
