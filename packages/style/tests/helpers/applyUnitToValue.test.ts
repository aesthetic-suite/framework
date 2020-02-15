import applyUnitToValue from '../../src/helpers/applyUnitToValue';

describe('applyUnitToValue()', () => {
  it('does nothing to strings', () => {
    expect(applyUnitToValue('display', 'foo')).toBe('foo');
    expect(applyUnitToValue('display', '100px')).toBe('100px');
    expect(applyUnitToValue('display', 'red')).toBe('red');
  });

  it('does nothing to zeros', () => {
    expect(applyUnitToValue('width', 0)).toBe('0');
  });

  it('does nothing to unitless properties', () => {
    expect(applyUnitToValue('lineHeight', 1.5)).toBe('1.5');
  });

  it('does nothing if a unit already exists', () => {
    expect(applyUnitToValue('width', '100em')).toBe('100em');
    expect(applyUnitToValue('height', '10vh')).toBe('10vh');
  });

  it('appends px to numbers', () => {
    expect(applyUnitToValue('width', 100)).toBe('100px');
  });
});
