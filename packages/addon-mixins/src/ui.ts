import { LocalBlock } from '@aesthetic/sss';
import { Utilities } from '@aesthetic/system';
import { isObject } from '@aesthetic/utils';
import { checkList } from './checks';
import { UIBoxOptions, UIInteractiveOptions } from './types';

export function uiBox(
  this: Utilities<LocalBlock>,
  { border = true, palette = 'neutral', shadow = true }: UIBoxOptions,
): LocalBlock {
  if (__DEV__) {
    checkList('palette', palette, Object.keys(this.tokens.palette));
  }

  const rule = this.mixin.background({ palette }, {});

  if (border) {
    Object.assign(
      rule,
      this.mixin.border(
        {
          // Inherit same color as box by default
          palette,
          ...(isObject(border) ? border : {}),
        },
        {},
      ),
    );
  }

  if (shadow) {
    Object.assign(rule, this.mixin.shadow(isObject(shadow) ? shadow : {}, {}));
  }

  return rule;
}

export function uiInteractive(
  this: Utilities<LocalBlock>,
  { palette = 'neutral' }: UIInteractiveOptions,
): LocalBlock {
  if (__DEV__) {
    checkList('palette', palette, Object.keys(this.tokens.palette));
  }

  return {
    color: this.var(`palette-${palette}-fg-base` as 'palette-neutral-fg-base'),
    backgroundColor: this.var(`palette-${palette}-bg-base` as 'palette-neutral-bg-base'),
    borderColor: this.var(`palette-${palette}-color-50` as 'palette-neutral-color-50'),
    cursor: 'pointer',

    ':focus': {
      color: this.var(`palette-${palette}-fg-focused` as 'palette-neutral-fg-focused'),
      backgroundColor: this.var(`palette-${palette}-bg-focused` as 'palette-neutral-bg-focused'),
      borderColor: this.var(`palette-${palette}-color-60` as 'palette-neutral-color-60'),
    },

    ':hover': {
      color: this.var(`palette-${palette}-fg-hovered` as 'palette-neutral-fg-hovered'),
      backgroundColor: this.var(`palette-${palette}-bg-hovered` as 'palette-neutral-bg-hovered'),
      borderColor: this.var(`palette-${palette}-color-70` as 'palette-neutral-color-70'),
    },

    ':active': {
      color: this.var(`palette-${palette}-fg-selected` as 'palette-neutral-fg-selected'),
      backgroundColor: this.var(`palette-${palette}-bg-selected` as 'palette-neutral-bg-selected'),
      borderColor: this.var(`palette-${palette}-color-60` as 'palette-neutral-color-60'),
    },

    ':disabled': {
      color: this.var(`palette-${palette}-fg-disabled` as 'palette-neutral-fg-disabled'),
      backgroundColor: this.var(`palette-${palette}-bg-disabled` as 'palette-neutral-bg-disabled'),
      borderColor: this.var(`palette-${palette}-color-30` as 'palette-neutral-color-30'),
      cursor: 'default',
    },
  };
}
