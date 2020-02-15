import isNestedSelector from '../../src/helpers/isNestedSelector';

describe('isNestedSelector()', () => {
  it('returns true for attributes', () => {
    expect(isNestedSelector('[disabled] {}')).toBe(true);
  });

  it('returns true for pseudos', () => {
    expect(isNestedSelector(':hover {}')).toBe(true);
    expect(isNestedSelector('::before {}')).toBe(true);
  });

  it('returns true for descendent', () => {
    expect(isNestedSelector('> div {}')).toBe(true);
  });

  it('returns true for sibling', () => {
    expect(isNestedSelector('~ div {}')).toBe(true);
  });

  it('returns true for combinator', () => {
    expect(isNestedSelector('+ div {}')).toBe(true);
  });

  it('returns true for universal', () => {
    expect(isNestedSelector('* {}')).toBe(true);
    expect(isNestedSelector('* div {}')).toBe(true);
  });

  it('returns false for others', () => {
    expect(isNestedSelector('div {}')).toBe(false);
    expect(isNestedSelector('.class {}')).toBe(false);
    expect(isNestedSelector('#id {}')).toBe(false);
    expect(isNestedSelector('@at {}')).toBe(false);
    expect(isNestedSelector('! {}')).toBe(false);
    expect(isNestedSelector('& {}')).toBe(false);
  });
});
