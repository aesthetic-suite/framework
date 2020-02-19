import isMediaRule from '../../src/helpers/isMediaRule';

describe('isMediaRule()', () => {
  it('returns true if strings starts with @media', () => {
    expect(isMediaRule('@media  (width: 500px)')).toBe(true);
    expect(isMediaRule('@media (width: 500px)')).toBe(true);
    expect(isMediaRule('@media(width: 100px)')).toBe(true);
  });

  it('returns false if strings starts with @media but trails with other letters', () => {
    expect(isMediaRule('@medias (width: 500px)')).toBe(false);
  });

  it('returns false if strings starts with something else', () => {
    expect(isMediaRule('@test (width: 500px)')).toBe(false);
  });
});
