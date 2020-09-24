import { StringKey } from './types';

export default function objectLoop<T extends object, K extends keyof T>(
  object: T,
  callback: (value: T[K], key: StringKey<K>) => void,
) {
  const keys = Object.keys(object);
  const l = keys.length;
  let i = 0;

  while (i < l) {
    const key = keys[i] as K;

    callback(object[key], key as StringKey<K>);
    i += 1;
  }
}
