const CAMEL_CASE_PATTERN = /[A-Z]/gu;
const cache: Record<string, string> = {};

function toLower(match: string): string {
	return `-${match.toLowerCase()}`;
}

function isPrefixed(value: string): boolean {
	return (
		// eslint-disable-next-line no-magic-numbers
		value.slice(0, 2) === 'ms' || value.slice(0, 3) === 'moz' || value.slice(0, 6) === 'webkit'
	);
}

export default function hyphenate(value: string): string {
	if (!cache[value]) {
		let result = value.replace(CAMEL_CASE_PATTERN, toLower);

		if (isPrefixed(result)) {
			result = `-${result}`;
		}

		cache[value] = result;
	}

	return cache[value];
}
