// https://jsperf.com/compare-while-loop-vs-for-loop/30
// https://jsperf.com/for-in-object-key/3
export default function arrayLoop<T extends unknown>(
  array: ArrayLike<T>,
  callback: (item: T, index: number) => void,
) {
  const { length } = array;
  let i = 0;

  while (i < length) {
    callback(array[i], i);
    i += 1;
  }
}
