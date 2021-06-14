/* eslint-disable no-bitwise */

const WEBKIT = 1;
const MOZ = 2;
const MS = 4;

export default function getPrefixesFromMask(mask: number = 0): string[] {
	const prefixes: string[] = [];

	if (mask & MS) {
		prefixes.push('-ms-');
	}

	if (mask & MOZ) {
		prefixes.push('-moz-');
	}

	if (mask & WEBKIT) {
		prefixes.push('-webkit-');
	}

	return prefixes;
}
