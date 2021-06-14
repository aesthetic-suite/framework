export default function isObject<T = object>(value: unknown): value is T {
	return value !== null && !Array.isArray(value) && typeof value === 'object';
}
