import formatCssVariable from '../../src/helpers/formatCssVariable';

describe('formatCssVariable()', () => {
  it('returns a property and value as a CSS variable', () => {
    expect(formatCssVariable('--color', 'red')).toBe('--color:red;');
  });

  it('applies -- prefix if it does not exist', () => {
    expect(formatCssVariable('color', 'red')).toBe('--color:red;');
  });
});
