import { Value } from '@aesthetic/types';
import { objectLoop } from '@aesthetic/utils';
import getPrefixesFromMask from './getPrefixesFromMask';
import { PrefixMap } from '../types';

export default function prefixValueFunction(value: Value, functions: PrefixMap): Value | Value[] {
  if (typeof value === 'number') {
    return value;
  }

  const nextValue: Value[] = [];

  objectLoop(functions, (mask, func) => {
    const regex = new RegExp(`${func}\\(`, 'gu');

    if (regex.test(value)) {
      getPrefixesFromMask(mask).forEach((prefix) => {
        nextValue.push(value.replace(regex, `${prefix}${func}(`));
      });
    }
  });

  // Modern value must be last
  nextValue.push(value);

  return nextValue.length === 1 ? nextValue[0] : nextValue;
}
