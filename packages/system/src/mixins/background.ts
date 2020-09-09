import { Rule } from '@aesthetic/types';
import { VarUtil, PaletteType } from '../types';

export function background(vars: VarUtil, palette: PaletteType): Rule {
  return {
    backgroundColor: vars(`palette-${palette}-bg-base` as 'palette-neutral-bg-base'),
  };
}
