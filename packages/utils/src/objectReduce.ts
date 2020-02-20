import arrayReduce from './arrayReduce';

export default function objectReduce<T extends object, K extends keyof T>(
  object: T,
  callback: (value: T[K], key: K) => string,
  initialValue: string = '',
): string {
  return arrayReduce(Object.keys(object) as K[], key => callback(object[key], key), initialValue);
}
