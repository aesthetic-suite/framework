import isUnitlessProperty from './isUnitlessProperty';
import { Value } from '../types';

export default function applyUnitToValue(property: string, value: Value, unit: string): string {
  if (typeof value === 'string') {
    return value;
  }

  if (isUnitlessProperty(property) || value === 0) {
    return String(value);
  }

  return value + unit;
}
