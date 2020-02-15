import isMediaQueryCondition from '../../src/helpers/isMediaQueryCondition';

describe('isMediaQueryCondition()', () => {
  it('returns true if strings starts with @media', () => {
    expect(isMediaQueryCondition('@media  (width: 500px)')).toBe(true);
    expect(isMediaQueryCondition('@media (width: 500px)')).toBe(true);
    expect(isMediaQueryCondition('@media(width: 100px)')).toBe(true);
  });

  it('returns false if strings starts with @media but trails with other letters', () => {
    expect(isMediaQueryCondition('@medias (width: 500px)')).toBe(false);
  });

  it('returns false if strings starts with something else', () => {
    expect(isMediaQueryCondition('@test (width: 500px)')).toBe(false);
  });
});
