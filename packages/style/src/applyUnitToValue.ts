import { isUnitlessProperty } from 'css-in-js-utils';
import { Value } from './types';

export default function applyUnitToValue(property: string, value: Value): string {
  if (typeof value === 'string') {
    return value;
  }

  if (isUnitlessProperty(property) || value === 0) {
    return String(value);
  }

  return `${value}px`;
}
