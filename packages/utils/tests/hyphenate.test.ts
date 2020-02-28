import hyphenate from '../src/hyphenate';

describe('hyphenate()', () => {
  it('converts camel cased strings', () => {
    expect(hyphenate('fooBarBaz')).toBe('foo-bar-baz');
  });

  it('doesnt convert already hyphenated strings', () => {
    expect(hyphenate('foo-bar-baz')).toBe('foo-bar-baz');
  });
});
