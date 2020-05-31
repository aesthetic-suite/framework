import prefixValue from '../../src/helpers/prefixValue';

describe('prefixValue()', () => {
  it('doesnt prefix for unsupported value', () => {
    expect(prefixValue('min-width', {})).toBe('min-width');
    expect(prefixValue('min-width', { 'min-width': 0 })).toBe('min-width');
  });

  it('doesnt prefix for number values', () => {
    expect(prefixValue(123, {})).toBe(123);
  });

  it('prefixes for values that have a mapping', () => {
    expect(
      prefixValue('min-width', {
        'min-width': 5,
      }),
    ).toEqual(['-ms-min-width', '-webkit-min-width', 'min-width']);
  });
});
