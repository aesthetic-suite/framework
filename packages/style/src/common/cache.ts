import { CacheItem, CacheManager, CacheState, ClassName, RenderOptions } from '@aesthetic/types';

export function createCacheKey(
	property: string,
	value: unknown,
	{ media = '', selector = '', supports = '' }: RenderOptions,
): string {
	return supports + media + selector + property + String(value);
}

export function createCacheManager(
	defaultItems: CacheState<ClassName> = {},
): CacheManager<ClassName> {
	const cache: CacheState<ClassName> = defaultItems;

	return {
		read(key, minimumRank) {
			const items = cache[key];

			if (!items) {
				return null;
			}

			if (minimumRank === undefined) {
				return items[0];
			}

			return items.find((item) => item.rank! >= minimumRank) ?? null;
		},

		write(key: string, item: CacheItem<ClassName>) {
			const result = cache[key] || [];

			result.push(item);

			cache[key] = result;
		},
	};
}
