import { SCALES } from './constants';
import { PxUnit, RemUnit, Scale } from './types';

export function unit(value: number): string {
  return value.toFixed(2).replace('.00', '');
}

export function toPx(value: number): PxUnit {
  return `${unit(value)}px`;
}

export function toRem(value: number, rootSize: number): RemUnit {
  return `${unit(Math.max(value, 0) / rootSize)}rem`;
}

export function scale(accumulator: number, scaling: Scale, type: 'up' | 'down'): number {
  const factor = typeof scaling === 'number' ? scaling : SCALES[scaling];

  if (factor === 0) {
    return accumulator;
  }

  return type === 'up' ? accumulator * factor : accumulator / factor;
}

export function scaleDown(accumulator: number, scaling: Scale): number {
  return scale(accumulator, scaling, 'down');
}

export function scaleUp(accumulator: number, scaling: Scale): number {
  return scale(accumulator, scaling, 'up');
}
