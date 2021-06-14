import { NativeProperty, PropertyPrefixes } from '@aesthetic/types';
import { arrayLoop } from '@aesthetic/utils';
import { declarationMapping } from './data';
import { getPrefixesFromMask } from './getPrefixesFromMask';
import { isPrefixed } from './isPrefixed';
import { prefixValue } from './prefixValue';
import { prefixValueFunction } from './prefixValueFunction';

export function prefix(property: NativeProperty, value: string): PropertyPrefixes {
	const map = declarationMapping[property];

	if (!map || isPrefixed(property)) {
		return { [property]: value };
	}

	const { prefixes: mask, functions, values } = map;
	const prefixed: PropertyPrefixes = {};
	let nextValue: string[] | string;

	if (functions) {
		nextValue = prefixValueFunction(value, functions);
	} else if (values) {
		nextValue = prefixValue(value, values);
	} else {
		nextValue = value;
	}

	// Prefixed properties come first
	arrayLoop(getPrefixesFromMask(mask), (affix) => {
		prefixed[affix + property] = nextValue;
	});

	// Base property comes last
	prefixed[property] = nextValue;

	return prefixed;
}
