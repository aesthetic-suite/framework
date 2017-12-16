import toArray from '../../src/helpers/toArray';

describe('aesthetic/helpers/toArray()', () => {
  it('returns an array from a non-array value', () => {
    expect(toArray(123)).toEqual([123]);
    expect(toArray('foo')).toEqual(['foo']);
    expect(toArray(true)).toEqual([true]);
  });

  it('returns an array as is', () => {
    expect(toArray([123, 'foo'])).toEqual([123, 'foo']);
  });
});
