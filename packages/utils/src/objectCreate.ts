import arrayLoop from './arrayLoop';

export default function objectCreate<K extends string | number, V = unknown>(
  keys: K[],
  callback: (key: K) => V,
): Record<K, V> {
  const object: Partial<Record<K, V>> = {};

  arrayLoop(keys, (key) => {
    object[key] = callback(key);
  });

  return object as Record<K, V>;
}
