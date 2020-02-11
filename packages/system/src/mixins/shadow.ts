import { DeclarationBlock } from '@aesthetic/sss';
import { Tokens, ShadowSize } from '../types';
import { LAYOUT_SHADES } from '../constants';

export function shadow(tokens: Tokens, size: ShadowSize): DeclarationBlock {
  const { x, y, blur, spread } = tokens.shadow[size];

  return {
    boxShadow: `${x} ${y} ${blur} ${spread} ${tokens.palette.neutral.color[LAYOUT_SHADES.shadow]}`,
  };
}
