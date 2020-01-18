import { DeclarationBlock } from '@aesthetic/sss';
import { Tokens, BorderSize } from '../types';

export function border({ border: b, ui }: Tokens, size: BorderSize): DeclarationBlock {
  const { width, radius } = b[size];

  return {
    borderColor: ui.border.base,
    borderRadius: radius,
    borderStyle: 'solid',
    borderWidth: width,

    ':focus': {
      borderColor: ui.border.focused,
    },

    ':hover': {
      borderColor: ui.border.hovered,
    },

    ':active': {
      borderColor: ui.border.selected,
    },

    '[disabled]': {
      borderColor: ui.border.disabled,
    },
  };
}
