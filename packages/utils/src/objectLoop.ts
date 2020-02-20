import arrayLoop from './arrayLoop';

export default function objectLoop<T extends object, K extends keyof T>(
  object: T,
  callback: (value: T[K], key: K) => void,
) {
  arrayLoop(Object.keys(object) as K[], key => callback(object[key], key));
}
