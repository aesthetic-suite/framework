import ClassNameAesthetic from '../src/ClassNameAesthetic';

describe('ClassNameAesthetic', () => {
  let instance: ClassNameAesthetic<any>;

  beforeEach(() => {
    instance = new ClassNameAesthetic();
  });

  it('joins and returns class names', () => {
    expect(instance.transformStyles(['foo', 'bar'], {})).toBe('foo bar');
  });
});
