import { expect } from 'chai';
import toArray from '../../src/utils/toArray';

describe('utils/toArray()', () => {
  it('returns an array from a non-array value', () => {
    expect(toArray(123)).to.deep.equal([123]);
    expect(toArray('foo')).to.deep.equal(['foo']);
    expect(toArray(true)).to.deep.equal([true]);
  });

  it('returns an array as is', () => {
    expect(toArray([123, 'foo'])).to.deep.equal([123, 'foo']);
  });
});
