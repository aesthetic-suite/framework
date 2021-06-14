export default function toArray<T>(value: T | T[]): T[] {
	if (!value) {
		return [];
	}

	return Array.isArray(value) ? value : [value];
}
