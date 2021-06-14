export default function isPrefixed(value: string): boolean {
	return (
		// eslint-disable-next-line no-magic-numbers
		value.slice(0, 3) === '-ms' || value.slice(0, 4) === '-moz' || value.slice(0, 7) === '-webkit'
	);
}
