export default function createState<T>(defaultValue?: T) {
	let value: T | undefined = defaultValue;

	return {
		get() {
			return value;
		},
		reset() {
			value = undefined;
		},
		set(nextValue: T) {
			value = nextValue;
		},
	};
}
