import { CacheItem } from './types';

export default class Cache {
  cache: Record<string, CacheItem[]> = {};

  match(item: CacheItem, minimumRank?: number): boolean {
    return minimumRank === undefined || item.rank! > minimumRank;
  }

  read(key: string, minimumRank?: number): CacheItem | null {
    return this.cache[key]?.find((item) => this.match(item, minimumRank)) || null;
  }

  write(key: string, item: CacheItem): this {
    const cache = this.cache[key] || [];

    cache.push(item);

    this.cache[key] = cache;

    return this;
  }
}
