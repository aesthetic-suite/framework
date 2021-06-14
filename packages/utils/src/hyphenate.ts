const CAMEL_CASE_PATTERN = /[A-Z]/gu;
const cache: Record<string, string> = {};

function toLower(match: string): string {
	return `-${match.toLowerCase()}`;
}

function isPrefixed(value: string): boolean {
	return value.startsWith('ms') || value.startsWith('moz') || value.startsWith('webkit');
}

export function hyphenate(value: string): string {
	if (!cache[value]) {
		let result = value.replace(CAMEL_CASE_PATTERN, toLower);

		if (isPrefixed(result)) {
			result = `-${result}`;
		}

		cache[value] = result;
	}

	return cache[value];
}
