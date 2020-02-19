import isSupportsRule from '../../src/helpers/isSupportsRule';

describe('isSupportsRule()', () => {
  it('returns true if strings starts with @supports', () => {
    expect(isSupportsRule('@supports  (display: flex)')).toBe(true);
    expect(isSupportsRule('@supports (display: flex)')).toBe(true);
    expect(isSupportsRule('@supports(width: 100px)')).toBe(true);
  });

  it('returns false if strings starts with @supports but trails with other letters', () => {
    expect(isSupportsRule('@supportsx (display: flex)')).toBe(false);
  });

  it('returns false if strings starts with something else', () => {
    expect(isSupportsRule('@test (display: flex)')).toBe(false);
  });
});
