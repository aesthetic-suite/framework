import { expect } from 'chai';
import isPrimitive from '../../src/utils/isPrimitive';

describe('utils/isPrimitive()', () => {
  it('returns true if a primitive value', () => {
    expect(isPrimitive(123)).to.equal(true);
    expect(isPrimitive('foo')).to.equal(true);
    expect(isPrimitive(true)).to.equal(true);
  });

  it('returns false if a not a primitive value', () => {
    expect(isPrimitive([])).to.equal(false);
    expect(isPrimitive({})).to.equal(false);
    expect(isPrimitive(new RegExp())).to.equal(false);
  });
});
