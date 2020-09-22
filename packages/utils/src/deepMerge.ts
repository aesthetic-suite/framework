/* eslint-disable no-param-reassign, no-use-before-define, @typescript-eslint/no-use-before-define */

import arrayLoop from './arrayLoop';
import objectLoop from './objectLoop';
import isObject from './isObject';

export function merge(base: object, next: object): object {
  objectLoop(next, (right, key) => {
    if (isObject(right)) {
      base[key] = deepMerge(base[key], right);
    } else {
      base[key] = right;
    }
  });

  return base;
}

export default function deepMerge<T = object>(...objects: unknown[]): T {
  if (objects.length === 1) {
    return objects[0] as T;
  }

  const result: object = {};

  arrayLoop(objects, (object) => {
    if (isObject(object)) {
      merge(result, object);
    }
  });

  return (result as unknown) as T;
}
