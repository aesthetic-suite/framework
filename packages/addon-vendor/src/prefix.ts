import { arrayLoop } from '@aesthetic/utils';
import { declarationMapping } from './data';
import getPrefixesFromMask from './getPrefixesFromMask';
import isPrefixed from './isPrefixed';
import prefixValue from './prefixValue';
import prefixValueFunction from './prefixValueFunction';

export default function prefix(key: string, value: string): Record<string, string> {
  const map = declarationMapping[key];
  const prefixed: Record<string, string> = {};

  if (!map || isPrefixed(key)) {
    return prefixed;
  }

  const { prefixes: mask, functions, values } = map;
  let nextValue: string[];

  if (functions) {
    nextValue = prefixValueFunction(value, functions);
  } else if (values) {
    nextValue = prefixValue(value, values);
  } else {
    nextValue = [value];
  }

  // Prefixed properties come first
  getPrefixesFromMask(mask).forEach((affix) => {
    arrayLoop(nextValue, (val) => {
      prefixed[affix + key] = val;
    });
  });

  // Base property comes last
  arrayLoop(nextValue, (val) => {
    prefixed[key] = val;
  });

  return prefixed;
}
