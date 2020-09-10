import { Rule } from '@aesthetic/types';
import { PaletteType, Utilities } from '../types';
import { checkList } from './checks';
import { PALETTE_TYPES } from '../constants';

export interface BackgroundOptions {
  palette: PaletteType;
}

export function background(this: Utilities, { palette }: BackgroundOptions): Rule {
  if (__DEV__) {
    checkList('palette', palette, PALETTE_TYPES);
  }

  return {
    backgroundColor: this.var(`palette-${palette}-bg-base` as 'palette-neutral-bg-base'),
  };
}
