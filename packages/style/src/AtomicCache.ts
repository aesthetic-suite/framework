import { camelCaseProperty } from 'css-in-js-utils';
import { Property, Value, CacheItem, Properties, StyleParams } from './types';

export default class AtomicCache {
  protected cache = new Map<Property, Map<Value, CacheItem[]>>();

  clear(): this {
    this.cache.clear();

    return this;
  }

  read<K extends Property>(
    property: K,
    value: Properties[K],
    params: StyleParams,
  ): CacheItem | null {
    const propertyCache = this.cache.get(camelCaseProperty(property));

    if (!propertyCache) {
      return null;
    }

    const valueCache = propertyCache.get(value!);

    if (!valueCache || valueCache.length === 0) {
      return null;
    }

    return (
      valueCache.find(item => Object.entries(params).every(([key, val]) => item[key] === val)) ??
      null
    );
  }

  write<K extends Property>(property: K, value: Properties[K], item: CacheItem): this {
    const key = camelCaseProperty(property);
    let propertyCache = this.cache.get(key);

    if (!propertyCache) {
      propertyCache = new Map();
      this.cache.set(key, propertyCache);
    }

    let valueCache = propertyCache.get(value!);

    if (!valueCache) {
      valueCache = [];
      propertyCache.set(value!, valueCache);
    }

    valueCache.push(item);

    return this;
  }
}
