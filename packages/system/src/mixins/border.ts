import { DeclarationBlock } from '@aesthetic/sss';
import { Tokens, BorderSize } from '../types';
import { LAYOUT_SHADES } from '../constants';

export function border({ border: b, palette }: Tokens, size: BorderSize): DeclarationBlock {
  const { width, radius } = b[size];

  return {
    borderColor: palette.neutral.color[LAYOUT_SHADES.border],
    borderRadius: radius,
    borderStyle: 'solid',
    borderWidth: width,

    ':focus': {
      borderColor: palette.primary.bg.focused,
    },

    ':hover': {
      borderColor: palette.primary.bg.hovered,
    },

    ':active': {
      borderColor: palette.primary.bg.selected,
    },

    '[disabled]': {
      borderColor: palette.primary.bg.disabled,
    },
  };
}
