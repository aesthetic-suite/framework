/**
 * @copyright   2020, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import { getPropertyDoppelganger, getValueDoppelganger } from 'rtl-css-js/core';
import { Direction, NativeProperty, Value } from '@aesthetic/types';

export default {
	convert<T extends Value>(
		from: Direction,
		to: Direction,
		property: NativeProperty,
		value: T,
	): { property: NativeProperty; value: T } {
		if (from === to) {
			return { property, value };
		}

		return {
			property: getPropertyDoppelganger(property) as NativeProperty,
			value: getValueDoppelganger(property, value),
		};
	},
};
