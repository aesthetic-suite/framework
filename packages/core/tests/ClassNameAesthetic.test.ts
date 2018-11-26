import ClassNameAesthetic from '../src/ClassNameAesthetic';

describe('ClassNameAesthetic', () => {
  let instance: ClassNameAesthetic<any>;

  beforeEach(() => {
    instance = new ClassNameAesthetic();
  });

  describe('transformToClassName()', () => {
    it('joins and returns class names', () => {
      expect(instance.transformToClassName(['foo', 'bar'])).toBe('foo bar');
    });
  });
});
