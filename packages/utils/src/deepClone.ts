import { merge } from './deepMerge';

export function deepClone<T extends object>(object: T): T {
	return merge({}, object) as T;
}
