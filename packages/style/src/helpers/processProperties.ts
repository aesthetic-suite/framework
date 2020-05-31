import { objectLoop } from '@aesthetic/utils';
import { getPropertyDoppelganger, getValueDoppelganger } from 'rtl-css-js/core';
import { declarationMapping } from '../data/prefixes';
import getPrefixesFromMask from './getPrefixesFromMask';
import isPrefixedProperty from './isPrefixedProperty';
import prefixValueFunction from './prefixValueFunction';
import prefixValue from './prefixValue';
import { Properties, ProcessParams, GenericProperties, Value } from '../types';

/**
 * Apply vendor prefixes and RTL conversions to a block of properties.
 */
export default function processProperties(
  properties: Properties,
  { prefix, rtl }: ProcessParams = {},
): GenericProperties {
  if (!prefix && !rtl) {
    return properties as GenericProperties;
  }

  const props: GenericProperties = {};

  objectLoop(properties, (val, key) => {
    if (val === undefined) {
      return;
    }

    let prop: string = key;
    let value: Value = val;

    // Convert left to right
    if (rtl) {
      prop = getPropertyDoppelganger(prop);
      value = getValueDoppelganger(prop, value);
    }

    // Set the value in case we dont need prefixing
    props[prop] = value;

    // Inject vendor prefixed variants
    const map = declarationMapping[prop];

    if (prefix && map && !isPrefixedProperty(prop)) {
      const { prefixes: mask, functions, values } = map;
      let nextValue: Value | Value[] = value;

      if (functions) {
        nextValue = prefixValueFunction(nextValue, functions);
      } else if (values) {
        nextValue = prefixValue(nextValue, values);
      }

      // Base property comes first
      props[prop] = nextValue;

      // Prefixed properties come after
      getPrefixesFromMask(mask).forEach((pre) => {
        props[pre + prop] = nextValue;
      });
    }
  });

  return props;
}
