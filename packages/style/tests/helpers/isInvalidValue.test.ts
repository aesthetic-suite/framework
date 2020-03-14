import isInvalidValue from '../../src/helpers/isInvalidValue';

describe('isInvalidValue()', () => {
  it('returns true for an empty string', () => {
    expect(isInvalidValue('')).toBe(true);
  });

  it('returns true for null', () => {
    expect(isInvalidValue(null)).toBe(true);
  });

  it('returns true for undefined', () => {
    expect(isInvalidValue(undefined)).toBe(true);
  });

  it('returns true for non-string/number/object', () => {
    expect(isInvalidValue(true)).toBe(true);
    expect(isInvalidValue(Symbol('test'))).toBe(true);
  });
});
