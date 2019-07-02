import CacheManager from '../src/CacheManager';

describe('CacheManager', () => {
  let manager: CacheManager<{ value: number }>;

  beforeEach(() => {
    manager = new CacheManager();
  });

  it('gets and sets values based on parameters', () => {
    manager.set('foo', { value: 1 }, {});
    manager.set('foo', { value: 2 }, { dir: 'ltr' });
    manager.set('foo', { value: 3 }, { theme: 'light' });
    manager.set('foo', { value: 4 }, { dir: 'ltr', theme: 'light' });
    manager.set('foo', { value: 5 }, { dir: 'rtl' });
    manager.set('foo', { value: 6 }, { dir: 'rtl', theme: 'dark' });

    expect(manager.get('foo', {})).toEqual({ value: 1 });
    expect(manager.get('foo', { dir: 'rtl' })).toEqual({ value: 5 });
    expect(manager.get('foo', { dir: 'ltr', theme: 'dark' })).toBeNull();
    expect(manager.get('foo', { theme: 'light' })).toEqual({ value: 3 });
    expect(manager.get('foo', { theme: 'dark' })).toBeNull();
    expect(manager.get('foo', { theme: 'dark', dir: 'rtl' })).toEqual({ value: 6 });
  });

  it('clears all caches if no filter provided', () => {
    manager.set('foo', { value: 1 }, { dir: 'ltr' });
    manager.set('foo', { value: 2 }, { dir: 'ltr' });
    manager.set('foo', { value: 3 }, { dir: 'ltr' });
    manager.set('bar', { value: 1 }, { theme: 'light' });

    // @ts-ignore Allow access
    expect(manager.cache.size).toBe(2);

    manager.clear();

    // @ts-ignore Allow access
    expect(manager.cache.size).toBe(0);
  });

  it('clears cache with the defined filter', () => {
    manager.set('foo', { value: 1 }, { dir: 'ltr', theme: 'light' });
    manager.set('foo', { value: 2 }, { dir: 'ltr', theme: 'dark' });
    manager.set('foo', { value: 3 }, { dir: 'ltr', theme: 'light' });

    manager.clear(unit => unit.theme === 'light');

    // @ts-ignore Allow access
    const cache = manager.cache.get('foo')!;

    expect(cache).toHaveLength(1);
    expect(cache[0]).toEqual({ dir: 'ltr', theme: 'dark', value: { value: 2 } });
  });
});
