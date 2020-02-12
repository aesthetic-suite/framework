import { isUnitlessProperty } from 'css-in-js-utils';
import { Value } from './types';

export default function applyUnitToValue(property: string, value: Value): Value {
  if (typeof property === 'string' || isUnitlessProperty(property)) {
    return value;
  }

  return `${value}px`;
}
