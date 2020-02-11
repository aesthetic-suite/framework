import { DeclarationBlock } from '@aesthetic/sss';
import { border } from './border';
import { Tokens, BorderSize } from '../types';
import { LAYOUT_SHADES } from '../constants';

export function box(tokens: Tokens, size: BorderSize): DeclarationBlock {
  return {
    ...border(tokens, size),
    backgroundColor: tokens.palette.neutral.color[LAYOUT_SHADES.box],
  };
}
