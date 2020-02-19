import { Aesthetic, ClassNameAdapter } from '../src';

describe('ClassNameAdapter', () => {
  let instance: ClassNameAdapter;

  beforeEach(() => {
    instance = new ClassNameAdapter();
    instance.aesthetic = new Aesthetic();
  });

  it('joins and returns class names', () => {
    expect(instance.transformStyles(['foo', 'bar'], {})).toBe('foo bar');
  });
});
