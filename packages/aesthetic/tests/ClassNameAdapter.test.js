import ClassNameAdapter from '../src/ClassNameAdapter';

describe('aesthetic/ClassNameAdapter', () => {
  let instance;

  beforeEach(() => {
    instance = new ClassNameAdapter();
  });

  it('errors if a non-string is provided', () => {
    expect(() => {
      instance.transform(
        'valid-class',
        { not: 'valid' },
      );
    }).toThrowError('ClassNameAdapter expects valid CSS class names.');
  });

  it('joins and returns class names', () => {
    expect(instance.transform('foo', 'bar')).toBe('foo bar');
  });
});
