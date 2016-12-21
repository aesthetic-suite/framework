import { expect } from 'chai';
import ClassNameAdapter from '../src/ClassNameAdapter';
import { TEST_CLASS_NAMES } from './mocks';

describe('ClassNameAdapter()', () => {
  it('errors if a non-string is provided', () => {
    expect(() => {
      const instance = new ClassNameAdapter();
      instance.transform('foo', {
        foo: '.valid-class',
        bar: { not: 'valid' },
      });
    }).to.throw(TypeError, '`ClassNameAdapter` expects valid CSS class names; non-string provided for "bar".');
  });

  it('sets and caches class names', () => {
    const instance = new ClassNameAdapter();

    expect(instance.sheets.foo).to.be.an('undefined');
    expect(instance.transform('foo', TEST_CLASS_NAMES)).to.deep.equal(TEST_CLASS_NAMES);
    expect(instance.sheets.foo).to.deep.equal({
      sheet: {},
      classNames: TEST_CLASS_NAMES,
    });
  });
});
