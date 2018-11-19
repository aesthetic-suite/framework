import stripClassPrefix from '../../src/helpers/stripClassPrefix';

describe('stripClassPrefix()', () => {
  it('removes leading period', () => {
    expect(stripClassPrefix('foo')).toBe('foo');
    expect(stripClassPrefix('.foo')).toBe('foo');
  });
});
