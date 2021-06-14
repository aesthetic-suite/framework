import { arrayLoop, objectLoop } from '@aesthetic/utils';
import getPrefixesFromMask from './getPrefixesFromMask';
import { PrefixMap } from './types';

export default function prefixValueFunction(value: string, functions: PrefixMap): string[] {
  const nextValue: string[] = [];

  objectLoop(functions, (mask, func) => {
    const regex = new RegExp(`${func}\\(`, 'gu');

    if (regex.test(value)) {
      arrayLoop(getPrefixesFromMask(mask), (prefix) => {
        nextValue.push(value.replace(regex, `${prefix}${func}(`));
      });
    }
  });

  // Modern value must be last
  nextValue.push(value);

  return nextValue;
}
