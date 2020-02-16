import { CacheItem, StyleParams } from './types';

// https://jsperf.com/javascript-objects-vs-map-performance
// https://jsperf.com/performance-of-map-vs-object
export default class AtomicCache {
  cache: { [property: string]: { [value: string]: CacheItem[] } } = {};

  match(item: CacheItem, params: StyleParams): boolean {
    const keys = Object.keys(params);

    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];

      if (item[key as keyof typeof item] !== params[key as keyof typeof params]) {
        return false;
      }
    }

    return true;
  }

  read(
    property: string,
    value: string,
    params: StyleParams,
    minimumRank?: number,
  ): CacheItem | null {
    const propertyCache = this.cache[property];

    if (!propertyCache) {
      return null;
    }

    const valueCache = propertyCache[value];

    if (!valueCache || valueCache.length === 0) {
      return null;
    }

    return (
      valueCache.find(item => {
        if (this.match(item, params)) {
          if (minimumRank !== undefined && item.rank < minimumRank) {
            return false;
          }

          return true;
        }

        return false;
      }) ?? null
    );
  }

  write(property: string, value: string, item: CacheItem): this {
    let propertyCache = this.cache[property];

    if (!propertyCache) {
      propertyCache = {};
      this.cache[property] = propertyCache;
    }

    let valueCache = propertyCache[value];

    if (!valueCache) {
      valueCache = [];
      propertyCache[value] = valueCache;
    }

    valueCache.push(item);

    return this;
  }
}
