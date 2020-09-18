import { GenericProperties, Value } from '@aesthetic/types';
import { declarationMapping } from './data';
import getPrefixesFromMask from './getPrefixesFromMask';
import isPrefixed from './isPrefixed';
import prefixValue from './prefixValue';
import prefixValueFunction from './prefixValueFunction';

export default function prefix(key: string, value: Value): GenericProperties {
  const map = declarationMapping[key];
  const prefixed: GenericProperties = {};

  if (!map || isPrefixed(key)) {
    return prefixed;
  }

  const { prefixes: mask, functions, values } = map;
  let nextValue: Value | Value[] = value;

  if (functions) {
    nextValue = prefixValueFunction(nextValue, functions);
  } else if (values) {
    nextValue = prefixValue(nextValue, values);
  }

  // Prefixed properties come first
  getPrefixesFromMask(mask).forEach((affix) => {
    prefixed[affix + key] = nextValue;
  });

  // Base property comes last
  prefixed[key] = nextValue;

  return prefixed;
}
