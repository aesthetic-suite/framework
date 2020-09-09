import { Rule } from '@aesthetic/types';
import { VarUtil, PaletteType } from '../types';

export function foreground(vars: VarUtil, palette: PaletteType): Rule {
  return {
    color: vars(`palette-${palette}-fg-base` as 'palette-neutral-fg-base'),
  };
}
