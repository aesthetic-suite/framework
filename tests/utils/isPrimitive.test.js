import isPrimitive from '../../src/utils/isPrimitive';

describe('utils/isPrimitive()', () => {
  it('returns true if a primitive value', () => {
    expect(isPrimitive(123)).toBe(true);
    expect(isPrimitive('foo')).toBe(true);
    expect(isPrimitive(true)).toBe(true);
  });

  it('returns false if a not a primitive value', () => {
    expect(isPrimitive([])).toBe(false);
    expect(isPrimitive({})).toBe(false);
    expect(isPrimitive(new RegExp())).toBe(false);
  });
});
