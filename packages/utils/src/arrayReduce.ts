export default function arrayReduce<T>(
	array: ArrayLike<T>,
	callback: (item: T, index: number) => string,
	initialValue: string = '',
): string {
	const { length } = array;
	let value = initialValue;
	let i = 0;

	while (i < length) {
		value += callback(array[i], i);
		i += 1;
	}

	return value;
}
