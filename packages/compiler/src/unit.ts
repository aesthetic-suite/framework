import { Unit } from '@aesthetic/system';

export function formatUnit(value: number): string {
  return value.toFixed(2).replace('.00', '');
}

export function toPx(value: number): Unit {
  return `${formatUnit(value)}px`;
}

export function toRem(value: number, rootSize: number): Unit {
  return `${formatUnit(Math.max(value, 0) / rootSize)}rem`;
}
