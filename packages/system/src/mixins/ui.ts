import { Rule } from '@aesthetic/types';
import { VarUtil, PaletteType } from '../types';

export function button(v: VarUtil, palette: PaletteType): Rule {
  return {
    color: v(`palette-${palette}-color-00` as 'palette-neutral-color-00'),
    backgroundColor: v(`palette-${palette}-color-40` as 'palette-primary-color-40'),
    borderColor: v(`palette-${palette}-color-50` as 'palette-primary-color-50'),

    ':focus': {
      borderColor: v(`palette-${palette}-color-60` as 'palette-primary-color-60'),
    },

    ':hover': {
      backgroundColor: v(`palette-${palette}-color-60` as 'palette-primary-color-60'),
      borderColor: v(`palette-${palette}-color-70` as 'palette-primary-color-70'),
    },

    ':active': {
      backgroundColor: v(`palette-${palette}-color-50` as 'palette-primary-color-50'),
      borderColor: v(`palette-${palette}-color-60` as 'palette-primary-color-60'),
    },

    ':disabled': {
      backgroundColor: v(`palette-${palette}-color-20` as 'palette-primary-color-20'),
      borderColor: v(`palette-${palette}-color-30` as 'palette-primary-color-30'),
    },
  };
}
