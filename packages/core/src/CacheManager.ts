import { Direction, ThemeName } from './types';

export interface CacheTags {
  dir?: Direction;
  global?: boolean;
  theme?: ThemeName;
}

export interface CacheUnit<T> extends CacheTags {
  value: T;
}

export default class CacheManager<T> {
  protected cache: Map<string, CacheUnit<T>[]> = new Map();

  compare(unit: CacheUnit<T>, tags: CacheTags): boolean {
    return unit.dir === tags.dir && unit.global === tags.global && unit.theme === tags.theme;
  }

  get(key: string, tags: CacheTags): T | null {
    const units = this.cache.get(key);

    if (!units || units.length === 0) {
      return null;
    }

    const cache = units.find(unit => this.compare(unit, tags));

    return cache ? cache.value : null;
  }

  set(key: string, value: T, tags: CacheTags): T {
    const units = this.cache.get(key) || [];

    units.push({
      ...tags,
      value,
    });

    this.cache.set(key, units);

    return value;
  }
}
