import isObject from '../../src/helpers/isObject';

describe('aesthetic/helpers/isObject', () => {
  it('returns false for non-objects', () => {
    expect(isObject('')).toBe(false);
    expect(isObject(123)).toBe(false);
    expect(isObject(true)).toBe(false);
    expect(isObject(undefined)).toBe(false);
  });

  it('returns false for arrays', () => {
    expect(isObject([])).toBe(false);
    expect(isObject([1, 2, 3])).toBe(false);
  });

  it('returns false for null', () => {
    expect(isObject(null)).toBe(false);
  });

  it('returns true for objects', () => {
    expect(isObject({})).toBe(true);
    expect(isObject({ key: 'value' })).toBe(true);
    expect(isObject(Object.create(null))).toBe(true);
  });
});
