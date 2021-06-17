/**
 * @copyright   2020, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import { getPropertyDoppelganger, getValueDoppelganger } from 'rtl-css-js/core';
import { DirectionConverter, NativeProperty } from '@aesthetic/types';

const converter: DirectionConverter = {
	convert(from, to, property, value) {
		if (from === to) {
			return { property, value };
		}

		return {
			property: getPropertyDoppelganger(property) as NativeProperty,
			value: getValueDoppelganger(property, value),
		};
	},
};

export default converter;
