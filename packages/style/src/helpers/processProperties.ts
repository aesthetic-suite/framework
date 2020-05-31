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
 *
 * @link https://css-tricks.com/ordering-css3-properties/
 * @link https://css-tricks.com/how-to-deal-with-vendor-prefixes/
 */
export default function processProperties(
  properties: Properties,
  { prefix, rtl }: ProcessParams = {},
): GenericProperties {
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

      // Prefixed properties come first
      getPrefixesFromMask(mask).forEach((pre) => {
        props[pre + prop] = nextValue;
      });

      // Base property comes last
      props[prop] = nextValue;
    } else {
      props[prop] = value;
    }
  });

  return props;
}
