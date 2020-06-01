import { CacheItem, RenderOptions } from './types';

// https://jsperf.com/javascript-objects-vs-map-performance
// https://jsperf.com/performance-of-map-vs-object
export default class AtomicCache {
  cache: { [property: string]: { [value: string]: CacheItem[] } } = {};

  match(item: CacheItem, options: RenderOptions, minimumRank?: number): boolean {
    if (minimumRank !== undefined && item.rank < minimumRank) {
      return false;
    }

    if (item.selector !== options.selector) {
      return false;
    }

    if (item.type !== options.type) {
      return false;
    }

    if (item.conditions.length !== options.conditions?.length) {
      return false;
    }

    return (options.conditions || []).every(
      (i) => !!item.conditions.find((p) => p.query === i.query && p.type === i.type),
    );
  }

  read(
    property: string,
    value: string,
    options: RenderOptions,
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

    return valueCache.find((item) => this.match(item, options, minimumRank)) ?? null;
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
