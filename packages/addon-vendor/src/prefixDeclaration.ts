/* eslint-disable no-param-reassign */

import { GenericProperties, Value } from '@aesthetic/types';
import { declarationMapping } from './data';
import getPrefixesFromMask from './getPrefixesFromMask';
import isPrefixed from './isPrefixed';
import prefixValue from './prefixValue';
import prefixValueFunction from './prefixValueFunction';

export default function prefixDeclaration(props: GenericProperties, key: string, value: Value) {
  const map = declarationMapping[key];

  if (!map || isPrefixed(key)) {
    return;
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
    props[affix + key] = nextValue;
  });

  // Base property comes last
  props[key] = nextValue;
}
