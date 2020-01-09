import { SCALES } from './constants';
import { Unit, Scale } from './types';

export function formatUnit(value: number): string {
  return value.toFixed(2).replace('.00', '');
}

export function toPx(value: number): Unit {
  return `${formatUnit(value)}px`;
}

export function toRem(value: number, rootSize: number): Unit {
  return `${formatUnit(Math.max(value, 0) / rootSize)}rem`;
}

function scale(accumulator: number, scaling: Scale, type: 'up' | 'down'): number {
  const factor = (typeof scaling === 'number' ? scaling : SCALES[scaling]) ?? 0;

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
