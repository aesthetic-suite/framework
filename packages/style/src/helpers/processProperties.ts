import { Value, Properties, GenericProperties } from '@aesthetic/types';
import { objectLoop } from '@aesthetic/utils';
import { API, ProcessOptions } from '../types';

/**
 * Apply vendor prefixes and RTL conversions to a block of properties.
 *
 * @link https://css-tricks.com/ordering-css3-properties/
 * @link https://css-tricks.com/how-to-deal-with-vendor-prefixes/
 */
export default function processProperties(
  properties: Properties,
  { direction, vendor }: ProcessOptions,
  { direction: baseDirection, converter, prefixer }: API,
): GenericProperties {
  const props: GenericProperties = {};

  objectLoop(properties, (val, key) => {
    if (val === undefined) {
      return;
    }

    let prop: string = key;
    let value: Value = val;

    // Convert left to right
    if (direction && converter) {
      ({ property: prop, value } = converter.convert(baseDirection, direction, prop, value));
    }

    // Set the value after direction change but before prefixing
    props[prop] = value;

    // Inject vendor prefixes
    if (vendor && prefixer) {
      Object.assign(props, prefixer.prefix(prop, value));
    }
  });

  return props;
}
