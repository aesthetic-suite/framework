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
  { selectors, conditions }: RenderOptions,
): string {
  let key = `${property}:${value}`;

  if (selectors && selectors.length > 0) {
    key += `:${selectors.join(':')}`;
  }

  if (conditions && conditions.length > 0) {
    key += `:${conditions.join(':')}`;
  }

  return key;
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
