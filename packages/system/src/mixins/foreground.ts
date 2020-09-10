import { Rule } from '@aesthetic/types';
import { PaletteType, Utilities } from '../types';
import { checkList } from './checks';
import { PALETTE_TYPES } from '../constants';

export interface ForegroundOptions {
  palette?: PaletteType;
}

export function foreground(this: Utilities, { palette = 'neutral' }: ForegroundOptions = {}): Rule {
  if (__DEV__) {
    checkList('palette', palette, PALETTE_TYPES);
  }

  return {
    color: this.var(`palette-${palette}-fg-base` as 'palette-neutral-fg-base'),
  };
}
