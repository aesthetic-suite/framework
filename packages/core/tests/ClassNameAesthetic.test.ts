import ClassNameAesthetic from '../src/ClassNameAesthetic';

describe('ClassNameAesthetic', () => {
  let instance: ClassNameAesthetic<any>;

  beforeEach(() => {
    instance = new ClassNameAesthetic();
  });

  describe('transformToClassName()', () => {
    it('joins and returns class names', () => {
      // @ts-ignore Allow access
      expect(instance.transformToClassName(['foo', 'bar'])).toBe('foo bar');
    });
  });
});
