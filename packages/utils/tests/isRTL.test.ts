import isRTL from '../src/isRTL';

describe('isRTL()', () => {
  it('returns true if direction is `rtl`', () => {
    expect(isRTL('rtl')).toBe(true);
  });

  it('returns false if direction is `ltr`', () => {
    expect(isRTL('ltr')).toBe(false);
  });

  it('returns false if direction is `neutral`', () => {
    expect(isRTL('neutral')).toBe(false);
  });
});
