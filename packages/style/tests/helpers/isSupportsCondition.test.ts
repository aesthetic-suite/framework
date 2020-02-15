import isSupportsCondition from '../../src/helpers/isSupportsCondition';

describe('isSupportsCondition()', () => {
  it('returns true if strings starts with @supports', () => {
    expect(isSupportsCondition('@supports  (display: flex)')).toBe(true);
    expect(isSupportsCondition('@supports (display: flex)')).toBe(true);
    expect(isSupportsCondition('@supports(width: 100px)')).toBe(true);
  });

  it('returns false if strings starts with @supports but trails with other letters', () => {
    expect(isSupportsCondition('@supportsx (display: flex)')).toBe(false);
  });

  it('returns false if strings starts with something else', () => {
    expect(isSupportsCondition('@test (display: flex)')).toBe(false);
  });
});
