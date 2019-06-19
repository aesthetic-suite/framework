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
});
