import { Rule } from '@aesthetic/types';
import { isObject } from '@aesthetic/utils';
import { Utilities } from '@aesthetic/system';
import { UIBoxOptions, UIInteractiveOptions } from './types';

export function uiBox(
  this: Utilities,
  { border = true, palette = 'neutral', shadow = true }: UIBoxOptions,
): Rule {
  const rule: Rule = this.mixin.background({ palette });

  if (border) {
    Object.assign(
      rule,
      this.mixin.border({
        // Inherit same color as box by default
        palette,
        ...(isObject(border) ? border : {}),
      }),
    );
  }

  if (shadow) {
    Object.assign(rule, this.mixin.shadow(isObject(shadow) ? shadow : {}));
  }

  return rule;
}

export function uiInteractive(
  this: Utilities,
  { palette = 'neutral' }: UIInteractiveOptions,
): Rule {
  return {
    color: this.var(`palette-${palette}-color-00` as 'palette-neutral-color-00'),
    backgroundColor: this.var(`palette-${palette}-color-40` as 'palette-neutral-color-40'),
    borderColor: this.var(`palette-${palette}-color-50` as 'palette-neutral-color-50'),
    cursor: 'pointer',

    ':focus': {
      borderColor: this.var(`palette-${palette}-color-60` as 'palette-neutral-color-60'),
    },

    ':hover': {
      backgroundColor: this.var(`palette-${palette}-color-60` as 'palette-neutral-color-60'),
      borderColor: this.var(`palette-${palette}-color-70` as 'palette-neutral-color-70'),
    },

    ':active': {
      backgroundColor: this.var(`palette-${palette}-color-50` as 'palette-neutral-color-50'),
      borderColor: this.var(`palette-${palette}-color-60` as 'palette-neutral-color-60'),
    },

    ':disabled': {
      backgroundColor: this.var(`palette-${palette}-color-20` as 'palette-neutral-color-20'),
      borderColor: this.var(`palette-${palette}-color-30` as 'palette-neutral-color-30'),
      cursor: 'default',
    },
  };
}
