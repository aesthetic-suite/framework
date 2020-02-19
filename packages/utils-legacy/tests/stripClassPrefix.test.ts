import stripClassPrefix from '../src/stripClassPrefix';

describe('stripClassPrefix()', () => {
  it('removes leading period', () => {
    expect(stripClassPrefix('foo')).toBe('foo');
    expect(stripClassPrefix('.foo')).toBe('foo');
  });
});
