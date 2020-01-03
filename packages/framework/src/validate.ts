import { number, string, union } from 'optimal';
import { SCALES } from './constants';
import { Scale, ScaleType } from './types';

export function hexcode() {
  return string()
    .required()
    .match(/^#([0-9a-f]{6}|[0-9a-f]{3})$/iu);
}

export function scale(defaultValue: Scale = 'major-third') {
  return union<Scale>(
    [number().gte(0), string<ScaleType>().oneOf(Object.keys(SCALES) as ScaleType[])],
    defaultValue,
  );
}

export function unit(defaultValue: number = 0) {
  return number(defaultValue).gte(0);
}
