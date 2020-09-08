import { Declarations } from '@aesthetic/types';
import { BorderSize, VarUtil } from '../types';

export function border(vars: VarUtil, size: BorderSize): Declarations {
  return {
    borderColor: vars('palette-neutral-color-40'),
    borderRadius: vars(`border-${size}-radius` as 'border-df-radius'),
    borderStyle: 'solid',
    borderWidth: vars(`border-${size}-width` as 'border-df-width'),

    // ':focus': {
    //   borderColor: vars('palette-primary-bg-focused'),
    // },

    // ':hover': {
    //   borderColor: vars('palette-primary-bg-hovered'),
    // },

    // ':active': {
    //   borderColor: vars('palette-primary-bg-selected'),
    // },

    // '[disabled]': {
    //   borderColor: vars('palette-primary-bg-disabled'),
    // },
  };
}
