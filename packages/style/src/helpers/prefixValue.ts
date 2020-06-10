import { Value } from '@aesthetic/types';
import getPrefixesFromMask from './getPrefixesFromMask';
import { PrefixMap } from '../types';

export default function prefixValue(value: Value, values: PrefixMap): Value | Value[] {
  const mask = values[value];

  if (typeof value === 'number' || !mask) {
    return value;
  }

  return [
    ...getPrefixesFromMask(values[value]).map((prefix) => prefix + value),
    // Modern value must be last
    value,
  ];
}
