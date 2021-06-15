/* eslint-disable no-param-reassign, @typescript-eslint/no-use-before-define */

import { arrayLoop } from './arrayLoop';
import { isObject } from './isObject';
import { objectLoop } from './objectLoop';

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

export function deepMerge<T = object>(...objects: unknown[]): T {
	if (objects.length === 1) {
		return objects[0] as T;
	}

	const result: object = {};

	arrayLoop(objects, (object) => {
		if (isObject(object)) {
			merge(result, object);
		}
	});

	return result as unknown as T;
}
