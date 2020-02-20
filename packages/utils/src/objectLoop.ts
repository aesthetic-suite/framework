import arrayLoop from './arrayLoop';

export type StringKey<T> = T extends string ? T : string;

export default function objectLoop<T extends object, K extends keyof T>(
  object: T,
  callback: (value: T[K], key: StringKey<K>) => void,
) {
  arrayLoop(Object.keys(object) as K[], key => callback(object[key], key as StringKey<K>));
}
