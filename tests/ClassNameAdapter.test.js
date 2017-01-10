import { expect } from 'chai';
import ClassNameAdapter from '../src/ClassNameAdapter';
import { TEST_CLASS_NAMES } from './mocks';

describe('ClassNameAdapter', () => {
  let instance;

  beforeEach(() => {
    instance = new ClassNameAdapter();
  });

  it('errors if a non-string is provided', () => {
    expect(() => {
      instance.transformStyles('foo', {
        foo: '.valid-class',
        bar: { not: 'valid' },
      });
    }).to.throw(TypeError,
      '`ClassNameAdapter` expects valid CSS class names; non-string provided for "bar".');
  });

  it('sets and caches class names', () => {
    expect(instance.transformStyles('foo', TEST_CLASS_NAMES)).to.deep.equal(TEST_CLASS_NAMES);
  });
});
