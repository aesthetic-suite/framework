import { DeclarationBlock } from '@aesthetic/sss';
import { BorderSize, VarUtil } from '../types';
import { LAYOUT_SHADES } from '../constants';

export function border(vars: VarUtil, size: BorderSize): DeclarationBlock {
  return {
    borderColor: vars(
      `palette-neutral-color-${LAYOUT_SHADES.border}` as 'palette-neutral-color-30',
    ),
    borderRadius: vars(`border-${size}-radius` as 'border-df-radius'),
    borderStyle: 'solid',
    borderWidth: vars(`border-${size}-width` as 'border-df-width'),

    ':focus': {
      borderColor: vars('palette-primary-bg-focused'),
    },

    ':hover': {
      borderColor: vars('palette-primary-bg-hovered'),
    },

    ':active': {
      borderColor: vars('palette-primary-bg-selected'),
    },

    '[disabled]': {
      borderColor: vars('palette-primary-bg-disabled'),
    },
  };
}
