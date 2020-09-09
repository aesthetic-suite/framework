import { Rule } from '@aesthetic/types';
import { VarUtil, PaletteType } from '../types';

export function background(v: VarUtil, palette: PaletteType): Rule {
  return {
    backgroundColor: v(`palette-${palette}-bg-base` as 'palette-neutral-bg-base'),
  };
}
