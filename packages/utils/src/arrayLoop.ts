// https://jsperf.com/compare-while-loop-vs-for-loop/30
// https://jsperf.com/for-in-object-key/3
export function arrayLoop<T>(
	array: ArrayLike<T> | undefined,
	callback: (item: T, index: number) => void,
	reverse: boolean = false,
) {
	if (array === undefined) {
		return;
	}

	const { length } = array;
	let i = 0;

	while (i < length) {
		const x = reverse ? length - i - 1 : i;

		callback(array[x], x);
		i += 1;
	}
}
