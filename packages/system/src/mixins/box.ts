import { DeclarationBlock } from '@aesthetic/sss';
import { border } from './border';
import { Tokens, BorderSize } from '../types';

export function box(tokens: Tokens, size: BorderSize): DeclarationBlock {
  return {
    ...border(tokens, size),
    backgroundColor: tokens.ui.box.base,
  };
}
