import { NativeProperty } from '@aesthetic/types';
import isUnitlessProperty from './isUnitlessProperty';
import { ProcessOptions } from '../types';

export default function processValue<T extends unknown>(
  property: string,
  value: T,
  unit: ProcessOptions['unit'],
): T extends unknown[] ? string[] : string {
  if (typeof value === 'string') {
    return value;
  }

  if (isUnitlessProperty(property) || value === 0) {
    return String(value);
  }

  const suffix = typeof unit === 'function' ? unit(property as NativeProperty) : unit;

  return value + (suffix || 'px');
}
