import ClassNameAdapter from '../src/ClassNameAdapter';
import { TEST_CLASS_NAMES } from './mocks';

describe('ClassNameAdapter', () => {
  let instance;

  beforeEach(() => {
    instance = new ClassNameAdapter();
  });

  it('errors if a non-string is provided', () => {
    expect(() => {
      instance.transform('foo', {
        foo: '.valid-class',
        bar: { not: 'valid' },
      });
    }).toThrowError('`ClassNameAdapter` expects valid CSS class names; non-string provided for "bar".');
  });

  it('sets and caches class names', () => {
    expect(instance.transform('foo', TEST_CLASS_NAMES)).toEqual(TEST_CLASS_NAMES);
  });
});
