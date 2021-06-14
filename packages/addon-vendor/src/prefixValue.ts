import { getPrefixesFromMask } from './getPrefixesFromMask';
import { PrefixMap } from './types';

export function prefixValue(value: string, values: PrefixMap): string[] {
	const mask = values[value];

	if (!mask) {
		return [value];
	}

	return [
		...getPrefixesFromMask(values[value]).map((prefix) => prefix + value),
		// Modern value must be last
		value,
	];
}
