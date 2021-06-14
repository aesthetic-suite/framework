import { merge } from './deepMerge';

export default function deepClone<T extends object>(object: T): T {
	return merge({}, object) as T;
}
