import { DeclarationBlock } from '@aesthetic/sss';
import { Tokens, ShadowSize } from '../types';

export function shadow(tokens: Tokens, size: ShadowSize): DeclarationBlock {
  const { x, y, blur, spread } = tokens.shadows[size];

  return {
    boxShadow: `${x} ${y} ${blur} ${spread} ${tokens.ui.shadow.base}`,
  };
}
