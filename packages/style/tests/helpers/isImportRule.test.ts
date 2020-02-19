import isImportRule from '../../src/helpers/isImportRule';

describe('isImportRule()', () => {
  it('returns true if strings starts with @import', () => {
    expect(isImportRule('@import  "foo.css"')).toBe(true);
    expect(isImportRule('@import url("bar.css")')).toBe(true);
  });

  it('returns false if strings starts with @media but trails with other letters', () => {
    expect(isImportRule('@imports "foo.css"')).toBe(false);
  });

  it('returns false if strings starts with something else', () => {
    expect(isImportRule('@test "foo.css"')).toBe(false);
  });
});
