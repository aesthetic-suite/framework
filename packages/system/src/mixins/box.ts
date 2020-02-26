import { DeclarationBlock } from '@aesthetic/sss';
import { border } from './border';
import { BorderSize, VarFactory } from '../types';
import { LAYOUT_SHADES } from '../constants';

export function box(vars: VarFactory, size: BorderSize): DeclarationBlock {
  return {
    ...border(vars, size),
    backgroundColor: vars(
      `palette-neutral-color-${LAYOUT_SHADES.box}` as 'palette-neutral-color-10',
    ),
  };
}
