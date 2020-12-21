import {
  CacheItem,
  CacheManager,
  CacheState,
  RenderOptions,
  Value,
  ValueWithFallbacks,
} from '@aesthetic/types';

export function createCacheKey(
  property: string,
  value: Value | ValueWithFallbacks,
  { media = '', selector = '', supports = '' }: RenderOptions,
): string {
  return supports + media + selector + property + value;
}

export function createCacheManager(defaultItems: CacheState = {}): CacheManager {
  const cache: CacheState = defaultItems;

  return {
    read(key, minimumRank) {
      const items = cache[key];

      if (!items) {
        return null;
      } else if (minimumRank === undefined) {
        return items[0];
      }

      return items.find((item) => item.rank! >= minimumRank) || null;
    },

    write(key: string, item: CacheItem) {
      const result = cache[key] || [];

      result.push(item);

      cache[key] = result;
    },
  };
}
