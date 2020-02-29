import formatDeclaration from '../../src/helpers/formatDeclaration';

describe('formatDeclaration()', () => {
  it('returns a property and value as a CSS declaration', () => {
    expect(formatDeclaration('display', 'flex')).toBe('display:flex;');
  });

  it('supports vendor prefixes and fallbacks by using an array of values', () => {
    expect(
      formatDeclaration('display', [
        '-webkit-box',
        '-moz-box',
        '-ms-flexbox',
        '-webkit-flex',
        'flex',
      ]),
    ).toBe(
      'display:-webkit-box;display:-moz-box;display:-ms-flexbox;display:-webkit-flex;display:flex;',
    );
  });
});
