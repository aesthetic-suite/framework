import { Direction, ThemeName } from './types';

export interface CacheParams {
  dir?: Direction;
  theme?: ThemeName;
}

export interface CacheUnit<T> extends CacheParams {
  value: T;
}

export default class CacheManager<T> {
  protected cache: Map<string, CacheUnit<T>[]> = new Map();

  compare(unit: CacheUnit<T>, params: CacheParams): boolean {
    return unit.dir === params.dir && unit.theme === params.theme;
  }

  get(key: string, params: CacheParams): T | null {
    const units = this.cache.get(key);

    if (!units || units.length === 0) {
      return null;
    }

    const cache = units.find(unit => this.compare(unit, params));

    return cache ? cache.value : null;
  }

  set(key: string, value: T, params: CacheParams): T {
    const units = this.cache.get(key) || [];

    units.push({
      ...params,
      value,
    });

    this.cache.set(key, units);

    return value;
  }
}
