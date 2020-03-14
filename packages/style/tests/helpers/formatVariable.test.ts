import formatVariable from '../../src/helpers/formatVariable';

describe('formatVariable()', () => {
  it('returns a property and value as a CSS variable', () => {
    expect(formatVariable('--color', 'red')).toBe('--color:red;');
  });

  it('applies -- prefix if it does not exist', () => {
    expect(formatVariable('color', 'red')).toBe('--color:red;');
  });
});
