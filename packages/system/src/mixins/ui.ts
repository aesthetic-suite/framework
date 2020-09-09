import { Rule } from '@aesthetic/types';
import { deepMerge } from '@aesthetic/utils';
import { border } from './border';
import { VarUtil, PaletteType } from '../types';
import { background } from './background';

export function box(v: VarUtil, palette: PaletteType): Rule {
  return deepMerge(background(v, palette), border(v, 'df'), {
    // Usually a step higher than base
    borderColor: v(`palette-${palette}-bg-focused` as 'palette-neutral-bg-focused'),
  });
}

export function button(v: VarUtil, palette: PaletteType): Rule {
  return {
    color: v(`palette-${palette}-color-00` as 'palette-neutral-color-00'),
    backgroundColor: v(`palette-${palette}-color-40` as 'palette-neutral-color-40'),
    borderColor: v(`palette-${palette}-color-50` as 'palette-neutral-color-50'),

    ':focus': {
      borderColor: v(`palette-${palette}-color-60` as 'palette-neutral-color-60'),
    },

    ':hover': {
      backgroundColor: v(`palette-${palette}-color-60` as 'palette-neutral-color-60'),
      borderColor: v(`palette-${palette}-color-70` as 'palette-neutral-color-70'),
    },

    ':active': {
      backgroundColor: v(`palette-${palette}-color-50` as 'palette-neutral-color-50'),
      borderColor: v(`palette-${palette}-color-60` as 'palette-neutral-color-60'),
    },

    ':disabled': {
      backgroundColor: v(`palette-${palette}-color-20` as 'palette-neutral-color-20'),
      borderColor: v(`palette-${palette}-color-30` as 'palette-neutral-color-30'),
    },
  };
}
