import { Rule } from '@aesthetic/types';
import { VarUtil, PaletteType } from '../types';

export function foreground(v: VarUtil, palette: PaletteType): Rule {
  return {
    color: v(`palette-${palette}-fg-base` as 'palette-neutral-fg-base'),
  };
}
