import extend from 'extend';

export default function deepMerge<T = object>(...objects: object[]): T {
  return extend(true, {}, ...objects);
}
