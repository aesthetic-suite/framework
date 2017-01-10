import { expect } from 'chai';
import isObject from '../../src/utils/isObject';

describe('utils/isObject', () => {
  it('returns false for non-objects', () => {
    expect(isObject('')).to.equal(false);
    expect(isObject(123)).to.equal(false);
    expect(isObject(true)).to.equal(false);
    expect(isObject(undefined)).to.equal(false);
  });

  it('returns false for arrays', () => {
    expect(isObject([])).to.equal(false);
    expect(isObject([1, 2, 3])).to.equal(false);
  });

  it('returns false for null', () => {
    expect(isObject(null)).to.equal(false);
  });

  it('returns true for objects', () => {
    expect(isObject({})).to.equal(true);
    expect(isObject({ key: 'value' })).to.equal(true);
    expect(isObject(Object.create(null))).to.equal(true);
  });
});
