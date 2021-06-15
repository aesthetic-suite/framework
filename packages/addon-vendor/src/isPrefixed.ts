export function isPrefixed(value: string): boolean {
	return value.startsWith('-ms') || value.startsWith('-moz') || value.startsWith('-webkit');
}
