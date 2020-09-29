import { CacheManager, CacheItem, CacheStorage } from '../types';

export default function createCacheManager(defaultItems: CacheStorage = {}): CacheManager {
  const cache: CacheStorage = defaultItems;

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
