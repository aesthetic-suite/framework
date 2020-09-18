import { Value, Properties, GenericProperties } from '@aesthetic/types';
import { objectLoop } from '@aesthetic/utils';
import { getPropertyDoppelganger, getValueDoppelganger } from 'rtl-css-js/core';
import { ProcessOptions } from '../types';

/**
 * Apply vendor prefixes and RTL conversions to a block of properties.
 *
 * @link https://css-tricks.com/ordering-css3-properties/
 * @link https://css-tricks.com/how-to-deal-with-vendor-prefixes/
 */
export default function processProperties(
  properties: Properties,
  { vendor, rtl }: ProcessOptions = {},
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

    // Set the value after direction change but before prefixing
    props[prop] = value;

    // Inject vendor prefixes
    vendor?.prefixDeclaration(props, prop, value);
  });

  return props;
}
